<script lang="typescript">
	import supabase from '$lib/db';
	import vfetch from '$lib/vfetch';

	import { fly } from 'svelte/transition';
	import Post from '../components/Post.svelte';

	let search = '';

	let results = [];

	function thing() {
		window.onscroll = async function () {
			if (
				window.innerHeight + window.scrollY >= document.body.scrollHeight &&
				!scrollLoadDisabled
			) {
				scrollLoadDisabled = true;
				offset += 5;

				results = [
					...results,
					...(await supabase.rpc('srch', { term: search.replace(' ', ' or '), req_offset: offset }))
						.data
				];

				scrollLoadDisabled = false;
			}
		};
	}

	let first = true;
	async function onUpdateSearch() {
		if (first) {
			first = false;
			thing();
		}
		try {
			results = (await supabase.rpc('srch', { term: search.replace(' ', ' or '), req_offset: 0 }))
				.data;
		} catch (e) {
			alert(e);
		}
	}

	$: {
		if (search.replace(' ', '') != '') {
			onUpdateSearch();
		}
	}

	var scrollLoadDisabled = false;
	var offset = 0;

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

	var i = 0;
	$: for (i = 0; i < results.length; i++) {
		fetchImage(results[i]);
		cacheUsername(results[i]);
	}
</script>

<div class="center" style="flex-direction: column;">
	<h2>Search</h2>
	<input
		type="text"
		class="w-wide"
		bind:value={search}
		placeholder="Users, posts, groups, etc..."
	/>
</div>
<posts class="center" style="display: flex; flex-direction:column; margin-top: 30px;">
	{#each results as post, i}
		<div class="trans">
			<Post {post} cache={usernameCache} img={images[post['id']]} />
		</div>
	{/each}
</posts>

<style>
	.trans {
		display: flex;
		justify-content: center;
		width: 100%;
	}
</style>
