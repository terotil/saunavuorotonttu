import { error } from '@sveltejs/kit';
import { getAllocationById } from '$lib/db/index.js';

export async function load({ params, platform }) {
	const allocation = await getAllocationById(platform!.env.DB, params.id);
	if (!allocation) throw error(404, 'Varauskausi ei löydy');
	return { allocation };
}
