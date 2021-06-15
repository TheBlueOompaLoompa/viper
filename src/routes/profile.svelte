<script lang="ts">
	import Gear from 'svelte-bootstrap-icons/lib/Gear';
	import Posts from '../components/Posts.svelte';
	import Loading from '../components/Loading.svelte';
	import Button from '../components/Button.svelte';

	import { onMount } from 'svelte';
	import { fetchImage, cacheUsername } from '$lib/postfetch';
	import vfetch from '$lib/vfetch';
	import supabase from '$lib/db';

	let user = {
		id: undefined,
		username: ''
	};

	let page = '';

	let posts = [];
	let images = {};
	let usernameCache = {};

	const postFetchCount = 5;

	let greatestPost = postFetchCount - 1;

	let scrollLoadDisabled = false;

	let loading = true;

	async function go(isScroll) {
		user.id = window.location.href.includes('?p=')
			? window.location.href.split('?p=')[1]
			: supabase.auth.user().id;
		if (!isScroll) {
			posts = await vfetch.userPosts(0, postFetchCount - 1, user.id);
		} else {
			posts = [
				...posts,
				...(await vfetch.userPosts(greatestPost, greatestPost + postFetchCount - 1, user.id))
			];
		}

		greatestPost += postFetchCount;

		for (var i = 0; i < posts.length; i++) {
			images = await fetchImage(posts[i], images);
			usernameCache = await cacheUsername(posts[i], usernameCache);
		}

		loading = false;
	}
	go(false);

	onMount(async () => {
		user = await vfetch.getUser(user.id);
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

	let shadeThrown = false;

	function throwShade() {
		shadeThrown = !shadeThrown;
	}

	async function signOut() {
		loading = true;
		const error = (await supabase.auth.signOut())['error'];
		if (error) {
			alert('Unable to logout!');
			return;
		} else {
			window.location.href = '/sign';
		}
	}
</script>

<Loading fullscreen={true} {loading} />

{#if !loading}
	{#if shadeThrown}
		<shade>
			<Button text="Logout" on:click={signOut} />
		</shade>
	{/if}
	<Gear
		style="position: absolute; right: 0px; margin-top: 10px; margin-right: 10px;"
		on:click={throwShade}
	/>

	<Posts
		{posts}
		{usernameCache}
		{images}
		options={{
			title: `@${user.username}`,
			greatestPost,
			postFetchCount
		}}
	/>

	{#if posts.length < 1}
		<p>This user hasn't made any posts yet.</p>
	{/if}
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
