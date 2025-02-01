import { auth } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	// Redirect to login if no session exists
	if (!session) {
		throw redirect(307, '/auth');
	}

	// Return session data to the client
	return { session };
};
