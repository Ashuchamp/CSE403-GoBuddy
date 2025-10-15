# CSE403-GoBuddy


## 1) Team Info

### Team roster & roles

| Member | Role Focus | Notes |
| -- | -- | -- |
| Aaryan Jain (@Ashuchamp, `aaryaj@uw.edu`) | Backend / API Design | Database and authentication lead; responsible for API structure and endpoint consistency. |
| Kehan Jin (@Jinkehan, `jinkehan@uw.edu`) | Backend / Search Logic | Implements query optimization and user-matching logic for efficient discovery. |
| Ray Xu (@iurux, `rayxr@uw.edu`) | Frontend / UI Development | Focuses on state management, component testing, and UI consistency. |
| Ting-Yu Hsu (@alisa01-ali, `tingyu01@uw.edu`) | UI / Design Integration | Converts Figma mockups into React Native components; ensures design fidelity. |
| Sophia Su (@SuJning, `sjn0305@uw.edu`) | Frontend / Integration | React Native lead; oversees QA testing and ensures smooth view integration. |
| Ian Matthew Lua (@Dev1cey, `luam@uw.edu`) | Full-Stack / Testing | Handles CI/CD setup, documentation, and end-to-end testing workflows. |

### Project artifacts (links)

* **GitHub repo (public):** `https://github.com/Ashuchamp/CSE403-GoBuddy`

### Communication & working agreements

* **Synchronous:** Meeting online for a weekly standup (30 mins) and adhoc meetings as needed.
* **Asynchronous:** Text messages for day to day communication and planning things out; Ed for course Q&A.
* **Decision making:** Default to lazy consensus; escalate for critical issues and decisions and full team discussion.
---

## 2) Product Description

### Vision (revised from proposal)

GoBuddy is a campus‑focused mobile app that helps UW students find **activity buddies**—for the gym, sports, studying, gaming, and other hobbies. Profiles emphasize **activity‑based intent** (e.g., “looking for a gym buddy,” “basketball on weekends,” “BIO 180 study partner”). Users verify a `*.uw.edu` email, browse or search by tags/categories, and exchange contact info through a **lightweight in‑app request** flow designed to move matches to real‑world meetups quickly. We will pilot at UW first, with future expansion to additional campuses.

**Problem**
Students often want to try new activities or maintain habits but lack someone to join them. Existing friend‑matching apps are broad, and rarely optimized for concrete, in‑person activity meetups.

**Our differentiation**

* **Activity‑centric profiles & discovery** (clear intent, low social friction).
* **Campus verification** (UW affinity increases trust and relevance).
* **Purposeful request flow** (exchange contact info to move off‑app).
* **Simplicity** (MVP focuses on the core: discover → request → connect).

### Major features (MVP)

1. **UW Identity Verification** — SSO via UW authentication service (no passwords stored by app) or magic‑link flow requiring a `uw.edu` address before profile is visible.
2. **Activity‑centric Profiles** — Bio, skills/experience, preferred times, **activity tags selected from predefined categories** (e.g., `gym`, `soccer`, `BIO 180 study`), and **campus locations chosen from a dropdown list** (e.g., IMA, Odegaard, HUB, Red Square).
3. **Browse & Search** — Filter by predefined tags, categories (sports/study/creative/etc.), time windows, and campus location (selectable from list).
4. **Request to Connect** — In‑app request to exchange contact info (e.g., phone/Instagram). Sender can include a short note; receiver can accept/decline.
5. **Action History** — In‑app log of all actions taken, including connection requests sent/received, contact information exchanges, activity intents posted/modified/deleted, and groups joined/left.
6. **Recommendations** — Simple heuristic or ML‑light suggestions based on tags/time windows.

### Backend implementation and data storage

