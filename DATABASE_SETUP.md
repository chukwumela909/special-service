# Database Setup Guide

## MongoDB Integration Complete! 🎉

Your registration form is now connected to MongoDB and ready to save data.

## What's Been Added

### 1. **Database Connection** (`lib/db.ts`)
- Efficient connection pooling
- Automatic reconnection handling
- Environment-based configuration

### 2. **Registration Model** (`models/Registration.ts`)
- Complete schema with all form fields
- Automatic registration number generation (e.g., `REG-12ABC-XYZ45`)
- Timestamps (createdAt, updatedAt)
- Email indexing for fast lookups
- Validation rules

### 3. **API Route** (`app/api/register/route.ts`)
- **POST** `/api/register` - Submit new registration
- **GET** `/api/register?email=xxx` - Retrieve registration by email
- **GET** `/api/register?registrationNumber=xxx` - Retrieve by registration number
- Duplicate email detection
- Comprehensive error handling

### 4. **Updated Form Component**
- Real API integration (no more simulation)
- Registration number display on success
- Error message handling
- Loading states

## Setup Instructions

### Step 1: Create Environment File

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
Copy-Item .env.local.example .env.local
```

Then edit `.env.local` and add your MongoDB connection string:

```env
MONGODB_URI=your_mongodb_connection_string_here
```

### Step 2: MongoDB Options

#### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with `special-service`

Example:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/special-service?retryWrites=true&w=majority
```

#### Option B: Local MongoDB
1. Install MongoDB locally: [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use this connection string:
```
MONGODB_URI=mongodb://localhost:27017/special-service
```

### Step 3: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## API Endpoints

### Submit Registration
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "age": "25-35",
  "email": "john@example.com",
  "phone": "+234 800 000 0000",
  "lga": "Ikeja",
  "city": "Lagos",
  "state": "Lagos",
  "country": "Nigeria",
  "cefZone": "Zone A",
  "expectations": "I'm trusting God for...",
  "inviteSomeone": "yes",
  "inviteeName": "Jane Doe",
  "inviteePhone": "+234 800 000 0001"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration submitted successfully!",
  "data": {
    "registrationNumber": "REG-12ABC-XYZ45",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (409 - Duplicate):**
```json
{
  "success": false,
  "error": "This email is already registered",
  "registrationNumber": "REG-12ABC-XYZ45"
}
```

### Retrieve Registration
```http
GET /api/register?email=john@example.com
# OR
GET /api/register?registrationNumber=REG-12ABC-XYZ45
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "age": "25-35",
    "email": "john@example.com",
    "registrationNumber": "REG-12ABC-XYZ45",
    "createdAt": "2025-11-02T...",
    "updatedAt": "2025-11-02T..."
  }
}
```

## Features Implemented

✅ **Automatic Registration Number** - Unique ID for each registration  
✅ **Duplicate Prevention** - Can't register with same email twice  
✅ **Timestamps** - Track when registrations are created/updated  
✅ **Validation** - Server-side validation for all required fields  
✅ **Error Handling** - User-friendly error messages  
✅ **Success Display** - Shows registration number after submission  
✅ **Query Support** - Retrieve registrations by email or number  

## Database Schema

```typescript
{
  name: String (required)
  age: String (required)
  email: String (required, unique, indexed)
  phone: String (required)
  lga: String (required)
  city: String (required)
  state: String (required)
  country: String (required)
  cefZone: String (optional)
  expectations: String (required)
  inviteSomeone: 'yes' | 'no' (required)
  inviteeName: String (optional)
  inviteePhone: String (optional)
  registrationNumber: String (auto-generated, unique)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

## Testing

### Test the Form
1. Go to `http://localhost:3002`
2. Fill out the form
3. Submit
4. Check for success message with registration number

### Verify in Database
If using MongoDB Atlas:
1. Go to your cluster
2. Click "Collections"
3. Find the `registrations` collection
4. View your submitted data

### Test API Directly
Using curl or Postman:
```bash
curl -X POST http://localhost:3002/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "age": "25-35",
    "email": "test@example.com",
    "phone": "+234 800 000 0000",
    "lga": "Test LGA",
    "city": "Test City",
    "state": "Test State",
    "country": "Nigeria",
    "expectations": "Testing the system",
    "inviteSomeone": "no"
  }'
```

## Troubleshooting

### Error: "Please define the MONGODB_URI environment variable"
- Make sure `.env.local` exists in the root folder
- Check that `MONGODB_URI` is correctly spelled
- Restart the dev server after creating `.env.local`

### Error: "This email is already registered"
- This is expected behavior to prevent duplicates
- Use a different email or delete the existing registration from database

### Connection Timeout
- Check your MongoDB Atlas IP whitelist (allow your IP or 0.0.0.0/0 for all)
- Verify your connection string is correct
- Check your internet connection

## Next Steps

### Optional Enhancements:
1. **Email Notifications** - Send confirmation emails after registration
2. **SMS Integration** - Send SMS to invitees
3. **Admin Dashboard** - View all registrations
4. **Export Feature** - Download registrations as CSV/Excel
5. **Payment Integration** - If there's a registration fee
6. **QR Codes** - Generate QR codes for check-in

Let me know if you'd like me to implement any of these features!

## File Structure
```
special-service/
├── .env.local              # Your MongoDB connection string
├── lib/
│   └── db.ts              # Database connection utility
├── models/
│   └── Registration.ts     # Mongoose schema
├── app/
│   └── api/
│       └── register/
│           └── route.ts    # API endpoints
└── components/
    └── RegistrationForm.tsx # Updated form component
```

---

**🎉 Your registration system is ready to go!**
