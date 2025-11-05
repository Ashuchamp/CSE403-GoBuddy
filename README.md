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

### Mobile App (Frontend)

```bash
cd go-buddy
npm install                # Install dependencies
npm run type-check         # Verify TypeScript
```

### Backend API

```bash
cd backend
npm install                # Install dependencies
createdb gobuddy          # Create PostgreSQL database
./setup.sh                # Automated setup (recommended)
# OR manually: cp .env.example .env and edit
npm run build             # Compile TypeScript
```

**Automated setup (recommended)**: The `./setup.sh` script automatically configures database credentials for your platform.

**Manual setup**: If editing `.env` manually, set `DB_USER` to:
- macOS (Homebrew): Your macOS username, leave `DB_PASSWORD` empty
- Linux/Docker: Usually `postgres` with a password
- Windows: Check your PostgreSQL installation settings

## How to Test the System

### Quick Test (All Components)

```bash
./pre-pr-check.sh          # Runs all tests, linting, type-checking
```

### Mobile App Tests

```bash
cd go-buddy
npm test                   # Run all tests
npm run test:coverage      # Run with coverage report
npm run lint              # Check code quality
npm run type-check        # Verify TypeScript
```

**Coverage Requirements**: ≥80% statements, ≥70% branches, ≥80% functions, ≥80% lines

### Backend Tests (First needs a running backend before testing)

```bash
cd backend
./test-api.sh             # Test API endpoints
curl http://localhost:3000/api/health  # Quick health check
```

**Detailed testing guide**: See [TESTING.md](TESTING.md) for comprehensive testing documentation.

## How to Run the System

### Mobile App (Frontend)

```bash
cd go-buddy
npx expo start                  # Start Expo dev server
# Then press: 'i' for iOS, 'a' for Android, 'w' for web
```

### Backend API

```bash
cd backend
npm run dev               # Development mode with hot-reload
```

**Backend runs at**: http://localhost:3000/api

**Health check**: http://localhost:3000/api/health

### Running Both Together

Open two terminal windows:
- **Terminal 1**: `cd backend && npm run dev`
- **Terminal 2**: `cd go-buddy && npm start`

**Stop servers**: Press `Ctrl + C` in each terminal

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
- **Coverage**: ≥80% statements, ≥70% branches (enforced in CI)
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
