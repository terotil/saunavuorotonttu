import { nanoid } from 'nanoid';
import type { Slot } from './types.js';

export async function getSlotsForAllocation(db: D1Database, allocationId: string): Promise<Slot[]> {
	const { results } = await db
		.prepare('SELECT * FROM slots WHERE allocation_id = ? ORDER BY day_of_week, start_time, display_order')
		.bind(allocationId)
		.all<Slot>();
	return results;
}

export async function createSlot(
	db: D1Database,
	allocationId: string,
	dayOfWeek: number,
	startTime: string,
	endTime: string
): Promise<string> {
	const id = nanoid();
	const maxOrder = await db
		.prepare('SELECT MAX(display_order) as max_order FROM slots WHERE allocation_id = ?')
		.bind(allocationId)
		.first<{ max_order: number | null }>();
	const displayOrder = (maxOrder?.max_order ?? 0) + 1;

	await db
		.prepare('INSERT INTO slots (id, allocation_id, day_of_week, start_time, end_time, display_order) VALUES (?, ?, ?, ?, ?, ?)')
		.bind(id, allocationId, dayOfWeek, startTime, endTime, displayOrder)
		.run();
	return id;
}

export async function deleteSlot(db: D1Database, id: string): Promise<void> {
	await db.prepare('DELETE FROM slots WHERE id = ?').bind(id).run();
}
