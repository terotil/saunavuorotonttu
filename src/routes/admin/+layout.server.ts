import { redirect } from '@sveltejs/kit';
import { verifySession } from '$lib/auth/admin.js';

export async function load({ cookies, platform, url }) {
	if (url.pathname === '/admin/login') return {};

	const cookie = cookies.get('admin_session');
	const valid = await verifySession(cookie, platform!.env.ADMIN_SECRET);
	if (!valid) throw redirect(302, '/admin/login');

	return {};
}
