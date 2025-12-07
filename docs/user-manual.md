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

### Navigation
* **Profile (Bottom Tabs)**: View and edit your personal information.  
  In the Profile page, users can:
  - Update **name**, **bio**, **activities interests**, **preferred time**, **Contact Information**(including Phone, Instagram, Contact Email)  
  - Review basic account information  
  Profile can be accessed at any time after logging in.

* **Browse(Bottom Tabs)**: Search for students or activities using filters.  
  - **Behavior:**  
        - Browse only shows *other users* and *other users' activities* that you are **not already connected with**. Users you have already **sent a request to**, **received a request from**, or are **connected with** will **not appear** in Browse or search results (intentional for this iteration).  
        - Your **own/joined/pending request activities**  also do **not appear** in Browse.  

* **For You(Bottom Tabs)**: Get matched with groups based on interests.  
* **Map(Bottom Tabs)**: View nearby active activities based on your location.  
  The map provides a spatial overview of activities happening around you:

  - Displays **active activities** positioned according to their real-world locations.  
  - You can **browse by distance**, allowing you to quickly discover events closest to you.  
  - Tapping an activity marker opens the **Activity Detail** page directly, where you can view full information and choose to **request to join** the activity.  
  - Location permissions are required for the best experience.

  This feature helps users discover activities in a more intuitive, map-based view.

* **My Activities(Bottom Tabs)**: Create or check stutus of student activity groups.  

  - **Create New**: Start a new activity by setting the title(required), description, max people(required), time, and location.  
    After creating an activity, you will automatically become the organizer.

  - **Organizing**: View and manage all activities **you created**.  
    This section contains:
      - **Active** activities (currently open and ongoing)  
      - **Inactive** activities (past or no longer active)  
    From here, organizers can update details, review join requests, approve or deny participants, and manage group members.

  - **Participating**: View activities created by other users that you are involved in.  
    This includes:
      - **Pending** requests (you have requested to join and are waiting for approval)  
      - **Approved** activities you have already joined  
    Users can check activity details and stay informed about their participation status.

* **Connections(Bottom Tabs)**: Manage your social connections on the platform.  
  This page is divided into three sections:

  - **Received**: Connection requests **sent to you** by other users.  
    You may choose to **Accept** or **Deny** these requests.

  - **Sent**: Connection requests **you have sent** to other users.  
    These will remain pending until the other user accepts or denies your request.

  - **Connected**: Users with whom you have an **established connection**.  
    Once connected, you can view the person's **full contact information**, including phone number, email, and Instagram (if provided).  
    All contact methods are fully linked — you can **tap to open** the corresponding app or **use the copy button** next to each field to quickly copy the information.
    
* **Activity Details (All Activity Cards)**:  
  Activity details can be accessed from **Browse, For You, Map, and My Activities**. Each activity page includes information such as title, description, time, max participants, and location.  
  - **Location Behavior:**  
        Tapping the **location field** will automatically open the address in **Google Maps**, allowing users to navigate to the event from anywhere in the app.

* **Notifications (Top Right Bell Icon)**: View real-time alerts related to your activity on the platform.  

  - **Activity Join Requests**:  
    Organizers receive notifications when someone requests to join their activity.

  Notifications help users stay informed without needing to constantly check individual pages.  
  The bell icon in the upper right corner indicates when new notifications are available.

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
