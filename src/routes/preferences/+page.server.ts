import { fail, redirect } from '@sveltejs/kit';
import { getResidentById, getActiveAllocation, getSlotsForAllocation } from '$lib/db/index.js';
import { getPreferenceForResident, replacePreferences } from '$lib/db/preferences.js';

export async function load({ cookies, platform }) {
	const residentId = cookies.get('resident_id');
	if (!residentId) throw redirect(302, '/');

	const resident = await getResidentById(platform!.env.DB, residentId);
	if (!resident) {
		cookies.delete('resident_id', { path: '/' });
		throw redirect(302, '/');
	}

	const allocation = await getActiveAllocation(platform!.env.DB);
	if (!allocation) {
		return { resident, allocation: null, slots: [], existing: null };
	}

	const [slots, existing] = await Promise.all([
		getSlotsForAllocation(platform!.env.DB, allocation.id),
		getPreferenceForResident(platform!.env.DB, allocation.id, residentId)
	]);

	return { resident, allocation, slots, existing };
}

export const actions = {
	save: async ({ request, cookies, platform }) => {
		const residentId = cookies.get('resident_id');
		if (!residentId) throw redirect(302, '/');

		const allocation = await getActiveAllocation(platform!.env.DB);
		if (!allocation) return fail(400, { error: 'Ei avointa varauskautta' });

		const data = await request.formData();
		const slotsRequested = Math.min(2, Math.max(1, parseInt(data.get('slots_requested') as string) || 1));
		const slotIds = data.getAll('slot_ids') as string[];

		if (slotIds.length === 0) return fail(400, { error: 'Valitse vähintään yksi sopiva vuoro' });

		await replacePreferences(platform!.env.DB, allocation.id, residentId, slotsRequested, slotIds);

		return { saved: true };
	}
};
