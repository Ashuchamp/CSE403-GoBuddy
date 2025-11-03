#!/bin/bash

# Test script for GoBuddy Backend API

BASE_URL="http://localhost:3000"

echo "🧪 Testing GoBuddy Backend API..."
echo "Base URL: $BASE_URL"
echo ""

# Test 1: Health Check
echo "1️⃣ Testing Health Check..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo "✅ Health check passed"
    echo "   Response: $body"
else
    echo "❌ Health check failed (HTTP $http_code)"
    exit 1
fi
echo ""

# Test 2: Get All Users
echo "2️⃣ Testing GET /api/users..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/users")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" = "200" ]; then
    echo "✅ Get users passed"
else
    echo "❌ Get users failed (HTTP $http_code)"
fi
echo ""

# Test 3: Create User
echo "3️⃣ Testing POST /api/users..."
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/users" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "test@example.com",
        "name": "Test User",
        "bio": "Test bio",
        "skills": ["coding", "testing"],
        "preferredTimes": ["evenings"],
        "activityTags": ["sports"]
    }')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "201" ]; then
    echo "✅ Create user passed"
    # Extract user ID for next tests
    USER_ID=$(echo "$body" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    echo "   Created user ID: $USER_ID"
else
    echo "❌ Create user failed (HTTP $http_code)"
    echo "   Response: $body"
fi
echo ""

# Test 4: Get All Activities
echo "4️⃣ Testing GET /api/activities..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/activities")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" = "200" ]; then
    echo "✅ Get activities passed"
else
    echo "❌ Get activities failed (HTTP $http_code)"
fi
echo ""

# Test 5: Create Activity (if we have a user ID)
if [ ! -z "$USER_ID" ]; then
    echo "5️⃣ Testing POST /api/activities..."
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/activities" \
        -H "Content-Type: application/json" \
        -d "{
            \"userId\": \"$USER_ID\",
            \"userName\": \"Test User\",
            \"title\": \"Test Activity\",
            \"description\": \"This is a test activity\",
            \"maxPeople\": 5,
            \"scheduledTimes\": [\"2025-11-10T10:00:00Z\"],
            \"campusLocation\": \"Test Location\"
        }")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    if [ "$http_code" = "201" ]; then
        echo "✅ Create activity passed"
        ACTIVITY_ID=$(echo "$body" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
        echo "   Created activity ID: $ACTIVITY_ID"
    else
        echo "❌ Create activity failed (HTTP $http_code)"
        echo "   Response: $body"
    fi
    echo ""
fi

echo "✨ API testing complete!"
echo ""
echo "To manually test the API, try:"
echo "  curl $BASE_URL/api/health"
echo "  curl $BASE_URL/api/users"
echo "  curl $BASE_URL/api/activities"
