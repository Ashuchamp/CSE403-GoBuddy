# Developer Guide
Last updated: November 2025
Maintainers: Aaryan Jain · Kehan Jin · Sophia Su · Ray Xu · Ting-Yu Hsu · Matthew Chen

## 1. Obtaining the Source Code

### **Repository**
Public GitHub repository:  
https://github.com/Ashuchamp/CSE403-GoBuddy.git

Clone the repository:
```bash
git clone https://github.com/Ashuchamp/CSE403-GoBuddy.git
cd CSE403-GoBuddy
```
This repository contains both application code and project documentation.
The frontend app is located in the /go-buddy directory.

### **Dependencies**
The project uses:
* Node.js (v18+)
* npm (v9+)
* Expo CLI (for React Native)
* ESLint, Prettier, and Husky (for linting and pre-commit checks)

Install dependencies from the project root:

```bash
npm install
```
If working only on the frontend:

```bash
cd go-buddy
npm install
```
## 2. Directory Structure
|Path | Description |
| -- | -- |
| /go-buddy/ | React Native (Expo) frontend application. |
| /go-buddy/src/ | Main source files (screens, components, utilities). |
| /go-buddy/assets/ | Images, fonts, and static resources. |
| /backend/ | Node.js/Express API server. |
| /backend/src/ | Controllers, models, routes, utilities. |
| /reports/ | Weekly milestone reports and project progress summaries. |
| /images/ | Screenshots and diagrams for documentation. |
| /docs/ | Developer and user documentation. |

## 2. System Architecture Overview
**Frontend (Mobile App)**
* React Native + Expo
* TypeScript
* React Navigation
* Jest + React Testing Library for UI tests
* Metro bundler

