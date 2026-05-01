---
id: TASK-002
title: Secure preference access with per-preference secret key
status: To Do
assignee: []
created_date: '2026-05-01 20:47'
updated_date: '2026-05-01 20:49'
labels:
  - security
  - ux
dependencies: []
references:
  - src/lib/db/schema.sql
  - src/routes/preferences/+page.server.ts
  - src/routes/+page.server.ts
  - CONTEXT.md
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Currently any resident can view/edit any apartment's preferences by entering that apartment number — there is no authentication. Fix: assign a random hard-to-guess secret key to each preference when first created for an allocation, and gate access to show/edit behind that key.

## Desired behaviour

- When a preference is first created for an allocation, generate a cryptographically random key and store it on the preference record (new column: `access_key`)
- The preference edit/view URL becomes `/preferences/[key]` (or similar) — knowing the URL is sufficient to access
- Cookie behaviour: after first access the key is stored in a cookie so returning to `/preferences` still works without re-entering the URL — but only if the cookie key matches a valid preference for the active allocation
- If no cookie / no matching key → show apartment selection (dropdown, see below) to look up or start a preference; entering an apartment number that already has a preference does NOT grant access — only the key does
- Resident selection UI: change from free-text input to a dropdown of known apartments

## Scope

- Add `access_key TEXT NOT NULL` column to `preferences` table (schema migration)
- Generate key on preference creation (`crypto.randomUUID()` or similar)
- New route structure: `/preferences/[key]` for show/edit
- `/preferences` (root): apartment dropdown → if apartment has no preference yet, creates one and redirects to `/preferences/[key]`; if it already has one, shows "contact admin" or similar (key not disclosed)
- Cookie stores key (not apartment/resident id) for the current allocation
- Remove `resident_id` cookie from preference flow
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Accessing /preferences/[key] with a valid key shows and allows editing that apartment's preference
- [ ] #2 Accessing /preferences/[key] with an unknown key returns 404
- [ ] #3 Returning visitor with key in cookie is taken directly to their preference view
- [ ] #4 Apartment selection on entry is a dropdown of known apartments, not free text
- [ ] #5 Entering an apartment that already has a preference does not expose that preference without the key. It justs asks for the key and directs to contact ADMIN_EMAIL (from env variable) if key is lost.
- [ ] #6 access_key is generated at preference creation time and never changes
- [ ] #7 Admin can view and copy the unique preference URL for any apartment from the allocation residents page
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Tests pass
- [ ] #2 Documentation up to date
- [ ] #3 No known vulnerabilities in dependencies
<!-- DOD:END -->
