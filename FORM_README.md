# Event Registration Form

A beautiful, animated registration form built with Next.js, React Hook Form, and Framer Motion.

## 🎨 Features

- **Clean Design** with theme color `#162236`
- **Smooth Animations** powered by Framer Motion
- **Form Validation** using Zod and React Hook Form
- **Responsive Layout** that works on all devices
- **Conditional Fields** - Invitee information appears only when needed
- **shadcn/ui Components** for consistent, accessible UI

## 📋 Form Fields

The registration form collects the following information:

1. **Personal Information**
   - Full Name
   - Age Range (Under 15, 15-24, 25-35, 36-45, 46-55, 56-65, Over 65)
   - Email Address
   - Phone Number

2. **Viewing Location**
   - LGA (Local Government Area)
   - City
   - State
   - Country

3. **Additional Information**
   - CEF Zone (optional, for members)
   - Expectations (What are you trusting God for right now?)

4. **Invitation**
   - Option to invite someone on your behalf
   - If yes: Invitee's name and phone number for SMS notification

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎭 Animations & Transitions

The form features beautiful animations throughout:
- Fade-in effects on page load
- Smooth field transitions
- Animated success screen with check icon
- Conditional field animations when showing/hiding invitee information
- Loading spinner during form submission

## 🛠️ Technology Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI components
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 📦 Components

- `components/ui/input.tsx` - Text input component
- `components/ui/label.tsx` - Form label component
- `components/ui/textarea.tsx` - Multi-line text input
- `components/ui/select.tsx` - Dropdown select component
- `components/ui/radio-group.tsx` - Radio button group
- `components/ui/button.tsx` - Button component
- `components/RegistrationForm.tsx` - Main form component

## 🎨 Theme Customization

The primary theme color `#162236` is used throughout:
- Background gradients
- Button styles
- Text highlights
- Focus states

To change the theme, update the color values in `components/RegistrationForm.tsx`.

## 📝 Form Submission

Currently, the form simulates a 2-second API call and displays a success message. To integrate with a real backend:

1. Update the `onSubmit` function in `components/RegistrationForm.tsx`
2. Replace the simulated delay with your actual API call
3. Handle success/error responses accordingly

Example:
```typescript
const onSubmit = async (data: FormData) => {
  setIsSubmitting(true)
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      setSubmitted(true)
    } else {
      // Handle error
    }
  } catch (error) {
    // Handle error
  } finally {
    setIsSubmitting(false)
  }
}
```

## 🌐 Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Or deploy manually:
```bash
npm run build
npm start
```

## 📱 Responsive Design

The form is fully responsive and optimized for:
- Mobile devices (320px and up)
- Tablets (768px and up)
- Desktops (1024px and up)

## ✨ Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- Focus indicators
- Error messages linked to fields

---

Built with ❤️ for the Special Service Event
