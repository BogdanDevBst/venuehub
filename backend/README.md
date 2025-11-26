# VenueHub Backend

Multi-tenant SaaS platform for event venue management - Backend API

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Payments**: Stripe
- **Real-time**: Socket.IO (coming soon)
- **Email**: NodeMailer

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   ├── database/            # Database client and migrations
│   ├── middleware/          # Express middleware
│   ├── modules/             # Feature modules
│   │   ├── auth/           # Authentication
│   │   ├── venues/         # Venue management
│   │   ├── bookings/       # Booking system (coming soon)
│   │   ├── payments/       # Payment processing (coming soon)
│   │   └── ...
│   ├── utils/              # Utility functions
│   └── index.ts            # Application entry point
├── .env.example            # Environment variables template
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and fill in your configuration:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=venuehub
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Stripe (optional for now)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SMTP (optional for now)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

4. **Set up PostgreSQL database**

Create a new PostgreSQL database:

```bash
createdb venuehub
```

Or using psql:

```sql
CREATE DATABASE venuehub;
```

5. **Run database migrations**

```bash
psql -U postgres -d venuehub -f src/database/migrations/001_initial_schema.sql
```

6. **Start the development server**

```bash
npm run dev
```

The server will start on http://localhost:5000

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Lint code with ESLint

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile (authenticated)

### Venues

- `POST /api/venues` - Create venue (owner/manager only)
- `GET /api/venues` - List all venues for tenant
- `GET /api/venues/:id` - Get venue by ID
- `PUT /api/venues/:id` - Update venue (owner/manager only)
- `DELETE /api/venues/:id` - Delete venue (owner/manager only)
- `GET /api/venues/search` - Search venues with filters

### Health Check

- `GET /health` - Health check endpoint
- `GET /` - API information

## API Usage Examples

### Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "tenantId": "your-tenant-id"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create a Venue (Authenticated)

```bash
curl -X POST http://localhost:5000/api/venues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Conference Room A",
    "description": "Large conference room with projector",
    "address": {
      "street": "123 Main St",
      "city": "London",
      "postcode": "SW1A 1AA",
      "country": "UK"
    },
    "capacity": 50,
    "pricePerHour": 100,
    "amenities": ["wifi", "projector", "whiteboard"],
    "images": []
  }'
```

## Database Schema

### Tables

- `tenants` - Organization/tenant information
- `users` - User accounts (multi-role)
- `venues` - Venue listings
- `bookings` - Booking records
- `availability_rules` - Venue availability
- `payments` - Payment transactions
- `notifications` - User notifications
- `analytics_events` - Analytics tracking

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on all routes
- Helmet.js security headers
- CORS configuration
- SQL injection prevention
- Role-based access control

## Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Success responses:

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

## Testing

Run tests:

```bash
npm test
```

## Deployment

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | Yes |
| `DB_HOST` | PostgreSQL host | Yes |
| `DB_PORT` | PostgreSQL port | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_USER` | Database user | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `JWT_SECRET` | JWT secret key | Yes |
| `JWT_REFRESH_SECRET` | JWT refresh secret | Yes |
| `CLIENT_URL` | Frontend URL | Yes |
| `STRIPE_SECRET_KEY` | Stripe API key | No |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | No |

## Next Steps

### Upcoming Features

1. **Bookings Module** - Complete booking system with conflict detection
2. **Payments Module** - Stripe integration for payments
3. **WebSockets** - Real-time updates for calendar
4. **Notifications** - Email and in-app notifications
5. **Analytics** - Revenue and utilization metrics
6. **Testing** - Unit and integration tests

## Contributing

This is a personal project for learning and portfolio purposes.

## License

MIT

## Author

Bogdan Niculescu - Full-Stack Developer
