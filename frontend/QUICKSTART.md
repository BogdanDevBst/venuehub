# 🚀 Frontend Quick Start Guide

Get the VenueHub frontend up and running in 5 minutes!

## ⚡ Prerequisites

Make sure you have:
- ✅ Node.js v18+ installed
- ✅ Backend API running on http://localhost:5000
- ✅ A tenant created in the database

## 📦 Installation Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This will install all required packages (Next.js, React, Tailwind, etc.)

### 2. Configure Environment

The `.env.local` file is already created with default values:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

If your backend runs on a different port, update these values.

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser

## 🎯 First Steps

### 1. Create a Tenant (if not done)

In your backend database:
```sql
INSERT INTO tenants (name, slug) 
VALUES ('My Company', 'my-company') 
RETURNING id;
```

Copy the tenant ID - you'll need it for registration.

### 2. Register an Account

1. Go to http://localhost:3000/register
2. Fill in the form:
   - First Name: Your first name
   - Last Name: Your last name
   - Email: your@email.com
   - Password: At least 8 characters
   - Tenant ID: Paste the UUID from step 1

3. Click "Create Account"

### 3. Login

1. Go to http://localhost:3000/login
2. Enter your email and password
3. Click "Sign In"

You'll be redirected to the dashboard!

### 4. Add Your First Venue

1. Click "Add Venue" button on the venues page
2. Fill in the venue details
3. Save and see it in your venues list

## 📱 What You Can Do

### ✅ Currently Working

- **Dashboard**: Overview of your venues and stats
- **Venues Management**: 
  - View all venues in a grid
  - Search venues by name or city
  - View venue details
  - Delete venues
- **Authentication**:
  - Login/Logout
  - Token auto-refresh
  - Protected routes

### 🔜 Coming Soon (Ready to Implement)

- Create/Edit venue forms
- Bookings calendar
- Analytics dashboard
- Settings page
- Real-time updates

## 🎨 UI Components Available

The project includes Shadcn/ui components:
- Buttons
- Input fields
- Cards
- Forms (with validation)
- Toasts (notifications)

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

## 📂 Project Structure

```
frontend/
├── app/              # Pages (Next.js App Router)
├── components/       # React components
├── lib/             
│   ├── hooks/       # Custom React hooks
│   ├── api-client.ts   # API setup
│   ├── auth-store.ts   # Auth state
│   └── types.ts        # TypeScript types
└── public/          # Static files
```

## 🐛 Troubleshooting

### Can't connect to backend?
- Make sure backend is running: `curl http://localhost:5000/health`
- Check `.env.local` has correct API URL

### Login not working?
- Check tenant ID is correct
- Make sure user exists in database
- Check browser console for errors

### Page shows blank?
- Open browser dev tools (F12)
- Check console for JavaScript errors
- Try refreshing the page

## 🎓 Next Steps

1. **Explore the Dashboard**: Navigate through the sidebar menu
2. **Add Venues**: Create multiple venues to test the list
3. **Check the Code**: Look at the files in `app/` and `components/`
4. **Implement Features**: Start with the venue create form
5. **Customize Styling**: Modify Tailwind classes to match your brand

## 📖 Documentation

- Full README: `README.md`
- Backend API: `../backend/README.md`
- Types: Check `lib/types.ts` for all TypeScript interfaces

## 💡 Tips

- Use React DevTools browser extension to inspect components
- Use React Query Devtools (bottom right) to see API calls
- Check Network tab in browser dev tools for API requests
- All forms use Zod validation - check error messages

## ✅ You're Ready!

The frontend is set up and ready to use. Start by:
1. Adding some test venues
2. Exploring the dashboard
3. Reviewing the code structure
4. Building new features

Happy coding! 🚀

---

**Need Help?**
- Check `README.md` for detailed documentation
- Review error messages in browser console
- Check backend logs for API issues
