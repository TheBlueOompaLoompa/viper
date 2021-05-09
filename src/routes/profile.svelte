<script lang="ts">
	import Dots from 'svelte-bootstrap-icons/lib/ThreeDotsVertical';
	import Post from '../components/Post.svelte';
	import Loading from '../components/Loading.svelte';
	import Button from '../components/Button.svelte';

	import { onMount } from 'svelte';
	import vfetch from '$lib/vfetch';
	import supabase from '$lib/db';

	let posts = [];
	let images = {};
	let usernameCache = {};

	let loading = true;

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

	let user = {
		id: undefined,
		username: '',
	};
	onMount(async () => {
		user = await vfetch.getUser();

		usernameCache[user['id']] = user['username'];

		setTimeout(() => {
			if (loading) {
				alert(
					`Unable to load posts within 20 seconds, are you sure you're connected to the internet?`
				);
				window.location.reload();
			}
		}, 20000);

		posts = await vfetch.userPosts(0, 34, user['id']);

		loading = false;
	});

	let shadeThrown = false;

	function throwShade() {
		shadeThrown = !shadeThrown;
	}

	async function signOut() {
		loading = true;
		const error = (await supabase.auth.signOut())['error'];
		if(error) alert('Unable to logout!');
	}
</script>

<Loading fullscreen={true} {loading} />

{#if !loading}
	{#if shadeThrown}
		<shade>
			<Button text="Logout" />
		</shade>
	{/if}
	<Dots style="float: right; margin-top: 20px; margin-right: 10px;" on:click={throwShade} />

	<posts class="center" style="display: flex; flex-direction:column;">
		<h3>@{user.username}</h3>

		{#if posts.length < 1}
			<p>This user hasn't made any posts yet.</p>
		{/if}

		{#each posts as post}
			<Post {post} cache={usernameCache} img={images[post['id']]} />
		{/each}
	</posts>
{/if}

<style>
	shade {
		position: absolute;
		top: 50px;
		right: 20px;
		max-width: 200px;
		min-width: 200px;
		width: 200px;
		padding: 10px;

		background-color: var(--theme-color-background);
		filter: invert(0.07);

		border: 1px solid var(--theme-color-outline);
		border-radius: 6px;
	}
</style>