The app uses a **Node.js + Express** backend with a **Postgres** database managed via **Prisma ORM**. The database stores user profiles (`users` table with UW email, username, bio, verification status), predefined activity tags and locations (`activity_tags`, `locations` tables), user preferences (many-to-many `user_activity_tags` and `user_locations` linking users to their selected tags/locations with skill levels and time preferences), activity intents (`activity_intents` for posted activities), connection requests (`connection_requests` tracking pending/accepted status), contact info (`contact_info` with phone/Instagram, only visible after connection acceptance), action history (`action_history` logging all user interactions), and safety records (`blocks_and_reports`). Key API calls include authentication endpoints (`POST /auth/sso/initiate`, `GET /auth/sso/callback`, magic link endpoints), profile endpoints (`GET /users/me`, `PUT /users/me`), search/discovery (`GET /search` with tag/location/time filters, `GET /recommendations` using tag similarity), connection management (`POST /connections/request`, `POST /connections/:id/respond`, `GET /connections/:user_id/contact`), and activity/history endpoints (`POST /intents`, `GET /intents`, `GET /history`). All endpoints validate JWT tokens for authorization, use Prisma's parameterized queries to prevent SQL injection, and validate inputs with Zod schemas.

### Stretch goals

* **Multi‑campus expansion** — Extend verification to other universities beyond UW.
* **Events & Groups** — Create one‑off activity posts (e.g., "3v3 basketball today at 4pm").
* **Scheduling helpers** — Calendar export or quick‑poll for times.
* **Enhanced Action History** — Export history, search/filter past actions, analytics dashboard.

### Out of scope (for M2–M3)

* Complex geolocation matching or maps.
* Payments/marketplace features.

---

## 3) Use Cases — Functional Requirements

**System‑wide assumptions**

* Users are UW students verified via `uw.edu` email or UW SSO.
* Mobile is primary (React Native); a basic web view may exist for read‑only browsing.
* Contact info exchange happens through a request/accept flow; **no in‑app chat or messaging** — users move to external platforms after connecting.
* All user actions are logged in an **Action History** for transparency and accountability.

### UC‑1: Send request to connect  *(Owner: Aaryan Jain)*

**Actors:** Requester (verified user), Recipient (verified user)  
**Trigger:** Requester taps “Request to connect” on a profile.   
**Preconditions:** Both have verified accounts; requester has an existing profile.   
**Postconditions:** Recipient receives a pending request with optional message.  

**Main flow:**
1. Requester writes an optional note (e.g., “Free M/W mornings at IMA”).
2. System validates request rate limits (spam control) and creates a **Pending** request.
3. Recipient gets an in‑app notification and email summary.

**Extensions:** (a) Withdraw request; (b) Recipient pre‑filters (auto‑ignore certain tags).  
**Exceptions:** (E1) Recipient has blocked requester ⇒ reject with generic failure; (E2) Rate limit exceeded ⇒ ask to try later.  

### UC-2: Create new activity intent  *(Owner: Kehan Jin)*

**Actors:** User (verified user)  
**Trigger:** User fill in info about a new activity intent and post it.    
**Preconditions:** User has verified account with existing profile.    
**Postconditions:** The user has an actility intent associated to their profile and other users can view it.   
**Main flow:**
1. User goes to a create intent page and fill in information about the new intent.
2. User verifies information are correct and post it.
3. Other users can view this new activity intent and connect with the user.  

**Extensions:** (a) Another user views the intent and intend to connect; (b) User decide to delete the activity intent.  
**Exceptions:** (E1) Internet failure while sending message ⇒ ask to try later; (E2) User don't have an existing profile ⇒ direct to profile set up page.

### UC‑3: Create Profile  *(Owner: Ting-Yu Hsu)*

**Actors:** User (verified user)       
**Trigger:** User sign in for the first time to create profile.       
**Preconditions:** User account(uw email) was verified.  
**Postconditions:** Profile data are saved and available to be searched. 

**Main flow:**
1. System navigate to profile creation page after user first sign in.
2. User enter a username, short bio, select activity tags, and upload profile picture.
3. System valiadate input (eg. must have username, other fields can be skipped).
4. System store the new profile in the database.
5. Profile become visible to other users through searching and browsing.

