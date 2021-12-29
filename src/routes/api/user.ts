import database from '$lib/db';

const db = new database('mongodb://localhost:27017');

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ query }) {
	const uid = query.get('uid');
	console.log(uid);
	
	return {
		body: {
			user: await db.getUser(uid)
		}
	}
}

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function patch({ query }) {
	const uid = query.get('uid');
	
	return {
		body: {
			user: await db.getUser(uid)
		}
	}
}

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
 export async function post({ query }) {
	const uid = query.get('uid');
	const username = query.get('username');
	const display = query.get('display');
	
	const code = await db.createUser(uid, username, display);

	return {
		body: code
	}
}