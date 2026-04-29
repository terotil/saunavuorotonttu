import { fail, redirect } from '@sveltejs/kit';
import { signSession } from '$lib/auth/admin.js';

export const actions = {
	default: async ({ request, cookies, platform }) => {
		const data = await request.formData();
		const password = data.get('password') as string;

		if (!password || password !== platform!.env.ADMIN_PASSWORD) {
			return fail(401, { error: 'Väärä salasana' });
		}

		const token = await signSession(platform!.env.ADMIN_SECRET);
		cookies.set('admin_session', token, {
			path: '/admin',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 8
		});

		throw redirect(302, '/admin');
	}
};