**Extensions:** (a) User later edit profile; (b) User ignore uploading photo (default avatar display).  
**Exceptions:** (E1) Invalid or missing input ⇒ show validation error message; (E2) System unable to save edit profile due to internet connection error ⇒ show save failed message and notice user to try again. 

### UC‑4: Keyword-based activity search  *(Owner: Ray Xu)*

**Actors:** User (verified user).         
**Trigger:** User click in the search field and type the keyword.   
**Preconditions:** User account was verified.   
**Postconditions:** A list of activities that contain the keyword will show up.  

**Main flow:**
1. User click the search field.
2. User type in the keyword. (e.g. user type "hiking")
3. System take in the keyword.
4. System searches through the databased for activities.
5. System returns a list of activities that contain keyword and available for user to view.

**Extensions:** (a) Save activities interested in to user's wishlist; (b) Search activities based on keyword related terms.  
**Exceptions:** (E1) Keyword doesn't exist in the database ⇒ suggest user to create an activity; (E2) Keyword exceeds the available input length ⇒ deny the search and suggest shorten the keyword. 

### UC‑5: Group Activity Formation  *(Owner: Sophia Su)*

**Actors:** Organizor (verified user), Participants (verified user)  
**Trigger:** Organizer converts an individual intent into a group activity.   
**Preconditions:** Organizer has at least one posted intent.
**Postconditions:** The system creates a shared group activity with multiple participants.  

**Main flow:**
1. Organizer selects “Convert to group activity” on an intent.
2. System prompts the organizer to set maximum participants and visibility (public/private).
3. Interested users can join until the group is full.
4. Once full, the system automatically creates a group confirmation summary.

**Extensions:** (a) Organizer can reopen or close the group; (b) Users can leave before event date.
**Exceptions:** (E1) Group reaches full capacity ⇒ show “activity full”; (E2) Organizer cancels ⇒ notify all participants.

### UC‑6: Exchange Contact Info *(Owner: Matthew Lua)*

**Actors:** User (verified & connected user).         
**Trigger:** One user taps “Exchange contact info” after both have accepted a connection request.
**Preconditions:** Both have verified accounts; requester has an existing profile. 
**Postconditions:** Users involved receive the other’s shared contact info, depending on their privacy settings.

**Main flow:**
1. User opens connection detail page.
2. User taps “Exchange contact info.”
3. System verifies connection status and retrieves both users’ contact details.
4. System displays the shared contact info to both users.

**Extensions:** (a) User edits or removes shared info later; (b) User selects which contact method to share.
**Exceptions:** (E1) One user disables sharing -> show "Contact exchange unavailable"; (E2) Network error -> prompt to try again later.

---

## 4) Non‑Functional Requirements


1. **Data Fields & Privacy Levels**

   The app stores and manages user information with the following privacy tiers:

   * **Always Public** (visible to all verified users): Username, profile picture, bio, activity tags, skills/experience level, preferred times, campus locations, activity intents (posted activities), groups/events joined, activity timestamps ("Active 2 days ago" indicators).
   
   * **Private Until Connected**: Contact information (phone number, Instagram handle, etc.) — hidden until connection request is accepted by both parties.
   
   * **Never Shared** (auth & system only): UW email address (authentication only, never displayed), authentication tokens (OAuth/session tokens, securely stored with auto-expiration), verification status, account status (active/suspended/banned), rate limit counters for spam prevention.
   
   * **User-Private**: Action history (log of requests sent/received, contacts exchanged, activities created/joined) — visible only to the user themselves.
   
   * **Admin Only**: Block/report records (for safety and moderation), IP addresses from login events (retained 90 days for security auditing).
   
   * **Visible to Involved Parties**: Connection requests (pending/accepted/declined with timestamps) — only visible to requester and recipient.

