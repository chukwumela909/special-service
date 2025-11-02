# Registration Statistics Dashboard

## Overview
A comprehensive admin dashboard to view, search, and export all event registrations.

## Access
Navigate to: **http://localhost:3002/stats**

Or click "View Registration Statistics" link at the bottom of the registration form.

## Features

### 📊 Statistics Overview
- **Total Registrations** - Complete count of all attendees
- **Last 24 Hours** - Recent registration activity
- **With Invitees** - Number of people inviting others
- **CEF Members** - Count of registered CEF zone members

### 📈 Visual Analytics
- **Age Distribution Chart** - Visual breakdown by age ranges
- **Top Countries Chart** - Geographic distribution of attendees

### 🔍 Search & Filter
- Search by name, email, phone, or registration number
- Sort by date, name, or email
- Order by newest or oldest first

### 📥 Export Data
- **CSV Export** - Download all registration data
- Includes all fields for easy analysis in Excel/Sheets
- Filename includes current date

### 📋 Detailed Registration Table
Shows for each registration:
- Registration Number (unique ID)
- Full Name & CEF Zone
- Email & Phone
- Location (City, State, Country)
- Age Range
- Invitee Information (if applicable)
- Registration Date & Time

### 📄 Pagination
- 50 registrations per page
- Easy navigation between pages
- Shows current position in results

## API Endpoint

### GET /api/registrations

Query Parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `search` - Search term
- `sortBy` - Field to sort by (createdAt, name, email)
- `sortOrder` - Sort direction (asc, desc)

Example:
```
GET /api/registrations?page=1&limit=50&search=john&sortBy=createdAt&sortOrder=desc
```

Response:
```json
{
  "success": true,
  "data": {
    "registrations": [...],
    "pagination": {
      "page": 1,
      "limit": 50,
      "totalPages": 5,
      "totalCount": 247
    },
    "stats": {
      "total": 247,
      "withInvitees": 89,
      "withCEFZone": 134,
      "recentRegistrations": 23,
      "byAgeRange": [...],
      "byCountry": [...]
    }
  }
}
```

## Security Note
⚠️ **Important**: This is currently a public page. For production, you should:

1. **Add Authentication** - Require admin login
2. **Protect API Route** - Add middleware to verify admin access
3. **Environment Variables** - Store admin credentials securely

Example protection (add to `/app/stats/page.tsx`):
```typescript
// Add authentication check
useEffect(() => {
  const isAuthenticated = checkAdminAuth();
  if (!isAuthenticated) {
    router.push('/login');
  }
}, []);
```

## CSV Export Format
Exported CSV includes these columns:
1. Registration Number
2. Name
3. Email
4. Phone
5. Age Range
6. LGA
7. City
8. State
9. Country
10. CEF Zone
11. Inviting Someone
12. Invitee Name
13. Invitee Phone
14. Registered At

## Usage Tips

### Finding Specific Registration
1. Use the search box to find by name, email, or registration number
2. Results update in real-time as you search

### Exporting Data
1. Apply any filters/search you want
2. Click "Export" button
3. CSV file downloads automatically
4. Open in Excel, Google Sheets, etc.

### Analyzing Trends
- Check "Last 24 Hours" to see recent activity
- View age distribution to understand audience demographics
- Check country breakdown for geographic reach

## Troubleshooting

### No Data Showing
- Ensure MongoDB connection is configured
- Check that registrations exist in database
- Look for console errors in browser DevTools

### Search Not Working
- Check that search term is valid
- Try different search criteria
- Verify API route is accessible

### Export Failing
- Check browser console for errors
- Ensure data exists to export
- Try with a smaller dataset first

## Future Enhancements

Consider adding:
- 📧 Email notifications to selected registrants
- 📱 SMS invitations to invitees
- 📊 More detailed analytics (time-based trends)
- 🔐 Admin authentication
- ✏️ Edit/delete registration capability
- 🎟️ Check-in functionality with QR codes
- 📈 Real-time updates with WebSockets
- 📄 PDF export option
- 📊 Advanced filtering options
- 🗺️ Geographic map visualization

---

**Built with Next.js 16, React, Tailwind CSS, and Framer Motion**
