<script>
	import Loading from '../components/Loading.svelte';
	import Button from '../components/Button.svelte';
	import Gear from 'svelte-bootstrap-icons/lib/Gear';
	import Posts from '../components/Posts.svelte';

	import { onMount } from 'svelte';
	import vfetch from '$lib/vfetch';
	import { fetchPosts, fetchImage, cacheUsername } from '$lib/postfetch';
	import supabase from '$lib/db';

	let page = '';
	let loading = true;

	let posts = [];
	let images = {};
	let usernameCache = {};

	const postFetchCount = 5;

	let scrollLoadDisabled = false;

	let lastResponse = [];

	async function go(isScroll) {
		const group = decodeURI(window.location.href.split('?g=')[1]);

		if (!isScroll) {
			posts = await fetchPosts(0, postFetchCount - 1, group);
			lastResponse = posts;
		} else {
			lastResponse = await fetchPosts(greatestPost, greatestPost + postFetchCount - 1, group);
			posts = [...posts, ...lastResponse];
			greatestPost += postFetchCount;
		}

		for (var i = 0; i < posts.length; i++) {
			usernameCache = await cacheUsername(posts[i], usernameCache);
			images = await fetchImage(posts[i], images);
		}

		loading = false;
	}
	go(false);

	let greatestPost = postFetchCount;

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

				if (lastResponse.length < 1) {
					scrollLoadDisabled = true;
				} else {
					scrollLoadDisabled = false;
				}
			}
		};
	});

	let shadeThrown = false;

	function throwShade() {
		shadeThrown = !shadeThrown;
	}

	function addUser() {
		let username = prompt(`What's their username?`);
		let level = parseInt(
			prompt('What permission level\n0: View Posts\n1: Comment\n2: Comment and Post\n 3: Moderator')
		);

		if (level > 3 || level < 0) {
			alert('Their level has to be between 0 and 3!');
			return;
		}

		vfetch.addUserToGroup(
			username,
			decodeURIComponent(window.location.href).split('?g=')[1],
			level
		);
	}

	function removeUser() {
		let username = prompt(`What's their username?`);

		vfetch.removeUserFromGroup(username, decodeURIComponent(window.location.href).split('?g=')[1]);
	}

	async function leaveGroup() {
		console.log('Leave group');
		await supabase
			.from('permissions')
			.delete()
			.eq('uid', await vfetch.getUid())
			.eq('group_id', decodeURIComponent(window.location.href.split('?g=')[1]));
	}
</script>

{#if shadeThrown}
	<shade>
		{#await vfetch.getUid() then uid}
			{#await vfetch.getPermissionLevel(decodeURIComponent(window.location.href.split('?g=')[1]), uid) then level}
				{#if level == 4}
					<Button text="Add User" style="margin-bottom: 15px;" on:click={addUser} />
					<Button text="Remove User" style="margin-bottom: 15px;" on:click={removeUser} />
				{/if}
				{#if level > 0 && level < 4}
					<Button text="Leave Group" on:click={leaveGroup} />
				{/if}
			{/await}
		{/await}
	</shade>
{/if}

<Loading fullscreen={true} {loading} />

{#if !loading}
	<Gear
		style="position: absolute; right: 0px; margin-top: 10px; margin-right: 10px;"
		on:click={throwShade}
	/>
	<Posts
		{posts}
		{usernameCache}
		{images}
		options={{
			title: decodeURIComponent(window.location.href).split('?g=')[1],
			greatestPost,
			postFetchCount
		}}
	/>
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

		z-index: 4;
	}
</style>
