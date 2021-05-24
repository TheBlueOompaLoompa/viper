import vfetch from '$lib/vfetch';

export let images = {};

export let usernameCache = {};

export let posts = [];

export let loading = true;

export const postFetchCount = 5;

export let greatestPost = postFetchCount - 1;
let scrollLoadDisabled = false;

async function fetchImage(post) {
	if (post['type'] == 1 && !images[post['id']]) {
		images[post['id']] = await vfetch.fetchImage(post);
	}
}

async function cacheUsername(post) {
	if (!Object.keys(usernameCache)[post['uid']]) {
		usernameCache[post['uid']] = await vfetch.getUsernameFromPost(post);
	}
}

export async function fetchPosts() {
	if (window.location.href.includes('?g=')) {
		const group = decodeURI(window.location.href.split('?g=')[1]);
		posts = await vfetch.groupPosts(0, postFetchCount - 1, group);
	} else {
		posts = await vfetch.posts(0, postFetchCount - 1);
	}

	for (var i = 0; i < posts.length; i++) {
		await fetchImage(posts[i]);
		await cacheUsername(posts[i]);
	}

	window.onscroll = async function () {
		const scrollLoadPad = 200;

		if (
			window.innerHeight + window.scrollY + scrollLoadPad >= document.body.scrollHeight &&
			!scrollLoadDisabled
		) {
			scrollLoadDisabled = true;

			if (window.location.href.includes('?g=')) {
				const group = decodeURI(window.location.href.split('?g=')[1]);
				posts = [
					...posts,
					...(await vfetch.groupPosts(greatestPost + 1, greatestPost + postFetchCount, group))
				];
			} else {
				posts = [
					...posts,
					...(await vfetch.posts(greatestPost + 1, greatestPost + postFetchCount))
				];
			}

			greatestPost += postFetchCount;

			scrollLoadDisabled = false;
		}
	};

	loading = false;
	return { posts, usernameCache, images };
}
