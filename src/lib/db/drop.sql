DROP INDEX IF EXISTS idx_resident_priority_allocation;
DROP INDEX IF EXISTS idx_slots_allocation;
DROP INDEX IF EXISTS idx_preferences_allocation;
DROP INDEX IF EXISTS idx_preference_slots_preference;
DROP INDEX IF EXISTS idx_assignments_allocation;
DROP INDEX IF EXISTS idx_locked_allocation;

DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS preference_slots;
DROP TABLE IF EXISTS preferences;
DROP TABLE IF EXISTS locked_reservations;
DROP TABLE IF EXISTS slots;
DROP TABLE IF EXISTS resident_priority;
DROP TABLE IF EXISTS allocations;
DROP TABLE IF EXISTS residents;
