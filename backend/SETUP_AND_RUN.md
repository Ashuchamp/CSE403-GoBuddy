# 🚀 GoBuddy Backend - Complete Setup & Running Instructions

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Setup (Automated)](#quick-setup-automated)
3. [Manual Setup](#manual-setup)
4. [Running the Backend](#running-the-backend)
5. [Testing the API](#testing-the-api)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Make sure you have the following installed on your system:

- ✅ **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- ✅ **npm** (comes with Node.js)
- ✅ **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)

### Check if you have them installed:

```bash
node -v    # Should show v16.x.x or higher
npm -v     # Should show 8.x.x or higher
psql --version  # Should show PostgreSQL 12 or higher
```

---

## Quick Setup (Automated)

### Step 1: Install PostgreSQL (if not already installed)

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### Step 2: Create the Database

```bash
# Create database
createdb gobuddy

# Verify it was created
psql -l | grep gobuddy
```

If `createdb` command doesn't work, try:
```bash
psql postgres
CREATE DATABASE gobuddy;
\q
```

### Step 3: Run the Setup Script

```bash
cd backend
./setup.sh
```

This script will:
- Check for Node.js and PostgreSQL
- Install all npm dependencies
- Create a `.env` file from `.env.example`

### Step 4: Configure Environment Variables

Edit the `backend/.env` file with your database credentials:

```bash
# Open in your text editor
nano .env
# or
code .env
```

Update these values:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=gobuddy
DB_USER=postgres
DB_PASSWORD=your_password_here  # ← Change this!

JWT_SECRET=your_jwt_secret_key_change_this_in_production  # ← Change this!
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:8081,exp://localhost:8081
```

**Note:** If you're using default PostgreSQL on macOS, the password might be empty or your system username.

---

## Manual Setup

If the automated setup doesn't work, follow these steps:

### 1. Navigate to Backend Directory
```bash
cd /Users/aaryanjain/Documents/GitHub/CSE403-GoBuddy/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
```bash
cp .env.example .env
```

### 4. Edit `.env` File
Open `.env` and configure your database settings (see Step 4 above)

### 5. Create PostgreSQL Database
```bash
createdb gobuddy
```

---

## Running the Backend

### Development Mode (Recommended for Testing)

This mode has hot-reload enabled - the server restarts automatically when you make changes:

```bash
cd backend
npm run dev
```

You should see:
```
✅ Database connection established successfully.
✅ Database synchronized successfully.
🚀 Server is running on port 3000
📝 API Documentation: http://localhost:3000/
🏥 Health Check: http://localhost:3000/api/health
```

### Production Mode

First build the TypeScript code, then run:

```bash
npm run build
npm start
```

---

## Testing the API

### Option 1: Using curl (Quick Test)

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Expected response:
# {"success":true,"message":"GoBuddy API is running!"}
```

### Option 2: Using the Test Script

```bash
cd backend
./test-api.sh
```

This will run a series of tests to verify all endpoints are working.

### Option 3: Using Postman

1. Open Postman
2. Import the collection: `backend/GoBuddy-API.postman_collection.json`
3. The base URL is already set to `http://localhost:3000/api`
4. Try the requests in this order:
   - Health Check
   - Create User
   - Get All Users
   - Create Activity
   - Get All Activities

### Option 4: Manual Testing with curl

**Create a User:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "bio": "Love outdoor activities!",
    "skills": ["hiking", "photography"],
    "preferredTimes": ["weekends", "evenings"],
    "activityTags": ["sports", "outdoor"]
  }'
```

**Get All Users:**
```bash
curl http://localhost:3000/api/users
```

**Create an Activity:**
```bash
curl -X POST http://localhost:3000/api/activities \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_FROM_PREVIOUS_STEP",
    "userName": "John Doe",
    "title": "Saturday Morning Hike",
    "description": "Join me for a hike!",
    "maxPeople": 5,
    "scheduledTimes": ["2025-11-10T09:00:00Z"],
    "campusLocation": "North Campus"
  }'
```

**Get All Activities:**
```bash
curl http://localhost:3000/api/activities
```

---

## API Endpoints Reference

### Base URL
```
http://localhost:3000/api
```

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/auth/google` - Google OAuth login

### Activities
- `GET /activities` - Get all activities
- `GET /activities/:id` - Get activity by ID
- `POST /activities` - Create new activity
- `PUT /activities/:id` - Update activity
- `DELETE /activities/:id` - Delete activity
- `PATCH /activities/:id/status` - Update activity status
- `GET /activities/user/:userId` - Get activities by user

### Activity Requests
- `GET /requests/activity/:activityId` - Get requests for activity
- `GET /requests/user/:userId` - Get user's requests
- `POST /requests` - Create join request
- `PATCH /requests/:id/status` - Approve/decline request
- `DELETE /requests/:id` - Delete request

---

## Troubleshooting

### ❌ Database Connection Error

**Error:** `Unable to connect to the database`

**Solutions:**
1. Check if PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   # Ubuntu
   sudo systemctl status postgresql
   ```

2. Verify database exists:
   ```bash
   psql -l | grep gobuddy
   ```

3. Check credentials in `.env` file

4. Try connecting manually:
   ```bash
   psql -h localhost -U postgres -d gobuddy
   # Enter your password
   ```

### ❌ Port 3000 Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solutions:**
1. Find and kill the process:
   ```bash
   lsof -i :3000
   kill -9 <PID>
   ```

2. Or change the port in `.env`:
   ```env
   PORT=3001
   ```

### ❌ Module Not Found Errors

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### ❌ TypeScript Compilation Errors

**Solution:**
```bash
cd backend
rm -rf dist/
npm run build
```

### ❌ Database "gobuddy" does not exist

**Solution:**
```bash
createdb gobuddy
# or
psql postgres -c "CREATE DATABASE gobuddy;"
```

### ❌ Permission Denied on PostgreSQL

**Solution:**
```bash
# On macOS/Linux, you might need to create a PostgreSQL user
psql postgres
CREATE USER postgres WITH PASSWORD 'your_password';
ALTER USER postgres WITH SUPERUSER;
\q
```

---

## Development Tips

### Viewing Logs
The server logs all requests. Watch them in real-time when running in dev mode.

### Database Inspection
```bash
# Connect to database
psql gobuddy

# List tables
\dt

# View users table
SELECT * FROM users;

# View activities table
SELECT * FROM activities;

# Exit
\q
```

### Resetting the Database
```bash
# Drop and recreate database
dropdb gobuddy
createdb gobuddy

# Restart the server - tables will be recreated automatically
npm run dev
```

### Stopping the Server
Press `Ctrl + C` in the terminal where the server is running.

---

## Next Steps

1. ✅ Backend is running
2. 📱 Update your React Native app to connect to `http://localhost:3000/api`
3. 🔒 Add authentication middleware
4. 🧪 Write unit tests
5. 🚀 Deploy to production

---

## Need Help?

- Check the logs in the terminal where the server is running
- Review the `backend/README.md` for detailed API documentation
- Test individual endpoints with the Postman collection
- Make sure PostgreSQL is running and accessible

**Common Commands:**
```bash
# Start development server
npm run dev

# Run tests
./test-api.sh

# Check logs
# (logs appear in the terminal automatically)

# Rebuild TypeScript
npm run build
```

Good luck! 🎉
