# ✅ VenueHub Setup Checklist

Use this checklist to get your VenueHub project up and running.

## 📋 Pre-Installation Checklist

- [ ] Node.js v18+ installed (`node --version`)
- [ ] PostgreSQL v14+ installed (`psql --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] Git installed (optional, for version control)
- [ ] Code editor installed (VS Code recommended)

## 🔧 Installation Steps

### Backend Setup

- [ ] Navigate to backend directory: `cd backend`
- [ ] Install dependencies: `npm install`
- [ ] Copy environment file: `cp .env.example .env`
- [ ] Edit `.env` with your configuration
  - [ ] Set database credentials (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)
  - [ ] Generate JWT secrets (32+ characters each)
  - [ ] Set CLIENT_URL if different from http://localhost:3000

### Database Setup

- [ ] Create PostgreSQL database: `createdb venuehub`
- [ ] Run migrations: `psql -U postgres -d venuehub -f src/database/migrations/001_initial_schema.sql`
- [ ] Verify tables created: `psql -d venuehub -c "\dt"`

### First Run

- [ ] Start development server: `npm run dev`
- [ ] Verify server starts on http://localhost:5000
- [ ] Test health endpoint: `curl http://localhost:5000/health`
- [ ] Check logs in `backend/logs/` directory

## 🧪 Testing Setup

### Create Test Tenant

```sql
-- In psql or pgAdmin
INSERT INTO tenants (name, slug) 
VALUES ('Test Company', 'test-company') 
RETURNING id;
```

- [ ] Save the tenant ID from the result

### Test API Manually

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "tenantId": "YOUR_TENANT_ID_HERE",
    "role": "owner"
  }'
```

- [ ] User registered successfully
- [ ] Save user details

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

- [ ] Login successful
- [ ] Copy the token from response

#### Create Venue
```bash
curl -X POST http://localhost:5000/api/venues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test Venue",
    "description": "Test description",
    "address": {
      "street": "123 Test St",
      "city": "London",
      "postcode": "SW1A 1AA",
      "country": "UK"
    },
    "capacity": 50,
    "pricePerHour": 100,
    "amenities": ["wifi"],
    "images": []
  }'
```

- [ ] Venue created successfully

### Or Use Test Script

- [ ] Edit `test-api.sh` and set TENANT_ID
- [ ] Make executable: `chmod +x test-api.sh`
- [ ] Run script: `./test-api.sh`
- [ ] All tests pass

## 🛠️ Development Tools Setup

### Recommended VS Code Extensions

- [ ] ESLint
- [ ] Prettier
- [ ] PostgreSQL (by Chris Kolkman)
- [ ] Thunder Client or REST Client (for API testing)
- [ ] GitLens (if using Git)

### Database Tools

Choose one:
- [ ] pgAdmin 4
- [ ] TablePlus
- [ ] DBeaver
- [ ] psql command line

### API Testing Tools

Choose one:
- [ ] Postman
- [ ] Insomnia
- [ ] Thunder Client (VS Code extension)
- [ ] curl (command line)

## 📚 Learning Path

- [ ] Read `README.md` - Project overview
- [ ] Read `QUICKSTART.md` - Quick setup guide
- [ ] Read `backend/README.md` - Detailed backend docs
- [ ] Read `PROJECT_SUMMARY.md` - What's been built
- [ ] Review `src/modules/auth/` - Authentication code
- [ ] Review `src/modules/venues/` - Venue management code
- [ ] Review database schema in `src/database/migrations/`

## 🎯 Next Development Tasks

### Immediate Tasks (Start Here)

- [ ] Test all API endpoints with Postman/Insomnia
- [ ] Create multiple venues for testing
- [ ] Test search functionality with filters
- [ ] Review code structure and patterns
- [ ] Understand the authentication flow

### Short-term Tasks (Week 1-2)

- [ ] Build bookings module
  - [ ] Create `booking.service.ts`
  - [ ] Create `booking.handlers.ts`
  - [ ] Create `booking.routes.ts`
  - [ ] Add conflict detection
  - [ ] Test with concurrent bookings

- [ ] Set up frontend project
  - [ ] Initialize Next.js 15
  - [ ] Set up Tailwind CSS
  - [ ] Create authentication pages
  - [ ] Build venue listing page

### Medium-term Tasks (Week 3-4)

- [ ] Integrate Socket.IO for real-time updates
- [ ] Add Stripe payment processing
- [ ] Implement email notifications
- [ ] Build analytics dashboard
- [ ] Add automated reminders

### Long-term Tasks (Month 2+)

- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Add end-to-end tests
- [ ] Performance optimization
- [ ] Security audit
- [ ] Deploy to production

## 🐛 Troubleshooting Checklist

### Server won't start

- [ ] Check if port 5000 is already in use
- [ ] Verify all environment variables are set
- [ ] Check PostgreSQL is running
- [ ] Review error logs in `backend/logs/error.log`
- [ ] Verify Node.js version is 18+

### Database connection issues

- [ ] Verify PostgreSQL is running: `pg_isready`
- [ ] Check credentials in `.env` are correct
- [ ] Ensure database exists: `psql -l | grep venuehub`
- [ ] Check PostgreSQL is listening on correct port
- [ ] Verify user has proper permissions

### Authentication errors

- [ ] Ensure JWT_SECRET is at least 32 characters
- [ ] Check token format: `Bearer <token>`
- [ ] Verify token hasn't expired
- [ ] Check user exists in database
- [ ] Review auth middleware logs

### API returns 404

- [ ] Verify route exists in route files
- [ ] Check URL spelling and case
- [ ] Ensure middleware is properly set up
- [ ] Review server logs for route registration

## ✅ You're Ready When...

- [ ] Server starts without errors
- [ ] Can register a user
- [ ] Can login and receive token
- [ ] Can create a venue with authentication
- [ ] Can list all venues
- [ ] Can search venues with filters
- [ ] Can update a venue
- [ ] Can delete a venue
- [ ] All database tables are created
- [ ] Logs are being written
- [ ] Health check endpoint responds

## 📞 Need Help?

If stuck, check these resources in order:

1. **QUICKSTART.md** - Quick setup guide
2. **backend/README.md** - Detailed API documentation
3. **PROJECT_SUMMARY.md** - Architecture overview
4. **Error Logs** - `backend/logs/error.log`
5. **Database Logs** - PostgreSQL logs

## 🎉 Success Criteria

You'll know everything is working when:

✅ Server starts and responds to health checks
✅ Can complete full authentication flow
✅ Can perform all CRUD operations on venues
✅ Multi-tenant isolation is working
✅ Rate limiting is active
✅ Errors are properly logged
✅ Can run the test script successfully

---

**Time to Complete Setup:** 15-30 minutes
**Time to First API Call:** 5-10 minutes after setup

Happy coding! 🚀
