import { fail } from '@sveltejs/kit';
import { getSlotsForAllocation, createSlot, deleteSlot } from '$lib/db/index.js';

export async function load({ parent, platform }) {
	const { allocation } = await parent();
	const slots = await getSlotsForAllocation(platform!.env.DB, allocation.id);
	return { slots };
}

export const actions = {
	add: async ({ request, params, platform }) => {
		const data = await request.formData();
		const dayOfWeek = parseInt(data.get('day_of_week') as string);
		const startTime = (data.get('start_time') as string)?.trim();
		const endTime = (data.get('end_time') as string)?.trim();

		if (!dayOfWeek || dayOfWeek < 1 || dayOfWeek > 7) return fail(400, { addError: 'Valitse viikonpäivä' });
		if (!startTime || !endTime) return fail(400, { addError: 'Aloitus- ja lopetusaika vaaditaan' });
		if (startTime >= endTime) return fail(400, { addError: 'Lopetusajan on oltava aloitusajan jälkeen' });

		await createSlot(platform!.env.DB, params.id, dayOfWeek, startTime, endTime);
		return { success: true };
	},

	remove: async ({ request, platform }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		if (!id) return fail(400, { removeError: 'Tunniste puuttuu' });

		await deleteSlot(platform!.env.DB, id);
		return { success: true };
	}
};
