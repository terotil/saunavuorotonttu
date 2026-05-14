import { error, fail } from '@sveltejs/kit';
import { getResidentById, getAllocationById, getSlotsForAllocation, getAssignmentsForResident } from '$lib/db/index.js';
import { getPreferenceByKey, replacePreferences } from '$lib/db/preferences.js';

export async function load({ params, cookies, platform }) {
	const { key } = params;

	const existing = await getPreferenceByKey(platform!.env.DB, key);
	if (!existing) throw error(404, 'Toiveita ei löydy');

	const allocation = await getAllocationById(platform!.env.DB, existing.preference.allocation_id);
	if (!allocation) throw error(404, 'Toiveita ei löydy');

	const resident = await getResidentById(platform!.env.DB, existing.preference.resident_id);
	if (!resident) throw error(404, 'Toiveita ei löydy');

	const slots = await getSlotsForAllocation(platform!.env.DB, allocation.id);

	const readOnly = allocation.status !== 'open';
	const assignments = readOnly
		? await getAssignmentsForResident(platform!.env.DB, allocation.id, existing.preference.resident_id)
		: [];

	cookies.set('preference_key', key, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 * 30
	});

	return { resident, allocation, slots, existing, readOnly, assignments };
}

export const actions = {
	save: async ({ request, params, platform }) => {
		const { key } = params;

		const existing = await getPreferenceByKey(platform!.env.DB, key);
		if (!existing) throw error(404, 'Toiveita ei löydy');

		const allocation = await getAllocationById(platform!.env.DB, existing.preference.allocation_id);
		if (!allocation || allocation.status !== 'open') {
			return fail(400, { error: 'Ei avointa varausjaksoa' });
		}

		const data = await request.formData();
		const slotsRequested = Math.min(2, Math.max(1, parseInt(data.get('slots_requested') as string) || 1));
		const slotIds = data.getAll('slot_ids') as string[];

		if (slotIds.length === 0) return fail(400, { error: 'Valitse vähintään yksi sopiva vuoro' });

		await replacePreferences(
			platform!.env.DB,
			allocation.id,
			existing.preference.resident_id,
			slotsRequested,
			slotIds
		);

		return { saved: true };
	}
};