2. **Data Retention Policy**

   * **Active accounts:** Data retained indefinitely while account is active.
   * **Deleted accounts:** User data permanently deleted within 30 days of account deletion request; legal/safety records retained per policy.
   * **Inactive accounts:** Accounts inactive for 2+ years receive deletion warning; deleted after 2.5 years.
   * **Action history:** Retained for 1 year, then archived/summarized.

3. **User Control**

   Users can:
   * View all their stored data via "Download My Data" feature.
   * Edit public profile fields at any time.
   * Delete their account and all associated data.
   * Control which contact methods to share after connection acceptance.
   * Block or report other users.

2. **Security & Privacy**

   * UW‑only access: verified via `uw.edu` email or **UW SSO (primary method)**—no passwords stored by the app.
   * **External authentication** via UW Identity Service or OAuth providers (Microsoft 365) handles all credential management.
   * Store only necessary PII; **contact info is hidden** until connection acceptance.
   * Secure token handling: OAuth tokens encrypted at rest, automatic expiration and rotation.
   * Abuse controls: rate limits (per IP & per account), block/report, **content filter for abusive/harassing language** (hate speech, threats, slurs, explicit harassment—not casual profanity).

   **How We Ensure Only UW Students Can Log In:** We primarily use UW's official Single Sign-On (SSO) system, which redirects users to UW's authentication portal (`weblogin.washington.edu`) where they log in with their NetID—only active UW students/staff have valid NetID credentials, so UW verifies their affiliation for us. As a fallback, we offer magic links sent to `@uw.edu` email addresses (domain validated before sending), which proves the user controls a UW email that only UW issues to affiliates. All user records require `verification_status = 'verified'` before their profile becomes visible to others, and all API endpoints require a valid JWT issued after successful authentication, ensuring no public access without UW verification.
3. **Usability & Accessibility**

   * Onboarding to first result ≤ **2 minutes** for a typical user.
   * Clear empty states and inline validation.
4. **Performance**

   * P50 search latency ≤ **300 ms**, P95 ≤ **800 ms** for 1k profiles; pagination supported.
   * Image uploads ≤ **5 MB**, processed asynchronously.
5. **Reliability**

   * Staging uptime ≥ **99%** during business hours; error budget documented.
   * Recoverable failures: retries with exponential backoff for email & storage.
6. **Scalability (pilot)**

   * Support **5k** users and **100 concurrent** active sessions without degradation.

---

## 5) External Requirements

* **Robust to reasonable errors:** Input validation across all forms (tags count, bio length, allowed contact fields). Friendly error messages; retries for transient failures.
* **Installable/Accessible:** Provide a **public staging URL** for the web (read‑only browse) and a **TestFlight/Expo link** for mobile. Document setup and `.env` variables.
* **Buildable from source:** One‑command local bootstrap using Docker Compose (Postgres + API + web + mailhog). `make dev` spins up everything; seed script loads sample profiles.
* **New‑dev onboarding:** `docs/CONTRIBUTING.md` with architecture overview, runbooks, and style guide.
* **Right‑sized scope:** MVP limited to verification, profiles, search, and request flow.

---

## 6) Team Process Description

### Toolset (and rationale)

* **Languages:** TypeScript (shared types client/server), SQL (Postgres).
* **Mobile:** React Native (Expo).
* **Backend:** Python, Node.js + Express (monolith for MVP), Prisma ORM, Zod for schema validation.
* **DB:** Postgres (Dockerized locally; managed on staging).
* **Auth:** Primary authentication via UW SSO (OAuth 2.0 / SAML); fallback to magic links via SendGrid with domain restriction to `uw.edu`. No passwords stored by the application.
* **CI/CD:** GitHub Actions (lint, typecheck, unit/integration tests, Prisma migrate).
* **Infra:** Docker Compose for dev; Render/Railway/Fly.io for staging (choose one); object storage for images (e.g., Cloudflare R2).
* **Design:** Figma for wireframes and component library.
* **Tracking:** GitHub Issues and GitHub Projects (Kanban), milestones per week.

### Roles & justification

