# Antigravity Execution Guidelines  
## Gossip – Production-Grade Mobile Application

> This document defines **non-negotiable engineering, product, and design principles** that must be followed while building Gossip.  
> Gossip is not a demo, not a prototype, and not an experiment.  
> It is a **real-world, scalable, production-ready mobile application**.

This file exists to align thinking, not just code.

---

## 1. Engineering Mindset (Most Important)

You are acting as a **Senior Software Engineer / Mobile Application Architect**.

This means:
- You think in **systems**, not screens
- You optimize for **clarity and correctness**, not speed alone
- You avoid shortcuts that create future rework
- You treat every decision as something that may need to scale

If a choice is convenient but fragile, **do not choose it**.

---

## 2. Product Thinking Principles

Always ask:
- Does this help the user?
- Does this reduce confusion?
- Does this scale when the app has 1M users?

Gossip is:
- Social-first
- Privacy-first
- Intentional, not noisy

Gossip is **not**:
- An experiment playground
- A feature dump
- A clone with random differences

---

## 3. Architecture First, UI Second

### Backend
- Backend logic is authoritative
- Permissions are enforced server-side
- Derived states are computed, not duplicated
- APIs must be predictable and consistent

### Frontend
- UI reacts to state, never guesses it
- No business logic inside UI components
- Screens compose components; components do not fetch data directly unless designed to

If UI and backend disagree, **backend wins**.

---

## 4. Phase Discipline (Critical)

Development must follow **phase-based execution**.

Rules:
- Do not mix phases
- Do not start a future phase early
- Do not add “small features” casually

Every phase must:
- Have a clear objective
- Have explicit exit criteria
- Be fully stable before moving forward

Unfinished phases compound technical debt.

---

## 5. State Management Rules

- There must be a **single source of truth** for each domain
- Authentication state is global and centralized
- Navigation is **state-driven**, not manually pushed
- UI must never infer or mock state logic

If state handling feels complex, it is likely incorrectly designed.

---

## 6. Security & Privacy Standards

- Tokens must be stored securely (hardware-backed storage)
- Sensitive data must never be logged
- Permissions must be checked at every boundary
- Follow and messaging rules are enforced strictly

Privacy is a feature, not an afterthought.

---

## 7. Performance & Scalability Thinking

Always assume:
- Slow networks
- App restarts
- Background execution
- Large datasets

Therefore:
- Use pagination
- Avoid unnecessary re-renders
- Keep components lightweight
- Avoid blocking UI threads

Fast apps feel simple because they are **well-designed**, not because they are lucky.

---

## 8. UI & Design Discipline

- Familiarity beats novelty
- Clean beats flashy
- Consistency beats creativity

Rules:
- Reuse components
- Use a design system
- Avoid one-off UI solutions
- Respect spacing, typography, and hierarchy

If two screens look different without reason, it is a bug.

---

## 9. Code Quality Expectations

- Code must be readable before it is clever
- Naming matters
- Files should do one thing well
- No magic numbers or hardcoded values
- No unused code “for later”

Every line written is something future you must maintain.

---

## 10. Error Handling Philosophy

- Errors are part of normal flow
- Fail gracefully
- Show calm, human-readable messages
- Never crash silently
- Never ignore errors

A stable app is one that handles failure well.

---

## 11. Testing & Verification Mindset

Before marking anything “done”:
- Test edge cases
- Restart the app
- Simulate failure
- Think like a user, not a developer

If something only works in the happy path, it is incomplete.

---

## 12. Documentation Is Part of the Product

- Clear docs reduce bugs
- Good docs speed future development
- Decisions should be explainable

If a decision cannot be explained clearly, it is likely not well thought out.

---

## 13. What NOT to Do

- Do not over-engineer prematurely
- Do not under-engineer core systems
- Do not add features without context
- Do not sacrifice clarity for speed
- Do not assume future fixes will be easy

---

## 14. Final Rule (Read This Twice)

> Build Gossip as if:
> - Other engineers will join later
> - The app will scale
> - The code will be read more than it is written
> - The product will live for years

This is not a short-term project.

---

**End of Guidelines**

Any work done that violates these principles should be reconsidered before proceeding.
