# GoBuddy User Manual

## High-Level Description

GoBuddy is a mobile-first platform designed for University of Washington (UW) students to meet new people, join or host group activities, and build connections based on shared interests. Users can search for students or events, view AI-powered recommendations, send connection requests, and create or join social groups. Our mission is to promote social discovery and community-building within the UW campus.

---

## How to Install the Software

### Prerequisites

* **Node.js** v18 or higher
* **npm** v9 or higher
* **Expo CLI**: `npm install -g expo-cli`
* **Firebase CLI**: `npm install -g firebase-tools`
* **Expo Go** app (iOS/Android) for running the mobile app
* Optional for devs: **Docker** and **Firebase Emulator Suite**

### Installation Steps

1. Clone the GitHub repository:

```bash
git clone https://github.com/gobuddy-app/gobuddy.git
cd gobuddy
```

2. Install dependencies:

```bash
npm install
```

3. Set environment variables:
   Create a `.env` file at the root and fill in the required values:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
```

Refer to `/docs/env.sample` for a template.

---

## How to Run the Software

### Mobile App (Recommended)

1. Run Expo:

```bash
npm start
```

2. Scan the QR code with Expo Go (on iOS/Android).

### Web Fallback (for demo)

```bash
npm run web
```

Navigate to `http://localhost:19006` in your browser.

> Note: Mobile experience is prioritized. Web version is for demo only.

---

## How to Use the Software

### Authentication & Profile

* Sign in with your UW Google account (OAuth).
* Verify your email before proceeding.
* Edit your profile: name, photo, interests, bio.

### Navigation (Bottom Tabs)

* **Browse**: Search for students or groups using filters.
* **Recommendations**: Get matched with groups based on interests.
* **Groups**: Create or join student activity groups.
* **Connections**: View your connections and pending requests.

### Work in Progress

* Full chat support is being actively developed.
* Push notifications and dark mode support coming soon.

---

## How to Report a Bug

Please report bugs using our GitHub issue tracker. We’ve provided a standardized bug report template to help guide you.

- 🐞 [Create a new bug report](https://github.com/Ashuchamp/CSE403-GoBuddy/issues/new?assignees=&labels=bug&template=bug_report.md&title=Bug%3A+)
- 💡 [Suggest a new feature](https://github.com/Ashuchamp/CSE403-GoBuddy/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=Feature+Request%3A+)
### What to Include

- **Describe the bug**: What exactly is going wrong?
- **To reproduce**: What steps will trigger the bug?
- **Expected behavior**: What should have happened instead?
- **Screenshots**: (Optional) Upload images if relevant
- **Environment info**:
  - OS (e.g., Windows 11, macOS Sonoma)
  - App version / Expo version / Node.js version

> GitHub will auto-fill these fields when you select a template. Please fill them out as completely as possible to help us fix the issue quickly.
---
## ⚠ Known Bugs
All known issues are documented in our [GitHub issue tracker]([https://github.com/gobuddy-app/gobuddy/issues?q=label%3Abug](https://github.com/Ashuchamp/CSE403-GoBuddy/issues?q=label%3Abug)).  
We regularly update and triage bugs to ensure smooth testing and usage.

Thank you for using GoBuddy!