- Aaryan Jain – Backend / API Design: Leads backend and API development, leveraging strong Node.js and database design skills to ensure reliable server communication.  
- Kehan Jin – Backend / Search Logic: Implements and optimizes search and matching algorithms critical to GoBuddy’s discovery features.  
- Ray Xu – Frontend / UI Development: Develops and tests React Native components, ensuring consistent state management and responsive user interfaces.  
- Ting-Yu Hsu – UI / Design Integration: Translates Figma designs into React Native views, maintaining visual consistency and usability across the app.  
- Sophia Su – Frontend / Integration: Oversees frontend integration and QA testing, ensuring all views and APIs connect seamlessly.  
- Ian Matthew Lua – Full-Stack / Testing: Manages CI/CD pipelines and full-stack testing to maintain build stability and deployment quality.  

### Branching & quality gates

* Feature‑based development with short‑lived feature branches.
* PRs require 1 reviewer + green CI (lint/type).
* Conventional Commits; auto‑changelog; code owners for sensitive paths.

### Week‑by‑week schedule (measurable milestones)

#### Week 3 — Setup & UI Finalization

**Goals:** Finalize designs, set up infrastructure, and verify navigation.

<table>
<thead>
<tr>
<th width="12%">Member</th>
<th width="48%">Task</th>
<th width="40%">Concrete Milestone</th>
</tr>
</thead>
<tbody>
<tr><td><strong>Sophia</strong></td><td>Create base React Native app with tab navigation (Home, Browse, Profile).</td><td>App launches; user can tap between tabs without errors.</td></tr>
<tr><td><strong>Aaryan</strong></td><td>Initialize Node.js/Express backend and connect to Firestore.</td><td><code>GET /health</code> returns "OK".</td></tr>
<tr><td><strong>Kehan</strong></td><td>Draft database schema (<code>users</code>, <code>activities</code>, <code>connections</code>).</td><td>JSON schema committed & loaded in DB.</td></tr>
<tr><td><strong>Ray</strong></td><td>Build reusable button/input components from Figma.</td><td>Components render correctly in Expo.</td></tr>
<tr><td><strong>Ting-Yu</strong></td><td>Finalize all Figma mockups with labeled components.</td><td>Exported Figma file linked in repo.</td></tr>
<tr><td><strong>Matthew</strong></td><td>Configure CI workflow for lint + build checks.</td><td>Sample commit triggers and passes CI pipeline.</td></tr>
</tbody>
</table>

**Milestone:** Functional skeleton app + backend server health check.

---

#### Week 4 — Authentication & User Profiles

**Goals:** Implement login/signup and store user info.

<table>
<thead>
<tr>
<th width="12%">Member</th>
<th width="48%">Task</th>
<th width="40%">Concrete Milestone</th>
</tr>
</thead>
<tbody>
<tr><td><strong>Sophia</strong></td><td>Build Login View with SSO button and magic link option.</td><td>User can initiate UW SSO or request magic link.</td></tr>
<tr><td><strong>Aaryan</strong></td><td>Implement <code>/auth/sso</code> and <code>/auth/magic-link</code> routes with UW OAuth integration.</td><td>SSO callback creates user session and returns token.</td></tr>
<tr><td><strong>Kehan</strong></td><td>Create Postgres <code>users</code> collection with sample data.</td><td>Two users retrievable by API.</td></tr>
<tr><td><strong>Ray</strong></td><td>Implement SSO callback handler and magic link verification flow.</td><td>UW SSO redirect completes successfully with user session.</td></tr>
<tr><td><strong>Ting-Yu</strong></td><td>Build Profile View UI (name, bio, image upload placeholder).</td><td>Profile View shows editable fields.</td></tr>
<tr><td><strong>Matthew</strong></td><td>Connect frontend auth forms to backend SSO and magic link endpoints.</td><td>Successful SSO login navigates to Home View with token.</td></tr>
</tbody>
</table>

**Milestone:** User can register, verify, log in, and edit profile data in DB.

