import mongoose, { Schema, Model } from 'mongoose';

export interface IRegistration {
  name: string;
  age: string;
  email: string;
  countryCode: string;
  phone: string;
  lga: string;
  city: string;
  state: string;
  country: string;
  cefZone?: string;
  expectations: string;
  inviteSomeone: 'yes' | 'no';
  inviteeName?: string;
  inviteeCountryCode?: string;
  inviteePhone?: string;
  registrationNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    age: {
      type: String,
      required: [true, 'Age range is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    countryCode: {
      type: String,
      required: [true, 'Country code is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    lga: {
      type: String,
      required: [true, 'LGA is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    cefZone: {
      type: String,
      trim: true,
    },
    expectations: {
      type: String,
      required: [true, 'Expectations are required'],
    },
    inviteSomeone: {
      type: String,
      enum: ['yes', 'no'],
      required: true,
      default: 'no',
    },
    inviteeName: {
      type: String,
      trim: true,
    },
    inviteeCountryCode: {
      type: String,
      trim: true,
    },
    inviteePhone: {
      type: String,
      trim: true,
    },
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate registration number before saving
RegistrationSchema.pre('save', function (next) {
  if (!this.registrationNumber) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    this.registrationNumber = `REG-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

// Prevent model recompilation in development
const Registration: Model<IRegistration> =
  mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema);

export default Registration;
