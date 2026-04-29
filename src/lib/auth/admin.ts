const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

export async function signSession(secret: string): Promise<string> {
	const ts = Date.now().toString();
	const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
	const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ts));
	const sigHex = Array.from(new Uint8Array(sig))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
	return `${ts}.${sigHex}`;
}

export async function verifySession(cookie: string | null | undefined, secret: string): Promise<boolean> {
	if (!cookie) return false;
	const dotIndex = cookie.indexOf('.');
	if (dotIndex === -1) return false;
	const ts = cookie.slice(0, dotIndex);
	const sigHex = cookie.slice(dotIndex + 1);
	if (!ts || !sigHex) return false;

	const timestamp = parseInt(ts, 10);
	if (isNaN(timestamp) || Date.now() - timestamp > SESSION_TTL_MS) return false;

	try {
		const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
		const sigBytes = Uint8Array.from((sigHex.match(/.{2}/g) ?? []).map((b) => parseInt(b, 16)));
		return await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(ts));
	} catch {
		return false;
	}
}
