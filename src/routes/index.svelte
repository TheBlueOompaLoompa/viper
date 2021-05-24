<script lang="typescript">
	export const ssr = false;

	import Loading from '../components/Loading.svelte';
	import Posts from '../components/Posts.svelte';

	import { onMount } from 'svelte';
	import vfetch from '$lib/vfetch';
	import { fetchPosts, fetchImage, cacheUsername } from '$lib/postfetch';

	let page = '';
	
	let posts = [];
	let images = {};
	let usernameCache = {};

	const postFetchCount = 5;

	async function go(isScroll) {
		if(!isScroll){
			posts = await fetchPosts(0, postFetchCount - 1);
		}else {
			posts = [...posts, ...await fetchPosts(greatestPost, greatestPost + postFetchCount - 1)];
		}

		greatestPost += postFetchCount;

		for (var i = 0; i < posts.length; i++) {
			images = await fetchImage(posts[i], images);
			usernameCache = await cacheUsername(posts[i], usernameCache);
		}

		loading = false;
	}
	go(false);

	let greatestPost = postFetchCount - 1;

	let scrollLoadDisabled = false;

	onMount(async () => {
		page = window.location.href;

		setInterval(() => {
			if (window.location.href != page) {
				go(false);
			}
			page = window.location.href;
		}, 100);

		window.onscroll = async function () {
			const scrollLoadPad = 200;

			if (
				window.innerHeight + window.scrollY + scrollLoadPad >= document.body.scrollHeight &&
				!scrollLoadDisabled
			) {
				scrollLoadDisabled = true;

				await go(true);

				scrollLoadDisabled = false;
			}
		};
	});

	let loading = true;
</script>


<Loading fullscreen={true} {loading} />

{#if !loading}
	<Posts
		{posts}
		{usernameCache}
		{images}
		options={{ title: 'Home', greatestPost, postFetchCount }}
	/>
{/if}