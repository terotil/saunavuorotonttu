import { error, fail } from '@sveltejs/kit';
import { getResidentById, getActiveAllocation, getSlotsForAllocation } from '$lib/db/index.js';
import { getPreferenceByKey, replacePreferences } from '$lib/db/preferences.js';

export async function load({ params, cookies, platform }) {
	const { key } = params;

	const existing = await getPreferenceByKey(platform!.env.DB, key);
	if (!existing) throw error(404, 'Toiveita ei löydy');

	const allocation = await getActiveAllocation(platform!.env.DB);
	if (!allocation || existing.preference.allocation_id !== allocation.id) {
		throw error(404, 'Toiveita ei löydy');
	}

	const resident = await getResidentById(platform!.env.DB, existing.preference.resident_id);
	if (!resident) throw error(404, 'Toiveita ei löydy');

	const slots = await getSlotsForAllocation(platform!.env.DB, allocation.id);

	cookies.set('preference_key', key, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 * 30
	});

	return { resident, allocation, slots, existing };
}

export const actions = {
	save: async ({ request, params, platform }) => {
		const { key } = params;

		const existing = await getPreferenceByKey(platform!.env.DB, key);
		if (!existing) throw error(404, 'Toiveita ei löydy');

		const allocation = await getActiveAllocation(platform!.env.DB);
		if (!allocation || existing.preference.allocation_id !== allocation.id) {
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
