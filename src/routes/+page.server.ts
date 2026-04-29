import { fail, redirect } from '@sveltejs/kit';
import { getResidentByApartment } from '$lib/db/index.js';

export const actions = {
	default: async ({ request, cookies, platform }) => {
		const data = await request.formData();
		const apartment = (data.get('apartment') as string)?.trim().toLowerCase();

		if (!apartment) return fail(400, { error: 'Syötä huoneiston numero' });

		const resident = await getResidentByApartment(platform!.env.DB, apartment);
		if (!resident) return fail(400, { error: 'Huoneistoa ei löydy. Tarkista numero.' });

		cookies.set('resident_id', resident.id, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});

		throw redirect(302, '/preferences');
	}
};
