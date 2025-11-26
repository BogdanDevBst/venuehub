#!/bin/bash

# VenueHub API Testing Script
# Make sure the server is running before executing this script

BASE_URL="http://localhost:5000/api"
TENANT_ID="" # You'll need to set this after creating a tenant
TOKEN=""     # Will be set after login

echo "🧪 VenueHub API Testing Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print test results
print_result() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ $1${NC}"
    fi
}

# 1. Health Check
echo -e "${BLUE}1. Health Check${NC}"
curl -s "$BASE_URL/../health" | jq .
print_result "Health check"
echo ""

# 2. Register User (requires TENANT_ID)
if [ -z "$TENANT_ID" ]; then
    echo -e "${RED}⚠️  Please set TENANT_ID variable in this script${NC}"
    echo "   Run this SQL first: INSERT INTO tenants (name, slug) VALUES ('Test Company', 'test-company') RETURNING id;"
    echo ""
    exit 1
fi

echo -e "${BLUE}2. Register User${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"test@example.com\",
    \"password\": \"password123\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"tenantId\": \"$TENANT_ID\",
    \"role\": \"owner\"
  }")

echo "$REGISTER_RESPONSE" | jq .
print_result "User registration"
echo ""

# 3. Login
echo -e "${BLUE}3. Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq .
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
print_result "Login"
echo ""

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
    echo -e "${RED}Failed to get token. Exiting.${NC}"
    exit 1
fi

echo -e "${GREEN}Token obtained: ${TOKEN:0:20}...${NC}"
echo ""

# 4. Get Profile
echo -e "${BLUE}4. Get User Profile${NC}"
curl -s "$BASE_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN" | jq .
print_result "Get profile"
echo ""

# 5. Create Venue
echo -e "${BLUE}5. Create Venue${NC}"
CREATE_VENUE_RESPONSE=$(curl -s -X POST "$BASE_URL/venues" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Conference Room Alpha",
    "description": "Large conference room with state-of-the-art facilities",
    "address": {
      "street": "123 Tech Street",
      "city": "London",
      "postcode": "SW1A 1AA",
      "country": "United Kingdom"
    },
    "capacity": 50,
    "pricePerHour": 150,
    "amenities": ["wifi", "projector", "whiteboard", "video_conference"],
    "images": []
  }')

echo "$CREATE_VENUE_RESPONSE" | jq .
VENUE_ID=$(echo "$CREATE_VENUE_RESPONSE" | jq -r '.data.venue.id')
print_result "Create venue"
echo ""

# 6. Create Another Venue
echo -e "${BLUE}6. Create Another Venue${NC}"
curl -s -X POST "$BASE_URL/venues" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Meeting Room Beta",
    "description": "Small meeting room perfect for team discussions",
    "address": {
      "street": "456 Business Ave",
      "city": "London",
      "postcode": "EC1A 1BB",
      "country": "United Kingdom"
    },
    "capacity": 10,
    "pricePerHour": 50,
    "amenities": ["wifi", "tv"],
    "images": []
  }' | jq .
print_result "Create second venue"
echo ""

# 7. List All Venues
echo -e "${BLUE}7. List All Venues${NC}"
curl -s "$BASE_URL/venues?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" | jq .
print_result "List venues"
echo ""

# 8. Get Specific Venue
echo -e "${BLUE}8. Get Specific Venue${NC}"
curl -s "$BASE_URL/venues/$VENUE_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .
print_result "Get venue by ID"
echo ""

# 9. Update Venue
echo -e "${BLUE}9. Update Venue${NC}"
curl -s -X PUT "$BASE_URL/venues/$VENUE_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "pricePerHour": 175,
    "capacity": 60
  }' | jq .
print_result "Update venue"
echo ""

# 10. Search Venues
echo -e "${BLUE}10. Search Venues${NC}"
curl -s "$BASE_URL/venues/search?city=London&capacity_min=20" \
  -H "Authorization: Bearer $TOKEN" | jq .
print_result "Search venues"
echo ""

# 11. Try Without Authentication (Should Fail)
echo -e "${BLUE}11. Test Authentication (Should Fail)${NC}"
FAIL_RESPONSE=$(curl -s "$BASE_URL/venues")
echo "$FAIL_RESPONSE" | jq .
if echo "$FAIL_RESPONSE" | grep -q "error"; then
    echo -e "${GREEN}✓ Authentication properly enforced${NC}"
else
    echo -e "${RED}✗ Authentication not working${NC}"
fi
echo ""

# 12. Delete Venue
echo -e "${BLUE}12. Delete Venue${NC}"
curl -s -X DELETE "$BASE_URL/venues/$VENUE_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .
print_result "Delete venue"
echo ""

echo "================================"
echo -e "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "Summary:"
echo "- Base URL: $BASE_URL"
echo "- Token: ${TOKEN:0:30}..."
echo "- Tenant ID: $TENANT_ID"
echo ""
echo "You can now use these credentials to test in Postman or your frontend!"
