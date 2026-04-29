import { nanoid } from 'nanoid';
import type { Preference, PreferenceSlot } from './types.js';

export type PreferenceWithSlots = {
	preference: Preference;
	slots: PreferenceSlot[];
};

export async function getPreferenceForResident(
	db: D1Database,
	allocationId: string,
	residentId: string
): Promise<PreferenceWithSlots | null> {
	const preference = await db
		.prepare('SELECT * FROM preferences WHERE allocation_id = ? AND resident_id = ?')
		.bind(allocationId, residentId)
		.first<Preference>();

	if (!preference) return null;

	const { results: slots } = await db
		.prepare('SELECT * FROM preference_slots WHERE preference_id = ? ORDER BY rank')
		.bind(preference.id)
		.all<PreferenceSlot>();

	return { preference, slots };
}

export async function getAllPreferencesForAllocation(db: D1Database, allocationId: string): Promise<PreferenceWithSlots[]> {
	const { results: prefs } = await db
		.prepare('SELECT * FROM preferences WHERE allocation_id = ?')
		.bind(allocationId)
		.all<Preference>();

	if (prefs.length === 0) return [];

	const { results: allSlots } = await db
		.prepare(
			`SELECT ps.* FROM preference_slots ps
       JOIN preferences p ON p.id = ps.preference_id
       WHERE p.allocation_id = ?
       ORDER BY ps.preference_id, ps.rank`
		)
		.bind(allocationId)
		.all<PreferenceSlot>();

	const slotsByPref = new Map<string, PreferenceSlot[]>();
	for (const s of allSlots) {
		const list = slotsByPref.get(s.preference_id) ?? [];
		list.push(s);
		slotsByPref.set(s.preference_id, list);
	}

	return prefs.map((p: Preference) => ({ preference: p, slots: slotsByPref.get(p.id) ?? [] }));
}

export async function replacePreferences(
	db: D1Database,
	allocationId: string,
	residentId: string,
	slotsRequested: number,
	orderedSlotIds: string[]
): Promise<void> {
	const existing = await db
		.prepare('SELECT id FROM preferences WHERE allocation_id = ? AND resident_id = ?')
		.bind(allocationId, residentId)
		.first<{ id: string }>();

	const prefId = existing?.id ?? nanoid();
	const now = new Date().toISOString();

	const stmts = [];

	if (existing) {
		stmts.push(db.prepare('DELETE FROM preference_slots WHERE preference_id = ?').bind(prefId));
		stmts.push(
			db
				.prepare('UPDATE preferences SET slots_requested = ?, submitted_at = ? WHERE id = ?')
				.bind(slotsRequested, now, prefId)
		);
	} else {
		stmts.push(
			db
				.prepare('INSERT INTO preferences (id, allocation_id, resident_id, slots_requested, submitted_at) VALUES (?, ?, ?, ?, ?)')
				.bind(prefId, allocationId, residentId, slotsRequested, now)
		);
	}

	for (let i = 0; i < orderedSlotIds.length; i++) {
		stmts.push(
			db
				.prepare('INSERT INTO preference_slots (preference_id, slot_id, rank) VALUES (?, ?, ?)')
				.bind(prefId, orderedSlotIds[i], i + 1)
		);
	}

	for (let i = 0; i < stmts.length; i += 100) {
		await db.batch(stmts.slice(i, i + 100));
	}
}
