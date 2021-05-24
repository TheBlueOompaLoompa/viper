import vfetch from '$lib/vfetch';

export async function fetchImage(post, images) {
	if (post['type'] == 1 && !images[post['id']]) {
		images[post['id']] = await vfetch.fetchImage(post);
	}

	return images;
}

export async function cacheUsername(post, usernameCache) {
	if (!Object.keys(usernameCache)[post['uid']]) {
		usernameCache[post['uid']] = await vfetch.getUsernameFromPost(post);
	}

	return usernameCache;
}

export async function fetchPosts(start, end, group) {
	var posts;

	if (group) {
		posts = await vfetch.groupPosts(start, end, group);
	} else {
		posts = await vfetch.posts(start, end);
	}

	return posts;
}
