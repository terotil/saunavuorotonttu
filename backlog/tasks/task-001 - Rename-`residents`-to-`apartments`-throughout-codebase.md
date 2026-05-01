---
id: TASK-001
title: Rename `residents` to `apartments` throughout codebase
status: To Do
assignee: []
created_date: '2026-05-01 19:57'
labels:
  - refactor
dependencies: []
references:
  - CONTEXT.md
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The `residents` table and all related code uses "resident" as the domain entity, but the true identity is the apartment unit — the occupying person is irrelevant. Rename to `apartments` to align with CONTEXT.md terminology.

Scope:
- DB schema: rename `residents` table, `resident_priority` table, `resident_id` columns
- All `src/lib/db/` files: `residents.ts`, `residentPriorities.ts`, types, re-exports
- Optimizer: `ResidentInput`, `residentSlots`, `prefByResident`, etc.
- All routes referencing resident-related queries/types
- Remove nullable `name` field from apartments (person name is not a domain concept)
<!-- SECTION:DESCRIPTION:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Tests pass
- [ ] #2 Documentation up to date
- [ ] #3 No known vulnerabilities in dependencies
<!-- DOD:END -->
