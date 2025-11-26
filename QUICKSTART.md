# 🚀 VenueHub - Quick Start Guide

## 📦 What You've Got

A complete multi-tenant SaaS backend with:
- ✅ Authentication system (JWT)
- ✅ User management with roles
- ✅ Venue CRUD operations
- ✅ Multi-tenant architecture
- ✅ Search and filtering
- ✅ Security middleware
- ✅ Error handling
- ✅ Database migrations

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Database

**Create PostgreSQL database:**
```bash
createdb venuehub
```

**Run migrations:**
```bash
psql -U postgres -d venuehub -f src/database/migrations/001_initial_schema.sql
```

### 3. Configure Environment

```bash
cp .env.example .env
```

**Edit `.env` with minimum required values:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=venuehub
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key_minimum_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_minimum_32_characters
```

### 4. Start the Server

```bash
npm run dev
```

✅ Server running at http://localhost:5000

## 🧪 Test the API

### 1. Create a Tenant (directly in database)

```sql
INSERT INTO tenants (name, slug) 
VALUES ('My Company', 'my-company') 
RETURNING id;
```

Copy the tenant ID.

### 2. Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "tenantId": "PASTE_TENANT_ID_HERE",
    "role": "owner"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@example.com",
    "password": "password123"
  }'
```

Copy the `token` from the response.

### 4. Create a Venue

```bash
curl -X POST http://localhost:5000/api/venues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Conference Room A",
    "description": "Large room with projector",
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

### 5. List Venues

```bash
curl http://localhost:5000/api/venues \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎯 What's Next?

### Immediate Next Steps:
1. **Test all endpoints** using Postman or curl
2. **Add more venues** to test the search functionality
3. **Review the code** in `backend/src/modules/`

### Coming Soon (You Can Build These):
1. **Bookings Module** - Check `backend/src/modules/bookings/` (create this)
2. **Payments Module** - Stripe integration
3. **WebSockets** - Real-time updates
4. **Frontend** - Next.js application

### Recommended Tools:
- **Postman** or **Insomnia** - API testing
- **pgAdmin** or **TablePlus** - Database management
- **VS Code** - Code editor (with ESLint extension)

## 📚 Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/           # ← Authentication logic
│   │   └── venues/         # ← Venue management
│   ├── middleware/         # ← Auth, validation, errors
│   ├── database/           # ← DB client & migrations
│   ├── utils/              # ← Helpers
│   └── index.ts            # ← Server entry point
```

## 🔧 Development Tips

### View Logs
Logs are in `backend/logs/` directory:
- `combined.log` - All logs
- `error.log` - Errors only

### Database Tips
```sql
-- View all users
SELECT * FROM users;

-- View all venues
SELECT * FROM venues;

-- Check tenant data
SELECT * FROM tenants;
```

### Common Issues

**Port already in use:**
```bash
# Change PORT in .env
PORT=5001
```

**Database connection error:**
- Check PostgreSQL is running
- Verify credentials in .env
- Ensure database exists

**JWT errors:**
- Make sure JWT_SECRET is at least 32 characters
- Check token in Authorization header format: `Bearer <token>`

## 🎓 Learning Path

1. **Understand the Auth Flow**
   - Read `src/modules/auth/auth.service.ts`
   - See how JWT tokens work
   - Understand password hashing

2. **Study the Venue Module**
   - Read `src/modules/venues/venue.service.ts`
   - See how dynamic SQL queries are built
   - Understand pagination

3. **Build the Bookings Module**
   - Copy venue module structure
   - Add booking conflict detection
   - Implement calendar logic

4. **Add Real-time Features**
   - Set up Socket.IO
   - Broadcast booking updates
   - Handle multiple users

## 📞 Need Help?

Check these files:
- `backend/README.md` - Detailed backend documentation
- `README.md` - Project overview
- `src/database/migrations/001_initial_schema.sql` - Database schema

## 🎉 You're Ready!

The foundation is solid. Now you can:
- ✅ Build the bookings system
- ✅ Add payment processing
- ✅ Create the frontend
- ✅ Implement analytics
- ✅ Add testing

Happy coding! 🚀
