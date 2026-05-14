import { nanoid } from 'nanoid';
import type { Assignment } from './types.js';

export type AssignmentWithInfo = Assignment & {
	apartment: string;
	day_of_week: number;
	start_time: string;
	end_time: string;
};

export async function writeAssignments(
	db: D1Database,
	allocationId: string,
	assignments: Array<{ slot_id: string; resident_id: string; is_locked: boolean }>
): Promise<void> {
	const insertStmts = assignments.map((a) =>
		db
			.prepare('INSERT INTO assignments (id, allocation_id, slot_id, resident_id, is_locked) VALUES (?, ?, ?, ?, ?)')
			.bind(nanoid(), allocationId, a.slot_id, a.resident_id, a.is_locked ? 1 : 0)
	);

	const deleteStmt = db.prepare('DELETE FROM assignments WHERE allocation_id = ?').bind(allocationId);

	if (insertStmts.length === 0) {
		await db.batch([deleteStmt]);
		return;
	}

	// First batch: delete + first 99 inserts (100 total, within D1 limit)
	await db.batch([deleteStmt, ...insertStmts.slice(0, 99)]);

	// Remaining inserts in batches of 100
	for (let i = 99; i < insertStmts.length; i += 100) {
		await db.batch(insertStmts.slice(i, i + 100));
	}
}

export async function getAssignmentsForResident(
	db: D1Database,
	allocationId: string,
	residentId: string
): Promise<AssignmentWithInfo[]> {
	const { results } = await db
		.prepare(
			`SELECT a.*, r.apartment, s.day_of_week, s.start_time, s.end_time
       FROM assignments a
       JOIN residents r ON a.resident_id = r.id
       JOIN slots s ON a.slot_id = s.id
       WHERE a.allocation_id = ? AND a.resident_id = ?
       ORDER BY s.day_of_week, s.start_time`
		)
		.bind(allocationId, residentId)
		.all<AssignmentWithInfo>();
	return results;
}

export async function getAssignmentsForAllocation(db: D1Database, allocationId: string): Promise<AssignmentWithInfo[]> {
	const { results } = await db
		.prepare(
			`SELECT a.*, r.apartment, s.day_of_week, s.start_time, s.end_time
       FROM assignments a
       JOIN residents r ON a.resident_id = r.id
       JOIN slots s ON a.slot_id = s.id
       WHERE a.allocation_id = ?
       ORDER BY s.day_of_week, s.start_time`
		)
		.bind(allocationId)
		.all<AssignmentWithInfo>();
	return results;
}
