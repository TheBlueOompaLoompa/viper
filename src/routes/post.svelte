<script lang="ts">
	import Post from '../components/Post.svelte';
	import Loading from '../components/Loading.svelte';

	import vfetch from '$lib/vfetch';
	import { onMount } from 'svelte';

	let images = {};

	let usernameCache = {};

	let loading = true;

	let post;

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

	onMount(async () => {
		post = await vfetch.post(decodeURI(window.location.href.split('?p=')[1]));

		fetchImage(post);
		cacheUsername(post);

		loading = false;
	});
</script>

<Loading fullscreen={true} {loading} />
<container>
	{#if post}
		<Post {post} cache={usernameCache} img={images[post['id']]} />
	{/if}
</container>

<style>
	container {
		display: flex;
		justify-content: center;

		padding-top: 20px;
		width: 100%;
	}
</style>
