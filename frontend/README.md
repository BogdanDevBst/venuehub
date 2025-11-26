# VenueHub Frontend

Modern, responsive frontend for the VenueHub venue management platform built with Next.js 15, React 18, and TypeScript.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Real-time**: Socket.IO Client (prepared)
- **Calendar**: React Big Calendar
- **Charts**: Recharts
- **Icons**: Lucide React

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                  # Auth routes group
│   │   ├── login/              # Login page
│   │   └── register/           # Register page
│   ├── dashboard/              # Protected dashboard
│   │   ├── layout.tsx         # Dashboard layout with sidebar
│   │   ├── page.tsx           # Dashboard home
│   │   ├── venues/            # Venue management
│   │   ├── bookings/          # Bookings (to implement)
│   │   └── settings/          # Settings (to implement)
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles
│
├── components/
│   ├── ui/                    # Shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── providers.tsx          # React Query provider
│   └── ...
│
├── lib/
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-auth.ts       # Authentication hooks
│   │   ├── use-venues.ts     # Venue management hooks
│   │   └── use-bookings.ts   # Booking hooks (to implement)
│   ├── api-client.ts         # Axios instance with interceptors
│   ├── auth-store.ts         # Zustand auth state
│   ├── types.ts              # TypeScript type definitions
│   └── utils.ts              # Utility functions
│
├── public/                    # Static assets
├── .env.local                # Environment variables
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind configuration
└── package.json              # Dependencies
```

## 🏁 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Backend API running on http://localhost:5000

### Installation

1. **Install dependencies**

```bash
cd frontend
npm install
```

2. **Set up environment variables**

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

3. **Start development server**

```bash
npm run dev
```

The app will be available at http://localhost:3000

## 📦 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Lint code with ESLint
npm run type-check # Type check with TypeScript
```

## 🎨 Features Implemented

### ✅ Authentication
- Login page with form validation
- Register page (basic structure)
- JWT token management with auto-refresh
- Protected routes
- Persistent auth state with Zustand

### ✅ Dashboard
- Responsive sidebar layout
- Mobile-friendly navigation
- Stats overview
- User profile in sidebar
- Role-based display

### ✅ Venue Management
- List all venues with pagination
- Search and filter venues
- Create new venue (structure ready)
- Edit venue (structure ready)
- Delete venue with confirmation
- View venue details
- Responsive card grid layout

### ✅ API Integration
- Axios client with interceptors
- Automatic token refresh
- Error handling
- React Query for data fetching
- Optimistic updates
- Cache management

### ✅ UI/UX
- Shadcn/ui components
- Tailwind CSS styling
- Responsive design
- Toast notifications (Sonner)
- Loading states
- Empty states
- Error states

## 🔜 Features To Implement

### Bookings Module
- Calendar view with React Big Calendar
- Create booking form
- Booking list
- Booking details
- Real-time updates with Socket.IO
- Conflict detection

### Analytics Dashboard
- Revenue charts with Recharts
- Utilization metrics
- Booking trends
- Customer analytics
- Date range filters

### Settings
- Profile management
- Tenant settings
- Team management
- Billing & subscription
- Notification preferences

### Payments
- Stripe integration
- Payment processing
- Invoice generation
- Refund handling

## 🎯 Page Routes

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Dashboard)
- `/dashboard` - Dashboard home
- `/dashboard/venues` - Venues list
- `/dashboard/venues/new` - Create venue
- `/dashboard/venues/[id]` - Venue details
- `/dashboard/venues/[id]/edit` - Edit venue
- `/dashboard/bookings` - Bookings (to implement)
- `/dashboard/settings` - Settings (to implement)

## 🔐 Authentication Flow

1. User submits login credentials
2. API returns JWT token and refresh token
3. Tokens stored in localStorage and Zustand
4. Axios interceptor adds token to all requests
5. On 401 error, attempt token refresh
6. If refresh fails, redirect to login

## 📡 API Integration

### Auth Endpoints
```typescript
POST /api/auth/login         # Login
POST /api/auth/register      # Register
POST /api/auth/refresh       # Refresh token
GET  /api/auth/profile       # Get user profile
```

### Venue Endpoints
```typescript
GET    /api/venues           # List venues
GET    /api/venues/:id       # Get venue
POST   /api/venues           # Create venue
PUT    /api/venues/:id       # Update venue
DELETE /api/venues/:id       # Delete venue
GET    /api/venues/search    # Search venues
```

## 🎨 Styling

### Tailwind CSS
- Utility-first CSS framework
- Custom color scheme with CSS variables
- Responsive design utilities
- Dark mode support (prepared)

### Shadcn/ui
- High-quality, accessible components
- Built with Radix UI primitives
- Fully customizable
- TypeScript support

## 🔧 Development Tips

### Adding New Components

1. **Create component file**
```typescript
// components/my-component.tsx
export function MyComponent() {
  return <div>My Component</div>
}
```

2. **Use Shadcn/ui for common UI elements**
```bash
# Install Shadcn components as needed
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
```

### Creating API Hooks

```typescript
// lib/hooks/use-my-feature.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api-client';

export const useMyFeature = () => {
  return useQuery({
    queryKey: ['myFeature'],
    queryFn: async () => {
      const response = await apiClient.get('/my-endpoint');
      return response.data;
    },
  });
};
```

### Form Handling

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Required'),
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set environment variables** in Vercel dashboard

### Other Platforms
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL | No |

## 🐛 Common Issues

### CORS Errors
Make sure backend CORS is configured to allow frontend origin:
```typescript
// backend/src/index.ts
cors({
  origin: 'http://localhost:3000',
  credentials: true,
})
```

### Authentication Errors
Check that tokens are being stored and sent correctly:
```typescript
// Check browser localStorage
localStorage.getItem('token')
```

### API Connection Issues
Verify backend is running and API_URL is correct:
```bash
curl http://localhost:5000/health
```

## 📚 Key Dependencies

### Core
- `next` - React framework
- `react` - UI library
- `typescript` - Type safety

### Data & State
- `@tanstack/react-query` - Server state management
- `zustand` - Client state management
- `axios` - HTTP client

### UI
- `tailwindcss` - Utility CSS
- `lucide-react` - Icons
- `sonner` - Toast notifications

### Forms
- `react-hook-form` - Form handling
- `zod` - Schema validation

### Calendar & Charts
- `react-big-calendar` - Calendar component
- `recharts` - Chart library
- `date-fns` - Date utilities

## 🎓 Learning Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)

## 👨‍💻 Author

**Bogdan Niculescu**
- Full-Stack Developer
- 5+ years experience
- TypeScript, React, Node.js specialist

## 📄 License

MIT

---

## 🎯 Next Steps

1. **Implement Create Venue Form**
   - Form with React Hook Form
   - Address input component
   - Amenities multi-select
   - Image upload

2. **Add Bookings Module**
   - Calendar view
   - Booking form
   - Conflict detection
   - Real-time updates

3. **Build Analytics Dashboard**
   - Revenue charts
   - Metrics cards
   - Date range selector
   - Export functionality

4. **Add Testing**
   - Unit tests with Jest
   - Component tests
   - E2E tests with Playwright

5. **Performance Optimization**
   - Image optimization
   - Code splitting
   - Lazy loading
   - Bundle analysis

Happy coding! 🚀
