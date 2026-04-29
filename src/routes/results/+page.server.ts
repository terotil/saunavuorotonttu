import { getPublishedAllocation } from '$lib/db/index.js';
import { getAssignmentsForAllocation } from '$lib/db/assignments.js';

export async function load({ platform }) {
	const allocation = await getPublishedAllocation(platform!.env.DB);
	if (!allocation) return { allocation: null, byDay: [] as never[] };

	const assignments = await getAssignmentsForAllocation(platform!.env.DB, allocation.id);

	const days = [1, 2, 3, 4, 5, 6, 7];
	const byDay = days
		.map((d) => ({
			day: d,
			slots: assignments.filter((s) => s.day_of_week === d).sort((a, b) => a.start_time.localeCompare(b.start_time))
		}))
		.filter((g) => g.slots.length > 0);

	return { allocation, byDay };
}
