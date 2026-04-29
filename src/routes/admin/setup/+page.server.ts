import { fail } from '@sveltejs/kit';
import { getAllResidents, createResident, updateResident, deleteResident } from '$lib/db/index.js';
import { syncResidentToAllAllocations } from '$lib/db/residentPriorities.js';

export async function load({ platform }) {
	const residents = await getAllResidents(platform!.env.DB);
	return { residents };
}

export const actions = {
	add: async ({ request, platform }) => {
		const data = await request.formData();
		const apartment = (data.get('apartment') as string)?.trim().toLowerCase();
		const name = (data.get('name') as string)?.trim() || null;

		if (!apartment) return fail(400, { addError: 'Huoneiston numero vaaditaan' });

		const id = await createResident(platform!.env.DB, apartment, name);
		await syncResidentToAllAllocations(platform!.env.DB, id);

		return { success: true };
	},

	edit: async ({ request, platform }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		const apartment = (data.get('apartment') as string)?.trim().toLowerCase();
		const name = (data.get('name') as string)?.trim() || null;

		if (!id || !apartment) return fail(400, { editError: 'Virheelliset tiedot' });

		await updateResident(platform!.env.DB, id, apartment, name);
		return { success: true };
	},

	delete: async ({ request, platform }) => {
		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) return fail(400, { deleteError: 'Tunniste puuttuu' });

		await deleteResident(platform!.env.DB, id);
		return { success: true };
	}
};
