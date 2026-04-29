import { fail, redirect } from '@sveltejs/kit';
import { getAllAllocations, createAllocation } from '$lib/db/index.js';
import { initResidentPriorities } from '$lib/db/residentPriorities.js';

export async function load({ platform }) {
	const allocations = await getAllAllocations(platform!.env.DB);
	return { allocations };
}

export const actions = {
	create: async ({ request, platform }) => {
		const data = await request.formData();
		const name = (data.get('name') as string)?.trim();
		if (!name) return fail(400, { createError: 'Nimi vaaditaan' });

		const id = await createAllocation(platform!.env.DB, name);
		await initResidentPriorities(platform!.env.DB, id);

		throw redirect(302, `/admin/allocations/${id}`);
	}
};
