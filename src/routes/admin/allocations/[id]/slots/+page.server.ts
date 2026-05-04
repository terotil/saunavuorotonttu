import { error, fail } from '@sveltejs/kit';
import {
	getSlotsForAllocation,
	createSlot,
	deleteSlot,
	createSlotsBulk,
	getAllAllocations,
	getAllocationById
} from '$lib/db/index.js';
import { STATUS_LABELS } from '$lib/utils';

export async function load({ parent, platform }) {
	const { allocation } = await parent();
	const db = platform!.env.DB;
	const slots = await getSlotsForAllocation(db, allocation.id);
	const otherAllocations = (await getAllAllocations(db)).filter((x) => x.id !== allocation.id);
	return { slots, otherAllocations };
}

function canEditSlots(status: string) {
	return status === 'draft' || status === 'open';
}

async function loadEditable(db: D1Database, id: string) {
	const allocation = await getAllocationById(db, id);
	if (!allocation) throw error(404, 'Varausjaksoa ei löydy');
	return allocation;
}

function addMinutes(time: string, minutes: number): string {
	const [h, m] = time.split(':').map(Number);
	const total = h * 60 + m + minutes;
	if (total < 0 || total >= 24 * 60) return '';
	const hh = Math.floor(total / 60).toString().padStart(2, '0');
	const mm = (total % 60).toString().padStart(2, '0');
	return `${hh}:${mm}`;
}

export const actions = {
	add: async ({ request, params, platform }) => {
		const allocation = await loadEditable(platform!.env.DB, params.id!);
		if (!canEditSlots(allocation.status)) return fail(403, { addError: `Tämä varausjakso on ${STATUS_LABELS[allocation.status].toLowerCase()}. Vuoroja ei voi muokata.` });

		const data = await request.formData();
		const dayOfWeek = parseInt(data.get('day_of_week') as string);
		const startTime = (data.get('start_time') as string)?.trim();
		const endTime = (data.get('end_time') as string)?.trim();

		if (!dayOfWeek || dayOfWeek < 1 || dayOfWeek > 7)
			return fail(400, { addError: 'Valitse viikonpäivä' });
		if (!startTime || !endTime) return fail(400, { addError: 'Alku- ja loppuaika vaaditaan' });
		if (startTime >= endTime)
			return fail(400, { addError: 'Loppuajan on oltava alkuajan jälkeen' });

		await createSlot(platform!.env.DB, params.id, dayOfWeek, startTime, endTime);
		return { success: true };
	},

	remove: async ({ request, params, platform }) => {
		const allocation = await loadEditable(platform!.env.DB, params.id!);
		if (!canEditSlots(allocation.status)) return fail(403, { removeError: `Tämä varausjakso on ${STATUS_LABELS[allocation.status].toLowerCase()}. Vuoroja ei voi muokata.` });

		const data = await request.formData();
		const id = data.get('id') as string;
		if (!id) return fail(400, { removeError: 'Vuoron tunniste puuttuu' });

		await deleteSlot(platform!.env.DB, id);
		return { success: true };
	},

	copy: async ({ request, params, platform }) => {
		const allocation = await loadEditable(platform!.env.DB, params.id!);
		if (!canEditSlots(allocation.status)) return fail(403, { copyError: `Tämä varausjakso on ${STATUS_LABELS[allocation.status].toLowerCase()}. Vuoroja ei voi muokata.` });

		const data = await request.formData();
		const sourceId = (data.get('source_id') as string)?.trim();
		if (!sourceId) return fail(400, { copyError: 'Valitse lähdevarausjakso' });
		if (sourceId === params.id) return fail(400, { copyError: 'Lähdettä ei voi olla sama varausjakso' });

		const db = platform!.env.DB;
		const sourceSlots = await getSlotsForAllocation(db, sourceId);
		if (sourceSlots.length === 0) return fail(400, { copyError: 'Lähdejaksossa ei ole vuoroja' });

		const count = await createSlotsBulk(
			db,
			params.id,
			sourceSlots.map((s) => ({
				dayOfWeek: s.day_of_week,
				startTime: s.start_time,
				endTime: s.end_time
			}))
		);
		return { copySuccess: `Kopioitu ${count} vuoroa` };
	},

	generate: async ({ request, params, platform }) => {
		const allocation = await loadEditable(platform!.env.DB, params.id!);
		if (!canEditSlots(allocation.status))
			return fail(403, { generateError: `Tämä varausjakso on ${STATUS_LABELS[allocation.status].toLowerCase()}. Vuoroja ei voi muokata.` });

		const data = await request.formData();
		const dayOfWeek = parseInt(data.get('day_of_week') as string);
		const startTime = (data.get('start_time') as string)?.trim();
		const lengthMin = parseInt(data.get('length_minutes') as string);
		const count = parseInt(data.get('count') as string);

		if (!dayOfWeek || dayOfWeek < 1 || dayOfWeek > 7)
			return fail(400, { generateError: 'Valitse viikonpäivä' });
		if (!startTime || !/^\d{2}:\d{2}$/.test(startTime))
			return fail(400, { generateError: 'Anna alkuaika muodossa HH:MM' });
		if (!Number.isFinite(lengthMin) || lengthMin <= 0)
			return fail(400, { generateError: 'Vuoron kesto minuutteina vaaditaan' });
		if (!Number.isFinite(count) || count <= 0 || count > 100)
			return fail(400, { generateError: 'Anna määrä välillä 1–100' });

		const slots: Array<{ dayOfWeek: number; startTime: string; endTime: string }> = [];
		let current = startTime;
		for (let i = 0; i < count; i++) {
			const next = addMinutes(current, lengthMin);
			if (!next) return fail(400, { generateError: 'Vuorot menisivät yli vuorokauden' });
			slots.push({ dayOfWeek, startTime: current, endTime: next });
			current = next;
		}

		const created = await createSlotsBulk(platform!.env.DB, params.id, slots);
		return { generateSuccess: `Luotu ${created} vuoroa` };
	}
};
