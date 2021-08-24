import db from '$lib/db';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ query }) {
	console.log(query.get('uid'));
	
	return {
		body: {

		}
	}
}