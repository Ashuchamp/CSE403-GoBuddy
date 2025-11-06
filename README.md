# GoBuddy

A mobile app that helps students discover, propose, and coordinate activities with compatible peers. GoBuddy streamlines finding partners for workouts, study sessions, games, and more by matching interests, availability, and intent.

## Project Overview

**Goals**:
- Provide an easy way to browse, request, and organize activities
- Improve matching via intent, skills, location, and time windows
- Offer lightweight profiles and simple coordination flows

**System Architecture**:
- **Frontend**: React Native mobile app built with Expo (TypeScript)
- **Backend**: Node.js/Express REST API with PostgreSQL database (TypeScript)

**Living Document**: [GoBuddy Living Document](https://docs.google.com/document/d/1p3QBh7KAYP06WYBGqdLce5ktvth-cW0wMUFkJ-nHww0/edit?tab=t.0) (Team-internal planning and decisions)

## Repository Layout

```
CSE403-GoBuddy/
├── go-buddy/           # React Native mobile app (Expo)
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── screens/    # App screens
│   │   ├── __tests__/  # Test files
│   │   └── ...
│   └── README.md       # Mobile app documentation
├── backend/            # Node.js/Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   └── SETUP_AND_RUN.md
├── docs/               # Documentation
├── reports/            # Weekly progress reports
├── .github/            # CI/CD workflows
└── README.md           # This file
```

## Prerequisites

- **Node.js** 18.x or 20.x ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download/)) - For backend only
- **Xcode** (macOS, for iOS development) or **Android Studio** (for Android development)

**Verify installation**:
```bash
node -v    # Should show v18.x or v20.x
npm -v     # Should show 9.x or higher
psql --version  # Should show PostgreSQL 12+
```

## How to Build the System

Follow these steps **once** when first setting up the project:

### 1. Frontend Setup

```bash
cd go-buddy
npm install                # Install all dependencies
npm run type-check         # Verify TypeScript compiles
```

### 2. Backend Setup

```bash
cd backend
npm install                # Install all dependencies
createdb gobuddy          # Create PostgreSQL database
./setup.sh                # Configure environment (recommended)
```

**Automated setup (recommended)**: The `./setup.sh` script automatically creates and configures `.env` with correct database credentials for your platform.

**Manual setup alternative**: 
```bash
cp .env.example .env       # Copy template
# Edit .env and set DB_USER to:
#   - macOS: Your macOS username, leave DB_PASSWORD empty
#   - Linux/Docker: Usually 'postgres' with a password
#   - Windows: Check your PostgreSQL installation settings
```

**Note**: You don't need to run `npm run build` for development. TypeScript is compiled on-the-fly by `nodemon` when you run `npm run dev`.

## How to Test the System

### Quick Test (All Components)

Run all tests, linting, and type-checking at once:

```bash
./pre-pr-check.sh          # From project root
```

This runs frontend tests with coverage, linting, formatting checks, and TypeScript validation.

### Frontend Tests Only

```bash
cd go-buddy
npm test                   # Run all tests
npm run test:coverage      # Run tests with coverage report
npm run lint              # Check code quality (ESLint)
npm run type-check        # Verify TypeScript compiles
```

**Coverage Requirements**: Minimum 5% (configured in `package.json`)

### Backend Tests (Manual API Testing)

**Prerequisites**: Backend must be running first

```bash
cd backend
npm run dev               # Start backend in another terminal
```

**Then test API endpoints**:
```bash
./test-api.sh             # Test all API endpoints with curl
curl http://localhost:3000/api/health  # Quick health check
```

**Detailed testing guide**: See [TESTING.md](TESTING.md) for comprehensive testing documentation.

## How to Run the System

**Important**: The mobile app requires the backend to function. Choose one of the two modes below:

---

### Option 1: Real App Mode (For Development)

Use this for **real development** and testing with your **own Google account**.

**⚠️ Do NOT run `npm run seed` for this mode**

**Steps**:

1. **Start backend**:
   ```bash
   cd backend
   npm run dev                  # Start backend WITHOUT seeding
   ```

2. **Start mobile app** (in a new terminal):
   ```bash
   cd go-buddy
   npm start                    # Start Expo dev server
   # Press 'i' for iOS, 'a' for Android, 'w' for web
   ```

3. **On the mobile app**:
   - Click **"Sign in with Google"**
   - Use your **@uw.edu email**
   - Your account will be created automatically
   - Start with a clean profile that you can customize

**What you get**: Real Google authentication, your own account, empty database to build from scratch

---

### Option 2: Demo Mode (For Showcase/Testing)

Use this to **showcase features** with pre-populated users and activities.

**⚠️ You MUST run `npm run seed` FIRST for this mode**

**Steps**:

1. **Seed the database** (run this FIRST):
   ```bash
   cd backend
   npm run seed                 # Populates 20+ users and 15+ activities
   ```

2. **Start backend**:
   ```bash
   npm run dev                  # Start backend server
   ```

3. **Start mobile app** (in a new terminal):
   ```bash
   cd go-buddy
   npm start                    # Start Expo dev server
   # Press 'i' for iOS, 'a' for Android, 'w' for web
   ```

4. **On the mobile app**:
   - Click **"Skip to Demo (for showcase)"**
   - Logs in as **Demo User** (demo@uw.edu)
   - Instantly see populated Browse, Activities, and Connections screens

