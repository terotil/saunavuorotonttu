import { nanoid } from 'nanoid';
import type { Resident } from './types.js';

export async function getAllResidents(db: D1Database): Promise<Resident[]> {
	const { results } = await db
		.prepare('SELECT * FROM residents ORDER BY apartment')
		.all<Resident>();
	return results;
}

export async function getResidentByApartment(db: D1Database, apartment: string): Promise<Resident | null> {
	return db.prepare('SELECT * FROM residents WHERE apartment = ?').bind(apartment).first<Resident>();
}

export async function getResidentById(db: D1Database, id: string): Promise<Resident | null> {
	return db.prepare('SELECT * FROM residents WHERE id = ?').bind(id).first<Resident>();
}

export async function createResident(db: D1Database, apartment: string, name: string | null): Promise<string> {
	const id = nanoid();
	await db
		.prepare('INSERT INTO residents (id, apartment, name) VALUES (?, ?, ?)')
		.bind(id, apartment, name)
		.run();
	return id;
}

export async function updateResident(db: D1Database, id: string, apartment: string, name: string | null): Promise<void> {
	await db
		.prepare('UPDATE residents SET apartment = ?, name = ? WHERE id = ?')
		.bind(apartment, name, id)
		.run();
}

export async function deleteResident(db: D1Database, id: string): Promise<void> {
	await db.prepare('DELETE FROM residents WHERE id = ?').bind(id).run();
}
