import { nanoid } from 'nanoid';
import type { ResidentPriority } from './types.js';

export type ResidentPriorityWithInfo = ResidentPriority & {
	apartment: string;
	name: string | null;
	has_preferences: number; // 0 or 1
	preference_access_key: string | null;
};

export async function getResidentPriorities(db: D1Database, allocationId: string): Promise<ResidentPriorityWithInfo[]> {
	const { results } = await db
		.prepare(
			`SELECT rp.*, r.apartment, r.name,
        CASE WHEN p.id IS NOT NULL THEN 1 ELSE 0 END as has_preferences,
        p.access_key as preference_access_key
      FROM resident_priority rp
      JOIN residents r ON rp.resident_id = r.id
      LEFT JOIN preferences p ON p.resident_id = rp.resident_id AND p.allocation_id = rp.allocation_id
      WHERE rp.allocation_id = ?
      ORDER BY rp.rank`
		)
		.bind(allocationId)
		.all<ResidentPriorityWithInfo>();
	return results;
}

export async function initResidentPriorities(db: D1Database, allocationId: string): Promise<void> {
	const { results } = await db
		.prepare('SELECT id FROM residents ORDER BY apartment')
		.all<{ id: string }>();

	if (results.length === 0) return;

	const stmts = results.map((r: { id: string }, i: number) =>
		db
			.prepare('INSERT OR IGNORE INTO resident_priority (id, allocation_id, resident_id, rank) VALUES (?, ?, ?, ?)')
			.bind(nanoid(), allocationId, r.id, i + 1)
	);

	for (let i = 0; i < stmts.length; i += 100) {
		await db.batch(stmts.slice(i, i + 100));
	}
}

export async function reorderResidentPriorities(db: D1Database, allocationId: string, orderedResidentIds: string[]): Promise<void> {
	if (orderedResidentIds.length === 0) return;

	// Delete all and re-insert with new ranks (avoids UNIQUE constraint conflicts)
	const deleteStmt = db.prepare('DELETE FROM resident_priority WHERE allocation_id = ?').bind(allocationId);
	const insertStmts = orderedResidentIds.map((residentId, i) =>
		db
			.prepare('INSERT INTO resident_priority (id, allocation_id, resident_id, rank) VALUES (?, ?, ?, ?)')
			.bind(nanoid(), allocationId, residentId, i + 1)
	);

	await db.batch([deleteStmt, ...insertStmts.slice(0, 99)]);
	for (let i = 99; i < insertStmts.length; i += 100) {
		await db.batch(insertStmts.slice(i, i + 100));
	}
}

export async function syncResidentToAllAllocations(db: D1Database, residentId: string): Promise<void> {
	// When a new resident is added, append them to the bottom of priority list for all non-published allocations
	const { results: allocations } = await db
		.prepare("SELECT id FROM allocations WHERE status != 'published'")
		.all<{ id: string }>();

	if (allocations.length === 0) return;

	const stmts = await Promise.all(
		allocations.map(async (a: { id: string }) => {
			const maxRank = await db
				.prepare('SELECT MAX(rank) as max_rank FROM resident_priority WHERE allocation_id = ?')
				.bind(a.id)
				.first<{ max_rank: number | null }>();
			const nextRank = (maxRank?.max_rank ?? 0) + 1;
			return db
				.prepare('INSERT OR IGNORE INTO resident_priority (id, allocation_id, resident_id, rank) VALUES (?, ?, ?, ?)')
				.bind(nanoid(), a.id, residentId, nextRank);
		})
	);

	if (stmts.length > 0) {
		await db.batch(stmts);
	}
}
