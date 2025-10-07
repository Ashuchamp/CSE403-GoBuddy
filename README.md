# CSE403-GoBuddy


## 1) Team Info

### Team roster & roles

| Member                          | Role                           |
| ------------------------------- | ------------------------------ |
| Aaryan Jain (@Ashuchamp, `aaryaj@uw.edu`) | ****          |
| Kehan Jin (@Jinkehan, `jinkehan@uw.edu`) | ****           | 
| Ray Xu (@iurux, `rayxr@uw.edu`) | **** | 
| Ting-Yu Hsu (@alisa01-ali, `tingyu01@uw.edu`) | ****      |
| Member E (@githubE, `e@uw.edu`) | ****            |

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

1. **UW Email Verification** — Magic‑link flow that requires a `uw.edu` address before profile is visible.
2. **Activity‑centric Profiles** — Bio, skills/experience, preferred times, **activity tags** (e.g., `gym`, `soccer`, `BIO 180 study`).
3. **Browse & Search** — Filter by tags, categories (sports/study/creative/etc.), time windows, and campus location (optional text field).
4. **Request to Connect** — In‑app request to exchange contact info (e.g., phone/Instagram). Sender can include a short note; receiver can accept/decline.
5. **Recommendations** — Simple heuristic or ML‑light suggestions based on tags/time windows.

### Stretch goals

* **SSO via UW or OAuth (e.g., Microsoft 365)** as an alternative to email magic links.
* **Events & Groups** — Create one‑off activity posts (e.g., “3v3 basketball today at 4pm”).
* **Scheduling helpers** — Calendar export or quick‑poll for times.
* **Real‑time chat** - group chatrs or communication channels between users (e.g., a group chat for 3v3 basketball today at 4pm)

### Out of scope (for M2–M3)

* Complex geolocation matching or maps.
* Payments/marketplace features.

---

## 3) Use Cases — Functional Requirements

**System‑wide assumptions**

* Users are UW students using a `uw.edu` email.
* Mobile is primary (React Native); a basic web view may exist for read‑only browsing.
* Contact info exchange happens through a request/accept flow; no in‑app chat.

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

### UC-2: Chat to schedule meeting  *(Owner: Kehan Jin)*

**Actors:** User1 (verified user), User2 (verified user)  
**Trigger:** User1 starts a new conversation with User2  
**Preconditions:** Both have verified accounts, and are already connected.  
**Postconditions:** Two users successfully schedule a time to meet, chat history available for both to view.   
**Main flow:**
1. User1 starts a new chat and sends User2 an initial message.
2. During the chat each User are able to send new messages and get notification upon receiving new messages.
3. After each message being sent, the new message is stored in the database and available for both users to view  

**Extensions:** (a) More chat between users; (b) Possibly one user un-connect or block another; (c) Possibly one user report spam or harrassment on conversation.  
**Exceptions:** (E1) Internet failure while sending message ⇒ ask to try later; (E2) One user has blocked the other ⇒ reject with generic failure.

### UC‑3: Create Profile  *(Owner: Ting-Yu Hsu)*

**Actors:** User (verified user)       
**Trigger:** User sign in for the first time to create profile. 
**Preconditions:** User account(uw email) was verified.  
**Postconditions:** Profile data are saved and available to be searched. 

**Main flow:**
1. User click on "edit profile"
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

---

## 4) Non‑Functional Requirements

1. **Security & Privacy**

   * UW‑only access: verified `uw.edu` email required to view or be viewed.
   * Store only necessary PII; **contact info is hidden** until acceptance.
   * OAuth‑grade secrets handling; salted password hashes (if any), token rotation.
   * Abuse controls: rate limits (per IP & per account), block/report, basic profanity filter.
2. **Usability & Accessibility**

   * Onboarding to first result ≤ **2 minutes** for a typical user.
   * Clear empty states and inline validation.
3. **Performance**

   * P50 search latency ≤ **300 ms**, P95 ≤ **800 ms** for 1k profiles; pagination supported.
   * Image uploads ≤ **5 MB**, processed asynchronously.
4. **Reliability**

   * Staging uptime ≥ **99%** during business hours; error budget documented.
   * Recoverable failures: retries with exponential backoff for email & storage.
5. **Scalability (pilot)**

   * Support **5k** users and **100 concurrent** active sessions without degradation.

---

## 5) External Requirements

* **Robust to reasonable errors:** Input validation across all forms (tags count, bio length, allowed contact fields). Friendly error messages; retries for transient failures.
* **Installable/Accessible:** Provide a **public staging URL** for the web (read‑only browse) and a **TestFlight/Expo link** for mobile. Document setup and `.env` variables.
* **Buildable from source:** One‑command local bootstrap using Docker Compose (Postgres + API + web + mailhog). `make dev` spins up everything; seed script loads sample profiles.
* **New‑dev onboarding:** `/docs/CONTRIBUTING.md` with architecture overview, runbooks, and style guide.
* **Right‑sized scope:** MVP limited to verification, profiles, search, and request flow.

---

## 6) Team Process Description

### Toolset (and rationale)

* **Languages:** TypeScript (shared types client/server), SQL (Postgres).
* **Mobile:** React Native (Expo).
* **Backend:** Node.js + Express (monolith for MVP), Prisma ORM, Zod for schema validation.
* **DB:** Postgres (Dockerized locally; managed on staging).
* **Auth/Email:** Magic links via SendGrid (or Mailgun) with domain restriction to `uw.edu`.
* **CI/CD:** GitHub Actions (lint, typecheck, unit/integration tests, Prisma migrate).
* **Infra:** Docker Compose for dev; Render/Railway/Fly.io for staging (choose one); object storage for images (e.g., Cloudflare R2).
* **Design:** Figma for wireframes and component library.
* **Tracking:** GitHub Issues and GitHub Projects (Kanban), milestones per week.

### Roles & justification


### Branching & quality gates

* Feature‑based development with short‑lived feature branches.
* PRs require 1 reviewer + green CI (lint/type).
* Conventional Commits; auto‑changelog; code owners for sensitive paths.

### Week‑by‑week schedule (measurable milestones)

> 10‑week plan; adjust dates to course calendar. Each item is **demo‑able**.


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

* **End of W3:** Onboarding/verification UX test with 5 UW students; capture time‑to‑verify.
* **End of W5:** Discovery/search test (task‑based); measure success rate/latency.
* **End of W7:** Request/accept flow test; clarity & perceived safety.
* **Channels:** Short intercept surveys + in‑person pilots at IMA/Library; opt‑in only.

### Definition of Done (per feature)

* Meets acceptance criteria; unit/integration tests pass; accessibility check; telemetry added; updated docs; feature flag default ON in staging.

---
