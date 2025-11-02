import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Registration from '@/models/Registration';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();

    // Validate required fields
    const {
      name,
      age,
      email,
      phone,
      lga,
      city,
      state,
      country,
      expectations,
      inviteSomeone,
    } = body;

    if (!name || !age || !email || !phone || !lga || !city || !state || !country || !expectations || !inviteSomeone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If inviting someone, validate invitee details
    if (inviteSomeone === 'yes') {
      if (!body.inviteeName || !body.inviteePhone) {
        return NextResponse.json(
          { success: false, error: 'Invitee name and phone are required when inviting someone' },
          { status: 400 }
        );
      }
    }

    // Check for existing registration with same email
    const existingRegistration = await Registration.findOne({ email: email.toLowerCase() });
    
    if (existingRegistration) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'This email is already registered',
          registrationNumber: existingRegistration.registrationNumber 
        },
        { status: 409 }
      );
    }

    // Create new registration
    const registration = new Registration({
      name,
      age,
      email,
      phone,
      lga,
      city,
      state,
      country,
      cefZone: body.cefZone || undefined,
      expectations,
      inviteSomeone,
      inviteeName: inviteSomeone === 'yes' ? body.inviteeName : undefined,
      inviteePhone: inviteSomeone === 'yes' ? body.inviteePhone : undefined,
    });

    // Save to database
    await registration.save();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Registration submitted successfully!',
        data: {
          registrationNumber: registration.registrationNumber,
          name: registration.name,
          email: registration.email,
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'This email is already registered' },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve registration by email or registration number
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const registrationNumber = searchParams.get('registrationNumber');

    if (!email && !registrationNumber) {
      return NextResponse.json(
        { success: false, error: 'Please provide email or registration number' },
        { status: 400 }
      );
    }

    let registration;
    if (registrationNumber) {
      registration = await Registration.findOne({ registrationNumber });
    } else if (email) {
      registration = await Registration.findOne({ email: email.toLowerCase() });
    }

    if (!registration) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: registration,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching registration:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
