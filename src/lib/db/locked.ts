import { nanoid } from 'nanoid';
import type { LockedReservation } from './types.js';

export type LockedReservationWithInfo = LockedReservation & {
	apartment: string;
	day_of_week: number;
	start_time: string;
	end_time: string;
};

export async function getLockedReservations(db: D1Database, allocationId: string): Promise<LockedReservationWithInfo[]> {
	const { results } = await db
		.prepare(
			`SELECT lr.*, r.apartment, s.day_of_week, s.start_time, s.end_time
       FROM locked_reservations lr
       JOIN residents r ON lr.resident_id = r.id
       JOIN slots s ON lr.slot_id = s.id
       WHERE lr.allocation_id = ?
       ORDER BY s.day_of_week, s.start_time`
		)
		.bind(allocationId)
		.all<LockedReservationWithInfo>();
	return results;
}

export async function addLockedReservation(db: D1Database, allocationId: string, slotId: string, residentId: string): Promise<void> {
	await db
		.prepare('INSERT OR REPLACE INTO locked_reservations (id, allocation_id, slot_id, resident_id) VALUES (?, ?, ?, ?)')
		.bind(nanoid(), allocationId, slotId, residentId)
		.run();
}

export async function removeLockedReservation(db: D1Database, id: string): Promise<void> {
	await db.prepare('DELETE FROM locked_reservations WHERE id = ?').bind(id).run();
}
