<script lang="typescript">
	export const ssr = false;

	import Post from '../components/Post.svelte';
	import Loading from '../components/Loading.svelte';
	let loading = true;

	import { onMount } from 'svelte';
	import vfetch from '$lib/vfetch';

	let posts = [];
	let images = {};

	let usernameCache = {};

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

	$: posts.forEach(async (post) => {
		fetchImage(post);
		cacheUsername(post);
	});

	let greatestPost = 9;
	let scrollLoadDisabled = false;

	async function fetchPosts() {
		if (window.location.href.includes('?g=')) {
			const group = decodeURI(window.location.href.split('?g=')[1]);
			posts = await vfetch.groupPosts(0, 9, group);
		} else {
			posts = await vfetch.posts(0, 9);
		}

		window.onscroll = async function () {
			if (
				window.innerHeight + window.scrollY >= document.body.scrollHeight &&
				!scrollLoadDisabled
			) {
				scrollLoadDisabled = true;

				if (window.location.href.includes('?g=')) {
					const group = decodeURI(window.location.href.split('?g=')[1]);
					posts = [
						...posts,
						...(await vfetch.groupPosts(greatestPost + 1, greatestPost + 10, group))
					];
				} else {
					posts = [...posts, ...(await vfetch.posts(greatestPost + 1, greatestPost + 10))];
				}

				greatestPost += 10;

				scrollLoadDisabled = false;
			}
		};

		loading = false;
	}

	let page = '';

	onMount(async () => {
		setTimeout(() => {
			if (loading) {
				alert(
					`Unable to load posts within 20 seconds, are you sure you're connected to the internet?`
				);
				window.location.reload();
			}
		}, 20000);

		page = window.location.href;

		setInterval(() => {
			if (window.location.href != page) {
				fetchPosts();
			}
			page = window.location.href;
		}, 100);
		await fetchPosts();
	});
</script>

<Loading fullscreen={true} {loading} />

{#if !loading}
	<posts class="center" style="display: flex; flex-direction:column;">
		{#if !window.location.href.includes('?g=')}
			<h2>Home</h2>
		{:else}
			<h2>{decodeURI(window.location.href.split('?g=')[1])}</h2>
		{/if}

		{#if posts.length < 1}
			<p>There aren't any posts here, maybe your should <a href="/new">make your own!</a> ;)</p>
		{/if}

		{#each posts as post}
			<Post {post} cache={usernameCache} img={images[post['id']]} />
		{/each}
	</posts>
{/if}

<style>
	posts {
		overscroll-behavior: contain;
	}
</style>
