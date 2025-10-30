## GoBuddy

A mobile app that helps students discover, propose, and coordinate activities with compatible peers. GoBuddy streamlines finding partners for workouts, study sessions, games, and more by matching interests, availability, and intent.

### Goals
- Provide an easy way to browse, request, and organize activities
- Improve matching via intent, skills, location, and time windows
- Offer lightweight profiles, messaging entry points, and simple coordination flows

### Repository Layout
- `go-buddy/`: React Native (Expo) application source
  - `src/components/`: Reusable UI components
  - `src/screens/`: App screens (browse, recommendations, connections, profile, etc.)
  - `src/navigation/`: App navigation structure
  - `src/data/`: Mock data for development and tests
  - `src/services/`: Integrations (e.g., Google auth)
  - `ios/`, `android/`: Native platform projects for builds
  - `__tests__/`: Component and screen tests
- `docs/`: Public-facing documentation (developer guide, user manual, coding guidelines)
- `reports/`: Weekly progress reports
- `images/`: Architecture and design assets
- Root configs and tooling: `package.json`, `tsconfig.json`, `Makefile`, etc.

### Living Document (Internal)
Our internal living document tracks evolving plans, decisions, and working notes. It is intentionally kept outside this repository for privacy and to separate internal process from the public codebase.

- Living Doc: [GoBuddy Living Document](https://docs.google.com/document/d/1p3QBh7KAYP06WYBGqdLce5ktvth-cW0wMUFkJ-nHww0/edit?tab=t.0)

Note: The living document is for team-internal use and should not be mirrored in this repository. This README links to it as required.

### Getting Started
- Prerequisites: Node.js LTS, Yarn or npm, Xcode (iOS), Android Studio (Android)
- Install: `cd go-buddy && npm install`
- Run (Expo): `npm start` then choose iOS/Android/web
- Tests: `npm test`

### License
This project is for academic purposes. See repository for details if/when a license is added.
