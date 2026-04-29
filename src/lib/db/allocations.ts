import { nanoid } from 'nanoid';
import type { Allocation } from './types.js';

export async function getAllAllocations(db: D1Database): Promise<Allocation[]> {
	const { results } = await db
		.prepare('SELECT * FROM allocations ORDER BY created_at DESC')
		.all<Allocation>();
	return results;
}

export async function getAllocationById(db: D1Database, id: string): Promise<Allocation | null> {
	return db.prepare('SELECT * FROM allocations WHERE id = ?').bind(id).first<Allocation>();
}

export async function getActiveAllocation(db: D1Database): Promise<Allocation | null> {
	return db.prepare("SELECT * FROM allocations WHERE status = 'open' LIMIT 1").first<Allocation>();
}

export async function getPublishedAllocation(db: D1Database): Promise<Allocation | null> {
	return db
		.prepare("SELECT * FROM allocations WHERE status = 'published' ORDER BY created_at DESC LIMIT 1")
		.first<Allocation>();
}

export async function createAllocation(db: D1Database, name: string): Promise<string> {
	const id = nanoid();
	await db
		.prepare('INSERT INTO allocations (id, name, status, created_at) VALUES (?, ?, ?, ?)')
		.bind(id, name, 'draft', new Date().toISOString())
		.run();
	return id;
}

export async function updateAllocationStatus(db: D1Database, id: string, status: Allocation['status']): Promise<void> {
	await db.prepare('UPDATE allocations SET status = ? WHERE id = ?').bind(status, id).run();
}

export async function updateAllocationWarnings(db: D1Database, id: string, warnings: string[]): Promise<void> {
	await db
		.prepare('UPDATE allocations SET warnings = ? WHERE id = ?')
		.bind(JSON.stringify(warnings), id)
		.run();
}
