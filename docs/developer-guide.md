# Developer Guide

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
| /go-buddy/ios/ | Platform-specific configuration for iOS builds. |
| /reports/ | Weekly milestone reports and project progress summaries. |
| /images/ | Screenshots and diagrams for documentation. |
| /docs/ | Developer and user documentation. |

## 3. Building the Software
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

## 4. Testing the Software
The project uses Jest as the testing framework with React Testing Library for UI tests.

Running Tests
From the root or inside go-buddy/:

```bash
npm test
```
or run frontend-only tests:

```bash
cd go-buddy
npm run test
```
Coverage Reports
Generate coverage:

```bash
npm run test -- --coverage
```
Reports are output under /go-buddy/coverage/.

Testing External Services
Expo and Firebase authentication are mocked for testing.

No real external calls are made during automated tests.

## 5. Adding New Tests
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
## 6. Building a Release
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

## 7. Contribution Workflow
| Step | Description |
| 1. Branch | Create feature branch from dev: git checkout -b feature/<name> |
| 2. Develop | Implement code, run npm run lint and npm run test locally. |
| 3. Commit | Use Conventional Commits (feat:, fix:, docs:, etc.). |
| 4. Pull Request |	Push to GitHub → open PR → check “Allow edits by maintainers.” |
| 5. CI & Review | GitHub Actions runs Jest + ESLint checks. |
| 6. Merge | Requires one review approval and passing CI. |

## 8. Directory Overview (Visual Summary)
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
📘 9. Additional Resources
Wiki Pages

/wiki/System-Architecture – Component diagrams & data flow

/wiki/Testing-Infrastructure – CI pipeline and testing philosophy

/wiki/Design-Decisions – Technology choices & rationale

Maintainers:
Aaryan Jain · Kehan Jin · Sophia Su · Ray Xu · Ting-Yu Hsu · Matthew Chen
Last updated: October 2025