---

#### Week 5 — Home & Browse (Search and Filter)

**Goals:** Browsing and searching for activities/users works.

<table>
<thead>
<tr>
<th width="12%">Member</th>
<th width="48%">Task</th>
<th width="40%">Concrete Milestone</th>
</tr>
</thead>
<tbody>
<tr><td><strong>Sophia</strong></td><td>Implement Home View fetching activities from <code>/activities</code>.</td><td>Displays ≥3 activities from DB.</td></tr>
<tr><td><strong>Aaryan</strong></td><td>Build <code>/search</code> API with filters (date, location).</td><td>API returns filtered JSON via Postman.</td></tr>
<tr><td><strong>Kehan</strong></td><td>Write query logic for partial matches.</td><td>"Yoga" → "Morning Yoga" returns correctly.</td></tr>
<tr><td><strong>Ray</strong></td><td>Create Browse View UI + search bar and filters.</td><td>Typing keyword updates results on screen.</td></tr>
<tr><td><strong>Ting-Yu</strong></td><td>Add loading & empty-state UI.</td><td>"No results found" renders properly.</td></tr>
<tr><td><strong>Matthew</strong></td><td>Connect Browse View to <code>/search</code> API.</td><td>Typing "tennis" fetches backend results.</td></tr>
</tbody>
</table>

**Milestone:** User can search and see matching activities from backend.

---

#### Week 6 — Recommendations & Connections

**Goals:** Recommendation algorithm and connection requests functional.

<table>
<thead>
<tr>
<th width="12%">Member</th>
<th width="48%">Task</th>
<th width="40%">Concrete Milestone</th>
</tr>
</thead>
<tbody>
<tr><td><strong>Sophia</strong></td><td>Build Recommendation View UI.</td><td>Displays mock recommendation cards.</td></tr>
<tr><td><strong>Aaryan</strong></td><td>Create <code>/recommendations</code> endpoint (shared interests).</td><td>Returns top 3 matches as JSON.</td></tr>
<tr><td><strong>Kehan</strong></td><td>Add ElasticSearch/cosine similarity fuzzy matching.</td><td>"Run" matches "Running Club".</td></tr>
<tr><td><strong>Ray</strong></td><td>Build Connections View (show pending/accepted).</td><td>Loads mock connection data.</td></tr>
<tr><td><strong>Ting-Yu</strong></td><td>Add "Send Request" button + pending state UI.</td><td>Clicking updates to "Pending".</td></tr>
<tr><td><strong>Matthew</strong></td><td>Connect to <code>/connections/send</code> and <code>/connections/accept</code>.</td><td>Sending request creates DB record.</td></tr>
</tbody>
</table>

**Milestone:** User can view recommendations and send/accept connections.

---

#### Week 7 — Activities (Create, View, Detail)

**Goals:** Full activity lifecycle (create → view → detail).

<table>
<thead>
<tr>
<th width="12%">Member</th>
<th width="48%">Task</th>
<th width="40%">Concrete Milestone</th>
</tr>
</thead>
<tbody>
<tr><td><strong>Sophia</strong></td><td>Implement Create Activity View with form validation.</td><td>Submitting logs form values to console.</td></tr>
<tr><td><strong>Aaryan</strong></td><td>Backend <code>/activities/create</code> and <code>/activities/:id</code>.</td><td>Posting adds record retrievable by ID.</td></tr>
<tr><td><strong>Kehan</strong></td><td>Add "join activity" endpoint (user ↔ activity).</td><td>User ID added to participants array.</td></tr>
<tr><td><strong>Ray</strong></td><td>Build Activity Detail View.</td><td>Displays title, date, and host.</td></tr>
<tr><td><strong>Ting-Yu</strong></td><td>Build Activity List View (joined/created).</td><td>Lists correct items per user.</td></tr>
<tr><td><strong>Matthew</strong></td><td>Integrate image upload (object storage).</td><td>Uploaded image URL saved to DB.</td></tr>
</tbody>
</table>

