Below is a ready-to-use document for your “New Connect / Recent Search” backend.
You can paste this directly into Claude Opus 4.5.
📄 BACKEND IMPLEMENTATION DOCUMENT
Feature: New Connect – Search & Recent Searches
Version: v1
Target: Claude Opus 4.5
Layer: Backend only (no UI)
1. Context
This project is a chat-based social application.
The backend serves web and mobile clients.
This document describes the backend logic for the “New Connect” screen, triggered when the user taps the + button in the chat interface.
2. Objective
Implement backend support for:
Searching users by username
Storing recent searches per user
Fetching recent searches
Deleting recent search entries
This must work consistently across web, Android, and iOS.
3. Scope (INCLUDED)
PostgreSQL schema
REST APIs
Business logic
Validation
Security checks
4. Out of Scope (EXCLUDED)
UI implementation
Push notifications
Admin moderation
Group creation logic
Community logic
5. Assumptions
User authentication already exists
JWT middleware provides req.user.id
Database is PostgreSQL
ORM can be Prisma or Drizzle
Express.js is used
6. System Overview
Clients call REST APIs over HTTPS.
Backend is the single source of truth.
All recent-search data is user-scoped.
7. Data Models
users
id (uuid, PK)
username (unique)
profile_image
bio
recent_searches
id (uuid, PK)
user_id (FK → users.id)
searched_user_id (FK → users.id)
created_at (timestamp)

unique(user_id, searched_user_id)
8. API Contracts
8.1 Search Users
GET /api/users/search?q=<string>
Rules:
Minimum 2 characters
Case-insensitive
Limit 10 results
Exclude requesting user
8.2 Save Recent Search
POST /api/recent-searches
Body:
{
  "searchedUserId": "uuid"
}
Behavior:
Upsert
Update timestamp if exists
Keep max 10 entries per user
8.3 Get Recent Searches
GET /api/recent-searches
Returns:
List ordered by most recent
Joined with user info
8.4 Delete Recent Search
DELETE /api/recent-searches/:searchedUserId
Behavior:
Deletes only requester’s record
Idempotent
9. Business Logic Rules
Recent search saved only on profile click
Typing in search does NOT save
Oldest entries removed beyond limit
One recent entry per searched user
10. Edge Cases
Searching inactive users → excluded
Deleted users → auto removed via cascade
Duplicate clicks → timestamp update only
11. Security Rules
User can access only their own recent searches
Cannot delete others’ data
Validate UUID inputs
12. Non-Goals
No ranking algorithm
No global recommendations
No admin override
13. Acceptance Criteria
APIs work without UI
Pagination not required
Results consistent across clients
No duplicate recent searches
Max 10 entries enforced