---
id: TASK-004
title: Add free-text comment to preference submission
status: To Do
assignee: []
created_date: '2026-05-02 08:09'
labels:
  - ux
dependencies: []
references:
  - src/lib/db/schema.sql
  - src/lib/db/preferences.ts
  - 'src/routes/preferences/[key]/+page.svelte'
  - 'src/routes/admin/allocations/[id]/residents/+page.svelte'
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Resident can leave optional free-text comment when submitting preference. Admin sees comment in allocation resident list.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Preference form has optional free-text comment field
- [ ] #2 Comment saved to `preferences.comment` column (nullable TEXT)
- [ ] #3 Admin allocation residents page shows comment alongside apartment row
- [ ] #4 Comment visible in read-only preference view (TASK-003)
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Tests pass
- [ ] #2 Documentation up to date
- [ ] #3 No known vulnerabilities in dependencies
<!-- DOD:END -->
