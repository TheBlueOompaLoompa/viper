import vfetch from '$lib/vfetch';
import type post from './post';

export async function fetchImage(
	post: post,
	images: Record<string, string>
): Promise<Record<string, unknown>> {
	if (post['type'] == 1 && !images[post['id']]) {
		images[post['id']] = await vfetch.fetchImage(post);
	}

	return images;
}

export async function cacheUsername(
	post: post,
	usernameCache: Record<string, string>
): Promise<Record<string, unknown>> {
	if (!Object.keys(usernameCache)[post['uid']]) {
		usernameCache[post['uid']] = await vfetch.getUsernameFromPost(post);
	}

	return usernameCache;
}

export async function fetchPosts(start: number, end: number, group?: string): Promise<post[]> {
	let posts: post[];

	if (group) {
		posts = await vfetch.groupPosts(start, end, group);
	} else {
		posts = await vfetch.posts(start, end);
	}

	return posts;
}
