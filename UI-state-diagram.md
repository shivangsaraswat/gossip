Gossip – Main Chat Screen
UI State Diagram (Authoritative)
This diagram defines how the UI behaves based on data and app state, not visuals.
1. Entry Point State (After Auth)
[App Launch]
      ↓
[Auth State Resolved]
      ↓
[User is ACTIVE]
      ↓
[Chat List Screen]
No alternative landing paths.
No intermediate screens.
2. High-Level UI State Flow
Chat List Screen
│
├── Loading
│
├── Empty Chats
│
├── Chats (No Stories)
│
└── Chats (With Stories)
Only one state can be active at a time.
3. State Definitions (Exact)
3.1 Loading State
[Loading]
When
Initial screen mount
Data request in progress
App resume from background
UI Behavior
Show loading skeletons
Header + bottom tab visible
No empty illustration
No chat list rendered
Exit Conditions
Data resolved → evaluate next state
3.2 Empty Chats State
[Empty Chats]
Condition
chats.length === 0
UI Elements
Header
Search bar
Filter chips
Empty illustration (group image)
Message text
"+ Explore" CTA
Bottom navigation
Actions
Tap "+ Explore" → Navigate to Explore Users
Tap bottom tabs → Normal navigation
Must NOT show
Story row
Chat list
3.3 Chats Without Stories
[Chats Present] AND [stories.length === 0 OR storiesHidden === true]
UI Elements
Header
Search bar
Filter chips
“All Chats” header
Chat list
Bottom navigation
Story Row
Completely hidden
Transitions
3-dot menu → toggle stories → go to Chats With Stories (if available)
3.4 Chats With Stories
[Chats Present] AND [stories.length > 0] AND [storiesHidden === false]
UI Elements
Header
Search bar
Story row (horizontal)
Filter chips
“All Chats” header
Chat list
Bottom navigation
Story Row Behavior
Scrollable horizontally
First item = Add Story
Uses asset images only
4. Story Visibility Toggle Logic
This is the key UI control shown in screen 14 vs 15.
[3-dot Menu Clicked]
        ↓
Toggle storiesHidden
        ↓
Re-render Chat List Screen
Logic Rule
if (stories.length === 0) {
  storiesHidden = true
}
No stories → no row → no toggle effect.
5. Filter Chips State (UI-Only for Now)
[All] | [Unread Chats] | [Group Chats] | [+]
State
activeFilter = 'all' | 'unread' | 'groups'
Rules
Only visual state changes
No filtering logic applied yet
Counts must be data-driven
6. Navigation State (Persistent)
Bottom tab bar is always present.
Chats (active)
Communities
Calls
Profile
Switching tabs:
Preserves chat state
Does NOT reset story visibility
Does NOT refetch unless needed
7. Error / Edge States (Must Be Safe)
Partial Data
Chats loaded but user data missing → render safely
Stories loaded but chats empty → empty state still wins
Backend Failure
Show empty state, not crash
Keep Explore CTA visible
8. Simplified ASCII Diagram (Shareable)
           ┌─────────────┐
           │   Loading   │
           └──────┬──────┘
                  ↓
        ┌──────────────────┐
        │ Chats length = 0 │
        └──────┬───────────┘
               ↓
        ┌──────────────────┐
        │   Empty Chats    │
        └──────────────────┘

Chats length > 0
        ↓
┌──────────────────────────┐
│ Stories length > 0 ?     │
└──────────┬───────────────┘
           │Yes                        No
           ↓                          ↓
┌──────────────────┐        ┌──────────────────┐
│ Chats + Stories  │        │ Chats Only       │
└──────────────────┘        └──────────────────┘
9. Golden Rule (Must Follow)
UI state is derived from data, not from screen type.
No screen-level hacks.
No visual inference.
10. What This Diagram Enables
Clean implementation
No UI bugs
Easy future messaging integration
Predictable behavior
This diagram should be implemented before writing UI code, not after.