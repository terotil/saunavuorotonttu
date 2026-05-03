---
id: TASK-005
title: Add bulk slot entry modes to allocation slot editor
status: Done
assignee: []
created_date: '2026-05-02 08:12'
labels:
  - ux
  - admin
dependencies: []
references:
  - 'src/routes/admin/allocations/[id]/slots/+page.svelte'
  - 'src/routes/admin/allocations/[id]/slots/+page.server.ts'
  - src/lib/db/slots.ts
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Admin slot entry currently requires adding slots one by one. Add two additional input modes:

1. **Copy from previous allocation** — select an existing allocation and import all its slots into the current one.
2. **Generate consecutive slots** — enter day, start time, slot length (minutes), and count; creates N back-to-back slots automatically.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Admin can select a previous allocation and copy all its slots into the current allocation
- [x] #2 Admin can enter day + start time + slot length (minutes) + count and generate N consecutive slots
- [x] #3 Generated/copied slots appear in the slot list and can be edited or deleted individually
- [x] #4 Both modes only available while allocation is in draft or open status
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Tests pass
- [ ] #2 Documentation up to date
- [ ] #3 No known vulnerabilities in dependencies
<!-- DOD:END -->
