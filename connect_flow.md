1️⃣ CONNECTION FLOW — FUNCTIONAL SKELETON (MOST IMPORTANT)
This feature is driven by relationship state between:
viewer (current user)
profileOwner (searched username)
Relationship states (single source of truth)
relationshipStatus ∈ {
  "none",        // no connection, no request
  "requested",   // viewer sent request
  "incoming",    // viewer received request
  "connected"    // mutual connection
}
Each UI screen is just a rendering of this state.
Screen mapping by state
State	Screen
none	Screen 23
requested	Screen 24
connected	Screen 25
No UI guessing. No condition chaos.
2️⃣ UI INSTRUCTIONS — PIXEL PERFECT (ALL 3 SCREENS)
COMMON STRUCTURE (ALL SCREENS)
Screen container
Full height
Background: light gradient (as in Figma)
Safe area respected
Scroll enabled
Header
Left: Back arrow
Center: Username + verified badge (if applicable)
Right: 3-dot menu
Height: 56px
No shadow
🟦 SCREEN 23 — NOT CONNECTED (Initial state)
Condition
relationshipStatus === "none"
Profile section
Centered circular avatar
Size: 96px
Blue ring border
Username (bold)
Bio (1–2 lines, muted)
Action buttons row
Button 1: Connect
Primary blue
Text: Connect
Enabled
On press → send request
Button 2: Message
Outline style
Text: Message
Disabled
Opacity reduced
No navigation
Rules
No calls
No controls
No media section
🟦 SCREEN 24 — REQUEST SENT
Condition
relationshipStatus === "requested"
Profile section
(Same as Screen 23)
Action buttons row
Button 1: Requested
Disabled
Muted blue / gray
Text: Requested
No action
Button 2: Message
Disabled
Outline style
Rules
User cannot resend
UI must clearly show waiting state
No call options
🟦 SCREEN 25 — CONNECTED (Mutual)
Condition
relationshipStatus === "connected"
Profile section
Same avatar + name
Bio
Optional phone number (if allowed)
Action buttons row
Button 1: Connected
Solid blue
Disabled
Text: Connected
Button 2: Message
Primary outline
Navigates to chat screen
Button 3: Audio
Icon button
Enabled
Button 4: Video
Icon button
Enabled
Media section
Title: Media, Links, and docs
Horizontal scroll thumbnails
Count on right (45 >)
Clickable (future)
Control section
List items:
Notifications
Media visibility
Disappearing messages
Each row:
Icon
Label
Chevron
Danger zone
Divider
Block user (red)
Report user (red)
3️⃣ BACKEND BLUEPRINT — ANTIGRAVITY / CLAUDE READY
This is logic only, matching the UI states above.
3.1 Database tables
connections
id
requester_id
receiver_id
status ENUM('pending','accepted')
created_at
Reject = DELETE row
No rejected state by design
3.2 API — Get profile relationship
GET /api/profile/:userId/relationship
Response
{
  "relationshipStatus": "none | requested | incoming | connected"
}
This API drives the entire UI.
3.3 API — Send connection request
POST /api/connections/request
Logic
Create row with pending
requester → viewer
receiver → profileOwner
3.4 API — Accept request
POST /api/connections/:id/accept
Logic
Only receiver can accept
Update status → accepted
Enable messaging & calls
3.5 API — Reject request
POST /api/connections/:id/reject
Logic
DELETE connection row
Allows future re-request
3.6 Permissions matrix (important)
Feature	none	requested	connected
Message	❌	❌	✅
Audio	❌	❌	✅
Video	❌	❌	✅
Media	❌	❌	✅
Controls	❌	❌	✅
3.7 UI-Backend contract (critical)
UI must never infer state.
It must always read relationshipStatus.
This prevents:
Race conditions
UI desync
Incorrect button states

✅ FINAL CONFIRMATION
✔ All 3 screens defined
✔ Pixel-perfect rules
✔ Backend logic aligned
✔ Future-proof (calls, media, controls)Call
✔ No hacks, no shortcuts