import { fail, redirect } from '@sveltejs/kit';
import { updateAllocationStatus, updateAllocationWarnings } from '$lib/db/index.js';
import { getSlotsForAllocation } from '$lib/db/slots.js';
import { getResidentPriorities } from '$lib/db/residentPriorities.js';
import { getAllPreferencesForAllocation } from '$lib/db/preferences.js';
import { getLockedReservations } from '$lib/db/locked.js';
import { writeAssignments } from '$lib/db/assignments.js';
import { runOptimization } from '$lib/allocation/optimize.js';

export const actions = {
	open: async ({ params, platform }) => {
		await updateAllocationStatus(platform!.env.DB, params.id, 'open');
		return { success: true };
	},

	close: async ({ params, platform }) => {
		await updateAllocationStatus(platform!.env.DB, params.id, 'closed');
		return { success: true };
	},

	optimize: async ({ params, platform }) => {
		const db = platform!.env.DB;
		const allocationId = params.id;

		const [slots, residentsWithPriority, allPrefs, locked] = await Promise.all([
			getSlotsForAllocation(db, allocationId),
			getResidentPriorities(db, allocationId),
			getAllPreferencesForAllocation(db, allocationId),
			getLockedReservations(db, allocationId)
		]);

		const residents = residentsWithPriority.map((rp) => ({
			id: rp.resident_id,
			apartment: rp.apartment,
			priority: rp.rank
		}));

		const preferences = allPrefs.map(({ preference, slots: prefSlots }) => ({
			resident_id: preference.resident_id,
			slots_requested: preference.slots_requested,
			ranked_slot_ids: prefSlots.map((s) => s.slot_id)
		}));

		const lockedInput = locked.map((l) => ({
			slot_id: l.slot_id,
			resident_id: l.resident_id
		}));

		const { assignments, warnings } = runOptimization(slots, residents, preferences, lockedInput);

		await writeAssignments(db, allocationId, assignments);
		await updateAllocationWarnings(db, allocationId, warnings);
		await updateAllocationStatus(db, allocationId, 'optimized');

		throw redirect(302, `/admin/allocations/${allocationId}/results`);
	},

	publish: async ({ params, platform }) => {
		await updateAllocationStatus(platform!.env.DB, params.id, 'published');
		return { success: true };
	},

	reopen: async ({ params, platform }) => {
		await updateAllocationStatus(platform!.env.DB, params.id, 'closed');
		return { success: true };
	}
};
