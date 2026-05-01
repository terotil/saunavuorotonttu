import { fail, redirect } from '@sveltejs/kit';
import { getAllResidents, getActiveAllocation } from '$lib/db/index.js';
import { getPreferenceByKey, getPreferenceForResident, createEmptyPreference } from '$lib/db/preferences.js';

export async function load({ cookies, platform }) {
	const allocation = await getActiveAllocation(platform!.env.DB);

	// If cookie key is valid for the active allocation, redirect directly to preference page
	const cookieKey = cookies.get('preference_key');
	if (cookieKey && allocation) {
		const existing = await getPreferenceByKey(platform!.env.DB, cookieKey);
		if (existing && existing.preference.allocation_id === allocation.id) {
			throw redirect(302, `/preferences/${cookieKey}`);
		}
	}

	const residents = await getAllResidents(platform!.env.DB);
	return { residents, allocation };
}

export const actions = {
	default: async ({ request, cookies, platform }) => {
		const data = await request.formData();
		const residentId = (data.get('resident_id') as string)?.trim();

		const adminEmail = platform!.env.ADMIN_EMAIL ?? '';

		if (!residentId) return fail(400, { error: 'Valitse huoneisto', adminEmail });

		const allocation = await getActiveAllocation(platform!.env.DB);
		if (!allocation || allocation.status !== 'open') {
			return fail(400, { error: 'Toiveiden syöttö ei ole tällä hetkellä auki', adminEmail });
		}

		const existing = await getPreferenceForResident(platform!.env.DB, allocation.id, residentId);
		if (existing) {
			return fail(400, { error: 'already_exists', adminEmail });
		}

		const accessKey = await createEmptyPreference(platform!.env.DB, allocation.id, residentId);

		cookies.set('preference_key', accessKey, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 30
		});

		throw redirect(302, `/preferences/${accessKey}`);
	}
};
