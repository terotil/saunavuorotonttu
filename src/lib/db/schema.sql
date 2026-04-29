CREATE TABLE residents (
  id TEXT PRIMARY KEY,
  apartment TEXT NOT NULL UNIQUE,
  name TEXT
);

-- Twice-yearly allocation period
CREATE TABLE allocations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft | open | closed | optimized | published
  created_at TEXT NOT NULL,
  warnings TEXT -- JSON-encoded array of warning strings from optimizer
);

-- Per-allocation priority ranking of residents (1 = highest priority)
CREATE TABLE resident_priority (
  id TEXT PRIMARY KEY,
  allocation_id TEXT NOT NULL REFERENCES allocations(id),
  resident_id TEXT NOT NULL REFERENCES residents(id),
  rank INTEGER NOT NULL,
  UNIQUE(allocation_id, resident_id)
);

-- A recurring weekly slot: day-of-week + time (no specific dates — it's a rotation)
-- day_of_week: 1=Mon … 7=Sun
CREATE TABLE slots (
  id TEXT PRIMARY KEY,
  allocation_id TEXT NOT NULL REFERENCES allocations(id),
  day_of_week INTEGER NOT NULL,
  start_time TEXT NOT NULL, -- HH:MM
  end_time TEXT NOT NULL,   -- HH:MM
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Admin pre-assigns slot to resident (bypasses optimization for that slot)
CREATE TABLE locked_reservations (
  id TEXT PRIMARY KEY,
  allocation_id TEXT NOT NULL REFERENCES allocations(id),
  slot_id TEXT NOT NULL REFERENCES slots(id),
  resident_id TEXT NOT NULL REFERENCES residents(id),
  UNIQUE(allocation_id, slot_id)
);

-- Resident's preference submission for an allocation
CREATE TABLE preferences (
  id TEXT PRIMARY KEY,
  allocation_id TEXT NOT NULL REFERENCES allocations(id),
  resident_id TEXT NOT NULL REFERENCES residents(id),
  slots_requested INTEGER NOT NULL DEFAULT 1, -- 1 or 2
  submitted_at TEXT NOT NULL,
  UNIQUE(allocation_id, resident_id)
);

-- Individual slot entries in a preference list (ordered by rank)
CREATE TABLE preference_slots (
  preference_id TEXT NOT NULL REFERENCES preferences(id),
  slot_id TEXT NOT NULL REFERENCES slots(id),
  rank INTEGER NOT NULL, -- 1 = most preferred
  PRIMARY KEY (preference_id, slot_id)
);

-- Final optimizer output; wiped and rewritten on each optimize run
CREATE TABLE assignments (
  id TEXT PRIMARY KEY,
  allocation_id TEXT NOT NULL REFERENCES allocations(id),
  slot_id TEXT NOT NULL REFERENCES slots(id),
  resident_id TEXT NOT NULL REFERENCES residents(id),
  is_locked INTEGER NOT NULL DEFAULT 0,
  UNIQUE(allocation_id, slot_id)
);

CREATE INDEX idx_resident_priority_allocation ON resident_priority(allocation_id);
CREATE INDEX idx_slots_allocation ON slots(allocation_id);
CREATE INDEX idx_preferences_allocation ON preferences(allocation_id);
CREATE INDEX idx_preference_slots_preference ON preference_slots(preference_id);
CREATE INDEX idx_assignments_allocation ON assignments(allocation_id);
CREATE INDEX idx_locked_allocation ON locked_reservations(allocation_id);
