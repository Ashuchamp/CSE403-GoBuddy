# GoBuddy User Manual

## High-Level Description

GoBuddy is a mobile-first platform designed for University of Washington (UW) students to meet new people, join or host group activities, and build connections based on shared interests. Users can search for students or events, view AI-powered recommendations, send connection requests, and create or join social groups. Our mission is to promote social discovery and community-building within the UW campus.

---

## How to Install the Software

### Prerequisites

* **Node.js** v18 or higher
* **npm** v9 or higher
* **Expo CLI**: `npm install -g expo-cli`
* **Expo Go** app (iOS/Android) for running the mobile app
*  **PostgreSQL** 12+
*  **Xcode** (macOS, for iOS development) or **Android Studio** (for Android development)

### Installation Steps

1. Clone the GitHub repository:

```bash
git clone https://github.com/Ashuchamp/CSE403-GoBuddy.git
cd CSE403-GoBuddy
```

2. Install frontend dependencies:

    ```bash
    cd go-buddy
    npm install
    npm run type-check
    ```

3. Install backend dependencies and configure environment:

    ```bash
    cd ../backend
    npm install
    createdb gobuddy
    ./setup.sh
    ```

    > Alternatively: copy `.env.example` to `.env` and manually fill in DB credentials
---

## How to Run the Software

### Mobile App (Recommended)
### Option 1: Real App Mode (Google OAuth)

> Use this for real development with your own @uw.edu Google account.

1. Start the backend (without seeding):

    ```bash
    cd backend
    npm run dev
    ```

2. Start the mobile app:

    ```bash
    cd ../go-buddy
    npm start
    ```

3. On the app:

    - Select **“Sign in with Google”**
    - Use your **@uw.edu** email
    - Your account will be created in the database

> Do **not** run `npm run seed` in this mode.
> You’ll start with an empty database and your own profile.

---

### Option 2: Demo Mode (Recommended for Showcase)

> Use this mode to demo features with pre-filled users and activities.

1. Seed the database:

    ```bash
    cd backend
    npm run seed
    ```

2. Start the backend:

    ```bash
    npm run dev
    ```

3. Start the mobile app:

    ```bash
    cd ../go-buddy
    npm start
    ```

4. On the app:

    - Select **“Skip to Demo”**
    - You’ll be logged in as **Demo User** with access to existing data
      
   Both Demo and Google users can co-exist in the database and see each other in Browse.

---

### Web Fallback (for demo only)

```bash
cd go-buddy
npm run web
```
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

All known issues are documented in our [GitHub issue tracker](https://github.com/Ashuchamp/CSE403-GoBuddy/issues?q=label%3Abug).  
We regularly update and triage bugs to ensure smooth testing and usage.

---
Thank you for using GoBuddy!
