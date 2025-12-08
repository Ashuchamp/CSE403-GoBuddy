# Developer Guide

## 1. Obtaining the Source Code

### **Repository**
Public GitHub repository:  
```arduino
https://github.com/Ashuchamp/CSE403-GoBuddy.git
```

Clone the repository:
```bash
git clone https://github.com/Ashuchamp/CSE403-GoBuddy.git
cd CSE403-GoBuddy
```

### **Dependencies**
Ensure the following are installed:
* Node.js (v18+)
* npm (v9+)
* PostgreSQL 12+
* Expo CLI (optional but recommended)
* Xcode (macOS) or Android Studio

Install dependencies (root-level):

```bash
npm install
```
Install frontend-only dependencies:

```bash
cd go-buddy
npm install
```
## 2. Directory Layout
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


## 3. Building the Software
### **Frontend Build (Expo)**

Navigate to the frontend directory:
```bash
npm start
```

Start Expo development server:
```bash
cd go-buddy
npm install
```

or explicit:
```bash
npx expo start
```

Options:
* Press i → iOS Simulator
* Press a → Android Emulator
* Scan QR → physical device

### **Backend Build**
Navigate into backend:

```bash
cd backend
npm install
```

Create database:
```bash
createdb gobuddy
```

Recommended environment setup:
```bash
./setup.sh
```

Manual alternative:
```bash
cp .env.example .env
```

Set `DB_USER` according to platform:
* maxOS:
```makefile
DB_USER=<your-macos-username>
DB_PASSWORD=
```

* Linux: `postgres` user, password usually required
* Windows: depends on installer

Start backend:
```bash
npm run dev
```

## 4. Testing the Software
### **Quick Test (Full System)**
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

### **Frontend Tests**
From the frontend folder:
```bash
cd go-buddy
npm test
npm run test:coverage
npm run lint
npm run type-check
```
Coverage threshold is configured in `package.json` (minimum 5%).

### **Backend Tests**
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

Health check:
```bash
curl http://localhost:3000/api/health
```
Full guide in `backend/TESTING.md`.


## 5. Adding New Tests
| Layer | Folder | File Pattern |
| -- | -- | -- |
| Frontend (React Native) | /go-buddy/src/__tests__/ | *.test.tsx |
| Integration Tests | /go-buddy/src/__tests__/integration/ | *.test.ts |

### **Naming Convention**
All test files must end with `.test.ts` or `.test.tsx`.

### **Test Example**
```tsx
import { render, screen } from "@testing-library/react-native";
import ActivityCard from "../components/ActivityCard";

test("renders activity title correctly", () => {
  render(<ActivityCard title="Hiking" />);
  expect(screen.getByText("Hiking")).toBeTruthy();
});
```

**Run tests:**
```bash
npm test
```

## 6. Building a Release
Release Steps
### 1. Ensure main branch is up to date and all CI checks have passed.

### 2. Update version number in:

* go-buddy/app.json

* root package.json

### 3. Build the production app using Expo:

```bash
cd go-buddy
npx expo build:android
npx expo build:ios
```
Verify build output on a test device or emulator.

### 4. Commit and tag release:

```bash
git tag -a v1.0.0 -m "Initial GoBuddy release"
git push origin v1.0.0
```
**Sanity Checks** 
Confirm app launches successfully.

Ensure login, search, and activity pages render correctly.

Verify CI reports ✅ on build and tests.