# Saunavuorotonttu

A web app for managing recurring weekly sauna slot rotation in a Finnish apartment building. Residents submit slot preferences twice a year; an admin runs optimization to publish the new rotation.

## Language

**Apartment (Huoneisto)**:
The stable identity unit in the building — the slot assignee. Person living there is irrelevant.
_Avoid_: Resident, tenant, user (when referring to an apartment as a domain entity)

**Slot (Vuoro)**:
A recurring weekly sauna time defined by day-of-week + start/end time. No specific dates — it repeats every week for the duration of the active rotation.
_Avoid_: Booking, reservation, time slot (when referring to the recurring weekly definition)

**Allocation (Varausjakso)**:
One scheduling round (e.g. "Spring 2026"): defines slots, collects preferences, runs optimization, publishes assignments. Only one allocation is active at a time; publishing a new one fully replaces the previous rotation.
_Avoid_: Period, round, season, cycle

**Preference (Saunavuorotoiveet)**:
An apartment's ranked wish list of slots for a given allocation, plus how many slots they want (1 or 2). Submitted by the apartment occupant during the open phase.
_Avoid_: Request, vote, wish

**Priority (Varausjärjestys)**:
An admin-assigned per-allocation rank (1 = highest) that determines tie-breaking order during optimization. Reflects fairness across rounds — manually adjusted by admin each allocation.
_Avoid_: Seniority, weight

**Locked Reservation (Lukitut varaukset)**:
An admin-imposed hard assignment of a slot to an apartment, applied before optimization runs and never overridden by it. Typically used for accessibility needs.
_Avoid_: Override, forced assignment, manual assignment

**Assignment (Saunavuorolista)**:
The optimizer output: which apartment gets which slot for an allocation. Locked reservations appear in assignments with `is_locked = true`.
_Avoid_: Booking, result

**Optimization (Optimointi)**:
The algorithm that assigns slots to apartments based on priority order and preferences. Runs in two passes: first slot (mandatory), second slot (if requested). Never assigns outside an apartment's preference list.
_Avoid_: Scheduling, allocation (when referring to the algorithm run specifically)

## Relationships

- An **Allocation** contains many **Slots** and collects one **Preference** per **Apartment**
- An **Apartment** may have at most one **Preference** per **Allocation** (requesting 1 or 2 slots)
- A **Locked Reservation** belongs to one **Allocation** and pre-assigns one **Slot** to one **Apartment**
- **Optimization** produces **Assignments** — one **Slot** maps to at most one **Apartment**
- Unassigned **Slots** after optimization are valid output; they remain available for informal first-come-first-served use by new residents
- An **Apartment** with a **Locked Reservation** is assigned that slot regardless of whether they submitted **Preferences**
- Maximum 2 **Assignments** per **Apartment** per **Allocation**

## Example dialogue

> **Dev:** "Can an **apartment** get two **slots** without submitting **preferences**?"
> **Admin:** "Only if both are **locked reservations** — which never happens in practice. Normally a **lock** covers one slot and the apartment submits **preferences** only if they want a second."

> **Dev:** "What if no apartment wants a slot?"
> **Admin:** "It stays unassigned. New move-ins can use it informally until the next **allocation**."

## Flagged ambiguities

- "resident" used in code/DB for what is semantically an **Apartment** — the `residents` table and associated code should be renamed to `apartments`. Tracked as a future refactor.
- "allocation" used both for the scheduling round (domain term) and the algorithm run — prefer **Allocation** for the round, **Optimization** for the algorithm.
