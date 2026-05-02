---
id: TASK-003
title: Show preference read-only with assignment after allocation closes
status: To Do
assignee: []
created_date: '2026-05-02 08:07'
labels:
  - ux
dependencies: []
references:
  - 'src/routes/preferences/[key]/+page.server.ts'
  - 'src/routes/preferences/[key]/+page.svelte'
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Visiting `/preferences/[key]` after allocation closes returns 404. Should instead show submitted preference in read-only mode with: closed allocation notice, which slot(s) the apartment was assigned.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Valid preference key on closed/optimized/published allocation shows preference read-only (no save button, no slot reordering)
- [ ] #2 Page shows notice that allocation is closed and preferences can no longer be changed
- [ ] #3 Page shows which slot(s) the apartment was assigned in this allocation (or notice if none assigned)
- [ ] #4 Invalid key still returns 404
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Tests pass
- [ ] #2 Documentation up to date
- [ ] #3 No known vulnerabilities in dependencies
<!-- DOD:END -->
