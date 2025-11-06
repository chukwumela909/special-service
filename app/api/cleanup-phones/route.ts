import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Registration from '@/models/Registration';

// Helper function to clean phone numbers
const cleanPhoneNumber = (phone: string): string => {
  if (!phone) return phone;
  
  // Remove all spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-()]/g, '');
  
  // Remove +234 or 234 prefix
  if (cleaned.startsWith('+234')) {
    cleaned = cleaned.slice(4);
  } else if (cleaned.startsWith('234')) {
    cleaned = cleaned.slice(3);
  }
  
  // Remove leading 0
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }
  
  return cleaned;
};

export async function POST() {
  try {
    await connectDB();

    // Get all registrations
    const registrations = await Registration.find({});
    
    let updatedCount = 0;
    let errors = [];

    for (const reg of registrations) {
      try {
        let needsUpdate = false;
        const updates: any = {};

        // Clean main phone number
        if (reg.phone) {
          const cleanedPhone = cleanPhoneNumber(reg.phone);
          if (cleanedPhone !== reg.phone) {
            updates.phone = cleanedPhone;
            needsUpdate = true;
          }
        }

        // Ensure countryCode exists (default to +234 if missing)
        if (!reg.countryCode) {
          updates.countryCode = '+234';
          needsUpdate = true;
        }

        // Clean invitee phone number if exists
        if (reg.inviteePhone) {
          const cleanedInviteePhone = cleanPhoneNumber(reg.inviteePhone);
          if (cleanedInviteePhone !== reg.inviteePhone) {
            updates.inviteePhone = cleanedInviteePhone;
            needsUpdate = true;
          }
        }

        // Ensure inviteeCountryCode exists if inviteePhone exists
        if (reg.inviteePhone && !reg.inviteeCountryCode) {
          updates.inviteeCountryCode = '+234';
          needsUpdate = true;
        }

        // Update if needed
        if (needsUpdate) {
          await Registration.findByIdAndUpdate(reg._id, updates);
          updatedCount++;
        }
      } catch (error: any) {
        errors.push({
          id: reg._id,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Phone number cleanup completed',
      data: {
        totalRecords: registrations.length,
        updatedRecords: updatedCount,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error: any) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to cleanup phone numbers',
      },
      { status: 500 }
    );
  }
}
