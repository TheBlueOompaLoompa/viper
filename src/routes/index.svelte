<script lang="typescript">
	import Post from '../components/Post.svelte';
	import Loading from '../components/Loading.svelte';
	let loading = true;

	import { onMount } from 'svelte';
	import supabase from '$lib/db';
	import vfetch from '$lib/vfetch';

	let posts = [];
	let images = {};

	let usernameCache = {};

	$: posts.forEach(async (post) => {
		if (post['type'] == 1) {
			images[post['id']] = await vfetch.fetchImage(post);
		}
		if (!Object.keys(usernameCache)[post['uid']]) {
			usernameCache[post['uid']] = await vfetch.getUsernameFromPost(post);
		}
	});

	onMount(async () => {
		if (!(await vfetch.hasUsername())) window.location.href = '/setup';

		setTimeout(() => {
			if (loading) {
				alert(
					`Unable to load posts within 20 seconds, are you sure you're connected to the internet?`
				);
				window.location.reload();
			}
		}, 20000);
		
		posts = await vfetch.posts(0, 34);
		
		loading = false;
	});
</script>

<Loading fullscreen={true} {loading} />

{#if !loading}
	<div class="center" style="display: flex; flex-direction:column;">
		<h2>Home</h2>

		{#if posts.length < 1}
			<p>There aren't any posts here, maybe your should <a href="/new">make your own!</a> ;)</p>
		{/if}

		{#each posts as post}
			<Post {post} cache={usernameCache} img={images[post['id']]} />
		{/each}
	</div>
{/if}