**What you get**: Pre-configured demo account, sample activities to join, mock users to connect with

**Note**: If you use both Google login and Demo mode, both accounts will exist in the database. This is normal - each user can see the other in Browse, demonstrating multi-user functionality.

---

### Stopping the App

Press `Ctrl + C` in each terminal window to stop the servers.

---

### Physical Device Testing

**For testing on a physical phone** (not simulator/emulator):

1. **Find your computer's IP address**:
   ```bash
   ipconfig getifaddr en0      # macOS
   ipconfig                     # Windows (look for IPv4)
   ```

2. **Update API URL** in `go-buddy/src/services/api.ts`:
   ```typescript
   const API_BASE_URL = 'http://YOUR_IP_HERE:3000/api';
   // Example: 'http://10.0.0.90:3000/api'
   ```

3. **Ensure same WiFi**: Phone and computer must be on the same network

4. **Restart the app**: Press `r` in Expo terminal to reload

---

### Clear All Data (Complete Database Reset)

**⚠️ WARNING**: This deletes **ALL data** from the database, including:
- Seeded demo users and activities
- **Your Google login account**
- **All activities you created**
- All connections and requests

To completely reset the database:

```bash
cd backend
psql -d gobuddy -f clear-seed.sql
```

After running this, the database will be completely empty. You'll need to:
- Re-run `npm run seed` if you want demo mode
- Re-login with Google to recreate your account

## Operational Use Cases
Operational:
- Create new activity inten,
- Create Profile,
- Keyword-based activity search,
- Group Activity Formation,
- Exchange Contact Info

*The specific descriptions of use cases can be found in the living document.

## Technical Processes

### Version Control
- **Tool**: Git/GitHub
- **Workflow**: Feature branches → Pull Request → Code Review → Merge
- **Commit format**: Conventional commits (`feat:`, `fix:`, `docs:`, `test:`, etc.)
- **Best practice**: Descriptive commit messages, atomic commits

### Bug Tracking
- **Tool**: GitHub Issues
- **Templates**: Bug reports, feature requests (`.github/ISSUE_TEMPLATE/`)
- **Labels**: `bug`, `enhancement`, `documentation`, `priority: high/medium/low`

### Build System
- **Frontend**: Expo with Metro bundler (TypeScript)
- **Backend**: TypeScript compiler → JavaScript (`npm run build`)
- **Automation**: `./setup.sh` for backend, `npm install` for frontend

### Testing Infrastructure
- **Framework**: Jest + React Testing Library
- **Coverage**: Minimum 5% threshold (configured in `go-buddy/package.json`)
- **Commands**: `npm test`, `npm run test:coverage`
- **Detailed guide**: [TESTING.md](TESTING.md)

### Continuous Integration (CI)
- **Platform**: GitHub Actions
- **Workflows**: `.github/workflows/ci.yml` and `.github/workflows/lint.yml`
- **Runs on**: All PRs and pushes to `main`/`dev`
- **Checks**: TypeScript, ESLint, Prettier, tests, coverage
- **PR Requirements**: All checks pass, ≥1 approval, coverage thresholds met

**See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development guidelines.**

## Documentation & Resources

### Setup and Usage Guides
- **[Backend Setup](backend/SETUP_AND_RUN.md)** - Backend setup and API testing
- **[Mobile App README](go-buddy/README.md)** - Mobile app documentation
- **[Setup Guide](SETUP_GUIDE.md)** - Detailed testing infrastructure setup
- **[Testing Guide](TESTING.md)** - Comprehensive testing documentation

### Development Resources
- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute
- **[Coding Guidelines](coding-guidelines.md)** - Code style and standards
- **[Developer Guide](docs/developer-guide.md)** - Developer documentation
- **[User Manual](docs/user-manual.md)** - End-user guide

### Project Reports
- [Weekly Progress Reports](reports/) - Team progress updates

## Troubleshooting

### Common Issues

**npm install fails**:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Tests won't run**:
```bash
cd go-buddy
npm test -- --clearCache
npm install && npm test
```

**Backend won't connect to database**:
```bash
# Check PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Verify database exists
psql -l | grep gobuddy

# Common issue on macOS: Wrong DB_USER in .env
# Error: "role 'postgres' does not exist"
# Fix: Edit backend/.env and set DB_USER to your macOS username
# Example: DB_USER=kehanjin and DB_PASSWORD= (empty)
```

**Port 3000 already in use**:
```bash
lsof -i :3000
kill -9 <PID>
```

For more troubleshooting help, see:
- [Backend Troubleshooting](backend/SETUP_AND_RUN.md#troubleshooting)
- [Setup Guide Troubleshooting](SETUP_GUIDE.md#troubleshooting)

## Contributing

1. Read [CONTRIBUTING.md](CONTRIBUTING.md) and [coding guidelines](coding-guidelines.md)
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and add tests
4. Run checks: `./pre-pr-check.sh`
5. Commit with descriptive message: `git commit -m "feat: description"`
6. Push and create Pull Request

## License

This project is for academic purposes as part of CSE 403 at the University of Washington.

---

**University of Washington - CSE 403 Software Engineering**

**For course staff**: This repository provides complete documentation for building, testing, and running the GoBuddy system. All technical processes (version control, bug tracking, build system, testing, and CI) are fully functioning and documented as required.
