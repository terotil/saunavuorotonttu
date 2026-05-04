---
id: TASK-006
title: Admin resident priority reordering helpers
status: To Do
assignee: []
created_date: '2026-05-04 19:01'
labels:
  - ready-for-agent
dependencies: []
references:
  - src/lib/db/residentPriorities.ts
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
When admin reorders resident priorities, two bulk operations should be available:

**a) Copy ordering from a previous allocation**
Admin can select a past allocation and have the resident priority order copied from it, as a starting point for the current ordering.

**b) Rotate N residents from front to back**
Admin can specify a number N, and the first N residents in the current order are moved to the end of the list while preserving their relative order within the group. Useful for rotating turns between allocations.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Admin can select a previous allocation and import its resident ordering as the current priority order
- [ ] #2 Admin can enter a number N and bulk-move the first N residents to the end of the list
- [ ] #3 Within-group order is preserved when rotating (first N keep their relative order at the back)
- [ ] #4 Both operations are accessible from the resident priority reordering UI
- [ ] #5 Changes are not saved until admin explicitly confirms/saves
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Tests pass
- [ ] #2 Documentation up to date
- [ ] #3 No known vulnerabilities in dependencies
<!-- DOD:END -->