**Backend (API)**
* Node.js + Express
* PostgreSQL
* TypeScript
* Nodemon for dev
* REST API endpoints under /api/*

**CI/CD**
* GitHub Actions
* TypeScript type-check
* ESLint + Prettier
* Jest tests + coverage
* PR validation

## 4. Building the Software
**Prerequisites**
Node.js v18+
npm v9+
Expo CLI (install globally):
```bash
npm install -g expo-cli
```
**Frontend Build**
Navigate to the frontend directory:

```bash
cd go-buddy
```
Install dependencies:

```bash
npm install
```
Start the Expo development server:

```bash
npx expo start
```
You can scan the QR code with the Expo Go app or run the simulator.

**Backend Build**
Navigate into backend:

```bash
cd backend
npm install
```

Create database:
```bash
createdb gobuddy
```

Recommended automatic setup:
```bash
./setup.sh
```

Manual environment setup:
```bash
cp .env.example .env
```

Set `DB_USER` according to platform:
* maxOS: your system username, empty password
* Linux: usually `postgres`
* Windows: depends on installer

Start backend:
```bash
npm run dev
```
## 5. Running the System
**Option 1: Real App Mode (for development)**
1. Start backend:
```bash
cd backend
npm run dev
```

2. Start frontend:
```bash
cd go-buddy
npm start
```

3. In the app:
* Click “Sign in with Google”
* Use your @uw.edu email
* A new fresh account will be created

**Option 2: Demo Mode (for presentations)**
**❗ MUST run npm run seed first.** 
1. Seed database:
```bash
cd backend
npm run seed
```

2. Start backend:
```bash
npm run dev
```

3. Start Expo:
```bash
cd go-buddy
npm start
```

4. In app:
* Click “Skip to Demo (for showcase)”
* Logs in as demo@uw.edu
* Browse pre-populated activities & users

## 6. Testing the Software
**Quick Test (Full System)**
From project root:
```bash
./pre-pr-check.sh
```
Runs: 
* Frontend tests
* Linting
* TypeScript
* Formatting
* Coverage

**Frontend Tests**
From the frontend folder:
```bash
cd go-buddy
npm test
npm run test:coverage
npm run lint
npm run type-check
```
Coverage threshold is configured in `package.json` (minimum 5%).

**Backend Tests**
Backend uses manual API testing.

Start backend:
```bash
cd backend
npm run dev
```

Run test script:
```bash
./test-api.sh
```

Quick health check:
```bash
curl http://localhost:3000/api/health
```
Full guide in `TESTING.md`.


## 7. Adding New Tests
Test File Locations
| Layer | Folder | File Pattern |
| Frontend (React Native) | /go-buddy/src/__tests__/ | *.test.tsx |
| Integration Tests | /go-buddy/src/__tests__/integration/ | *.test.ts |

**Naming Convention**
All test files must end with .test.ts or .test.tsx.
Example:

```bash
go-buddy/src/__tests__/ActivityList.test.tsx
```
**Test Example**
```tsx
Copy code
import { render, screen } from "@testing-library/react-native";
import ActivityCard from "../components/ActivityCard";

test("renders activity title correctly", () => {
  render(<ActivityCard title="Hiking" />);
  expect(screen.getByText("Hiking")).toBeTruthy();
});
```
**Execution**
Jest automatically detects test files.
Run all tests via:

```bash
npm run test
```

## 8. Physical Device Testing
1. Find your machine's IP
macOS:
```bash
ipconfig getifaddr en0
```
2. Update:
`go-buddy/src/services/api.ts`
```bash
const API_BASE_URL = "http://YOUR_IP:3000/api";
```
3. Connect both phone + computer to same WiFi
4. Reload Expo (press r)

## 9. Resetting the Database
⚠️ This deletes ALL data:
```bash
cd backend
psql -d gobuddy -f clear-seed.sql
```
Then:
* Re-seed for demo mode
* Or re-login with Google to recreate user


## 10. Building a Release
Release Steps
Ensure main branch is up to date and all CI checks have passed.

Update version number in:

* go-buddy/app.json

* root package.json

Build the production app using Expo:

```bash
cd go-buddy
npx expo build:android
npx expo build:ios
```
Verify build output on a test device or emulator.

Commit and tag release:

```bash
git tag -a v1.0.0 -m "Initial GoBuddy release"
git push origin v1.0.0
```
**Sanity Checks** 
Confirm app launches successfully.

Ensure login, search, and activity pages render correctly.

Verify CI reports ✅ on build and tests.

## 11. Contribution Workflow
| Step | Description |
| 1. Branch | Create feature branch from dev: git checkout -b feature/<name> |
| 2. Develop | Implement code, run npm run lint and npm run test locally. |
| 3. Commit | Use Conventional Commits (feat:, fix:, docs:, etc.). |
| 4. Pull Request |	Push to GitHub → open PR → check “Allow edits by maintainers.” |
| 5. CI & Review | GitHub Actions runs Jest + ESLint checks. |
| 6. Merge | Requires one review approval and passing CI. |

## 12. Troubleshooting
**Common Issues**
npm install fails
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```
Tests won't run
```bash
cd go-buddy
npm test -- --clearCache
npm install
```
Backend DB connection fails
* Postgres not running
* Wrong DB user in .env
macOS fix:
```bash
DB_USER=<your-macos-username>
DB_PASSWORD=
```
Port 3000 in use
```bash
lsof -i :3000
kill -9 <PID>
```
More details:
* Backend Troubleshooting
* Setup Guide Troubleshooting

## 13. Directory Overview (Visual Summary)
```bash
📦 Project Root
├── .github/                # CI/CD configs
├── Go Buddy App Features/  # Feature documents & prototypes
├── go-buddy/               # Frontend (Expo app)
│   ├── assets/             # Static images and fonts
│   ├── ios/                # iOS project files
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   ├── screens/        # App screens and navigation
│   │   ├── navigation/     # App Navigator
│   │   └── __tests__/      # Jest tests
│   ├── App.tsx             # Root app entry
│   └── package.json        # Expo project config
│
├── docs/                   # Developer & design docs
├── reports/                # Weekly progress reports
├── images/                 # Architecture diagrams & visuals
└── README.md               # Overview and setup guide
```

## 14. Additional Resources
Wiki Pages

/wiki/System-Architecture – Component diagrams & data flow

/wiki/Testing-Infrastructure – CI pipeline and testing philosophy

/wiki/Design-Decisions – Technology choices & rationale

Maintainers:
Aaryan Jain · Kehan Jin · Sophia Su · Ray Xu · Ting-Yu Hsu · Matthew Chen
Last updated: October 2025


