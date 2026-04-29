import { fail } from '@sveltejs/kit';
import { getLockedReservations, addLockedReservation, removeLockedReservation } from '$lib/db/index.js';
import { getSlotsForAllocation } from '$lib/db/slots.js';
import { getResidentPriorities } from '$lib/db/residentPriorities.js';

export async function load({ parent, platform }) {
	const { allocation } = await parent();
	const [locked, slots, residents] = await Promise.all([
		getLockedReservations(platform!.env.DB, allocation.id),
		getSlotsForAllocation(platform!.env.DB, allocation.id),
		getResidentPriorities(platform!.env.DB, allocation.id)
	]);
	return { locked, slots, residents };
}

export const actions = {
	add: async ({ request, params, platform }) => {
		const data = await request.formData();
		const slotId = data.get('slot_id') as string;
		const residentId = data.get('resident_id') as string;

		if (!slotId || !residentId) return fail(400, { addError: 'Vuoro ja asukas vaaditaan' });

		await addLockedReservation(platform!.env.DB, params.id, slotId, residentId);
		return { success: true };
	},

	remove: async ({ request, platform }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		if (!id) return fail(400, { removeError: 'Tunniste puuttuu' });

		await removeLockedReservation(platform!.env.DB, id);
		return { success: true };
	}
};
