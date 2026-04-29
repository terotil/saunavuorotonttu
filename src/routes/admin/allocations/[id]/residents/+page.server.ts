import { fail } from '@sveltejs/kit';
import { getResidentPriorities, reorderResidentPriorities } from '$lib/db/residentPriorities.js';

export async function load({ parent, platform }) {
	const { allocation } = await parent();
	const residents = await getResidentPriorities(platform!.env.DB, allocation.id);
	return { residents };
}

export const actions = {
	reorder: async ({ request, params, platform }) => {
		const data = await request.formData();
		const residentIds = data.getAll('resident_ids') as string[];

		if (residentIds.length === 0) return fail(400, { reorderError: 'Asukkaat puuttuvat' });

		await reorderResidentPriorities(platform!.env.DB, params.id, residentIds);
		return { success: true };
	}
};