**Milestone:** User can create, view, and join activities successfully.

---

#### Week 8 — Integration & Testing

**Goals:** Combine all modules and perform E2E tests.

<table>
<thead>
<tr>
<th width="12%">Member</th>
<th width="48%">Task</th>
<th width="40%">Concrete Milestone</th>
</tr>
</thead>
<tbody>
<tr><td><strong>Sophia</strong></td><td>UI regression test & fix navigation.</td><td>No crashes navigating 10 views.</td></tr>
<tr><td><strong>Aaryan</strong></td><td>Backend integration tests (Postman).</td><td>All endpoints return 200/400 as expected.</td></tr>
<tr><td><strong>Kehan</strong></td><td>Add server-side validation for bad inputs.</td><td>API returns 400 on missing fields.</td></tr>
<tr><td><strong>Ray</strong></td><td>Implement toast/error alerts on frontend.</td><td>Invalid login shows "Incorrect credentials".</td></tr>
<tr><td><strong>Ting-Yu</strong></td><td>Accessibility tests on iPhone SE + iPad.</td><td>No overlaps or cut-offs on screens.</td></tr>
<tr><td><strong>Matthew</strong></td><td>Record full user flow test (video).</td><td>Demo runs login → browse → connect → activity smoothly.</td></tr>
</tbody>
</table>

**Milestone:** Full end-to-end workflow runs without errors.

---

#### Week 9 — Finalization & Presentation

**Goals:** Polish, document, and present final app.

<table>
<thead>
<tr>
<th width="12%">Member</th>
<th width="48%">Task</th>
<th width="40%">Concrete Milestone</th>
</tr>
</thead>
<tbody>
<tr><td><strong>Sophia</strong></td><td>Compile release build with icon + splash.</td><td>Expo build completes without error.</td></tr>
<tr><td><strong>Aaryan</strong></td><td>Write API docs (endpoints, params, examples).</td><td>README includes cURL examples.</td></tr>
<tr><td><strong>Kehan</strong></td><td>Prepare system architecture slide + diagram.</td><td>Diagram included in slides.</td></tr>
<tr><td><strong>Ray</strong></td><td>Record live app demo (video + voiceover).</td><td>2-min video added to repo.</td></tr>
<tr><td><strong>Ting-Yu</strong></td><td>Design poster (UI highlights + use cases).</td><td>Poster PDF finalized.</td></tr>
<tr><td><strong>Matthew</strong></td><td>QA final build & ensure clean console.</td><td>App logs "No errors found" on start.</td></tr>
</tbody>
</table>

**Milestone:** Final build + docs + demo ready for submission.

---


### Major risks & mitigations

1. **Auth/Email Deliverability Issues**

   * *Mitigation:* Start UC‑1 early; support multiple ESPs; mailhog in dev; clear resend flow.
2. **Scope Creep**

   * *Mitigation:* Rigid MVP; feature flags; stretch goals only after UC‑1…UC‑5 are stable.
3. **Mobile Build/Store friction**

   * *Mitigation:* Use Expo for early distribution; ship a web read‑only surface as a fallback.
4. **Data quality/search relevance**

   * *Mitigation:* Curated tag suggestions; simple scoring; monitor “no results” rate.

### External feedback plan

* **End of W3:** Login/Profile/Browse UX test with 5 UW students; capture time-to-sign-in and navigation clarity.
* **End of W5:** Activity creation & detail-view test (task-based); measure completion rate and error frequency.
* **End of W6:** Full end-to-end flow review with project manager; evaluate stability, usability, and responsiveness.
* **End of W7:** Recommendation/connection flow test; assess clarity, trust, and perceived matching accuracy.
* **Channels:** Short intercept surveys + brief in-person pilot sessions (HUB/IMA); opt-in participants only.

### Definition of Done (per feature)

* Meets acceptance criteria; unit/integration tests pass; accessibility check; telemetry added; updated docs; feature flag default ON in staging.

---
