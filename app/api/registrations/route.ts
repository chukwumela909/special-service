import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Registration from '@/models/Registration';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build search query
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get total count
    const totalCount = await Registration.countDocuments(query);

    // Get paginated registrations
    const registrations = await Registration.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get statistics
    const stats = {
      total: totalCount,
      withInvitees: await Registration.countDocuments({ inviteSomeone: 'yes' }),
      withCEFZone: await Registration.countDocuments({ cefZone: { $exists: true, $ne: '' } }),
      byAgeRange: await Registration.aggregate([
        { $group: { _id: '$age', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      byCountry: await Registration.aggregate([
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      recentRegistrations: await Registration.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }),
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          registrations,
          pagination: {
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
          },
          stats,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}
