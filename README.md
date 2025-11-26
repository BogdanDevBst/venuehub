# VenueHub - Multi-Tenant SaaS Platform

A comprehensive venue booking and management platform built with modern JavaScript technologies.

## 🎯 Project Overview

VenueHub is a full-stack SaaS application that allows venue owners to manage their spaces, handle bookings, process payments, and analyze their business - all in one place. The platform features a multi-tenant architecture where each organization has isolated data and customized settings.

## 🚀 Features

### Current Features (MVP)
- ✅ Multi-tenant architecture
- ✅ JWT-based authentication
- ✅ User role management (Owner, Manager, Staff, Customer)
- ✅ Venue CRUD operations
- ✅ Venue search and filtering
- ✅ RESTful API

### Upcoming Features
- 🔄 Booking system with conflict detection
- 🔄 Real-time calendar updates (WebSockets)
- 🔄 Stripe payment integration
- 🔄 Email notifications
- 🔄 Analytics dashboard
- 🔄 Automated reminders
- 🔄 Mobile-responsive frontend

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Payments**: Stripe (planned)
- **Real-time**: Socket.IO (planned)
- **Email**: NodeMailer (planned)

### Frontend (Planned)
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod

## 📁 Project Structure

```
venuehub/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── database/       # Database client & migrations
│   │   ├── middleware/     # Express middleware
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/      # Authentication
│   │   │   ├── venues/    # Venue management
│   │   │   ├── bookings/  # Coming soon
│   │   │   └── payments/  # Coming soon
│   │   ├── utils/         # Utilities
│   │   └── index.ts       # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── frontend/               # Next.js frontend (coming soon)
    └── (to be created)
```

## 🏁 Getting Started

### Prerequisites

- Node.js v18 or higher
- PostgreSQL v14 or higher
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Create PostgreSQL database:
```bash
createdb venuehub
```

5. Run migrations:
```bash
psql -U postgres -d venuehub -f src/database/migrations/001_initial_schema.sql
```

6. Start development server:
```bash
npm run dev
```

Server will run on http://localhost:5000

For detailed backend setup, see [backend/README.md](backend/README.md)

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "tenantId": "uuid-here"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

### Venue Endpoints

All venue endpoints require authentication (`Authorization: Bearer <token>`)

#### Create Venue
```http
POST /api/venues
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Conference Room A",
  "description": "Large conference room",
  "address": {
    "street": "123 Main St",
    "city": "London",
    "postcode": "SW1A 1AA",
    "country": "UK"
  },
  "capacity": 50,
  "pricePerHour": 100,
  "amenities": ["wifi", "projector"],
  "images": []
}
```

#### List Venues
```http
GET /api/venues?page=1&limit=10
Authorization: Bearer <token>
```

#### Search Venues
```http
GET /api/venues/search?city=London&capacity_min=20&price_max=150
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### Core Tables

- **tenants** - Organization/tenant information
- **users** - User accounts with roles
- **venues** - Venue listings
- **bookings** - Booking records (coming soon)
- **payments** - Payment transactions (coming soon)
- **notifications** - User notifications (coming soon)

## 🔐 Security Features

- Password hashing with bcrypt
- JWT authentication with refresh tokens
- Rate limiting on all endpoints
- Helmet.js security headers
- CORS configuration
- SQL injection prevention via parameterized queries
- Role-based access control (RBAC)

## 📈 Development Roadmap

### Phase 1: MVP (Current) ✅
- [x] Project setup
- [x] Authentication system
- [x] Venue management
- [x] Multi-tenant architecture
- [x] Basic security

### Phase 2: Core Features (Next)
- [ ] Booking system with conflict detection
- [ ] Real-time calendar updates
- [ ] Stripe payment integration
- [ ] Email notifications
- [ ] Frontend application

### Phase 3: Advanced Features
- [ ] Analytics dashboard
- [ ] Reporting system
- [ ] Automated reminders
- [ ] Advanced search
- [ ] Mobile app

### Phase 4: Polish
- [ ] Unit & integration tests
- [ ] Performance optimization
- [ ] CI/CD pipeline
- [ ] Documentation
- [ ] Deployment

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 🚀 Deployment

### Backend Deployment Options
- Railway
- Render
- Heroku
- DigitalOcean
- AWS

### Frontend Deployment Options
- Vercel (recommended for Next.js)
- Netlify
- Railway

## 📝 Environment Variables

See `.env.example` files in respective directories for required environment variables.

## 👨‍💻 Author

**Bogdan Niculescu**  
Full-Stack Software Developer

- 5+ years of experience
- Expertise in JavaScript/TypeScript, React, Node.js
- Former Tech Lead at N-and Group Ltd

## 📄 License

MIT

## 🙏 Acknowledgments

This project was created as a comprehensive learning exercise and portfolio piece, demonstrating:

- Full-stack development skills
- Multi-tenant SaaS architecture
- RESTful API design
- Database design and optimization
- Modern JavaScript/TypeScript patterns
- Security best practices
- Real-time features
- Payment processing

---

**Note**: This is an active development project. Features are being added incrementally. Check the roadmap for current status.
