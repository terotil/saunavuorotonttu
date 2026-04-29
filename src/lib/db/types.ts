export interface Resident {
	id: string;
	apartment: string;
	name: string | null;
}

export interface Allocation {
	id: string;
	name: string;
	status: 'draft' | 'open' | 'closed' | 'optimized' | 'published';
	created_at: string;
	warnings: string | null; // JSON-encoded string[]
}

export interface ResidentPriority {
	id: string;
	allocation_id: string;
	resident_id: string;
	rank: number;
}

export interface Slot {
	id: string;
	allocation_id: string;
	day_of_week: number; // 1=Mon, 7=Sun
	start_time: string; // HH:MM
	end_time: string; // HH:MM
	display_order: number;
}

export interface LockedReservation {
	id: string;
	allocation_id: string;
	slot_id: string;
	resident_id: string;
}

export interface Preference {
	id: string;
	allocation_id: string;
	resident_id: string;
	slots_requested: number;
	submitted_at: string;
}

export interface PreferenceSlot {
	preference_id: string;
	slot_id: string;
	rank: number;
}

export interface Assignment {
	id: string;
	allocation_id: string;
	slot_id: string;
	resident_id: string;
	is_locked: number; // 0 or 1 (SQLite boolean)
}
