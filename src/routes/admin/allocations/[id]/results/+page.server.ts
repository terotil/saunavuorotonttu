import { getAssignmentsForAllocation } from '$lib/db/assignments.js';

export async function load({ parent, platform }) {
	const { allocation } = await parent();
	const assignments = await getAssignmentsForAllocation(platform!.env.DB, allocation.id);
	const warnings: string[] = allocation.warnings ? JSON.parse(allocation.warnings) : [];
	return { assignments, warnings };
}
