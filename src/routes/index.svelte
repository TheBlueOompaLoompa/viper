<script lang="typescript">
	export const ssr = false;

	import Loading from '../components/Loading.svelte';
	import Button from '../components/Button.svelte';
	import Gear from 'svelte-bootstrap-icons/lib/Gear';
	import Posts from '../components/Posts.svelte';

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

	const postFetchCount = 5;

	let greatestPost = postFetchCount - 1;
	let scrollLoadDisabled = false;

	async function fetchPosts() {
		if (window.location.href.includes('?g=')) {
			const group = decodeURI(window.location.href.split('?g=')[1]);
			posts = await vfetch.groupPosts(0, postFetchCount - 1, group);
		} else {
			posts = await vfetch.posts(0, postFetchCount - 1);
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
	}

	let page = '';

	onMount(async () => {
		setTimeout(() => {
			if (loading) {
				alert(
					`Unable to load posts within 2 minutes, are you sure you're connected to the internet?`
				);
				window.location.reload();
			}
		}, 2 * 60000);

		page = window.location.href;

		setInterval(() => {
			if (window.location.href != page) {
				fetchPosts();
			}
			page = window.location.href;
		}, 100);
		await fetchPosts();
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

		vfetch.addUserToGroup(username, decodeURI(window.location.href.split('?g=')[1]), level);
	}

	function removeUser() {
		let username = prompt(`What's their username?`);

		vfetch.removeUserFromGroup(username, decodeURI(window.location.href.split('?g=')[1]));
	}
</script>

<Loading fullscreen={true} {loading} />

{#if !loading}
	{#if window.location.href.includes('?g=')}
		{#if shadeThrown}
			<shade>
				{#await vfetch.getUid() then uid}
					{#await vfetch.getPermissionLevel(decodeURI(window.location.href.split('?g=')[1]), uid) then level}
						{#if level == 4}
							<Button text="Add User" style="margin-bottom: 15px;" on:click={addUser} />
							<Button text="Remove User" on:click={removeUser} />
						{/if}
					{/await}
				{/await}
			</shade>
		{/if}
		<Gear style="float: right; margin-top: 10px; margin-right: 10px;" on:click={throwShade} />
	{/if}

	<Posts {posts} {usernameCache} {images} options={{title: 'Home', greatestPost, postFetchCount}} />
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
