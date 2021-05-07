<script lang="typescript">
	import Post from '../components/Post.svelte';
	import Loading from '../components/Loading.svelte';
	let loading = true;

	import { onMount } from 'svelte';
	import supabase from '$lib/db';

	let posts = [];
	let images = {};

	let usernameCache = {};

	async function fetchImage(post) {
		if (post['type'] == 1) {
			const { data, error } = await supabase.storage.from('media').download(`${post['id']}`);
			if (error) {
				alert('Failed to show image!');
				return;
			}
			images[post['id']] = window.URL.createObjectURL(data);
		}
	}

	async function cacheUsername(post) {
		if (!Object.keys(usernameCache)[post['uid']]) {
			usernameCache[post['uid']] = (
				await supabase.from('users').select('*').eq('id', post['uid'])
			).data[0]['username'];
		}
	}

	$: posts.forEach(async (post) => {
		await fetchImage(post);
		await cacheUsername(post);
	});

	onMount(async () => {
		let data = (await supabase.from('users').select('id,username')).data;

		let exists = false;
		data.forEach((acct) => {
			exists = supabase.auth.user().id == acct['id'] || exists;
		});

		if (!exists) window.location.href = '/setup';

		setTimeout(() => {
			if (loading){
				alert(`Unable to load posts within 20 seconds, are you sure you're connected to the internet?`);
				window.location.reload();
			}
		}, 20000);

		{
			const { data, error } = await supabase
				.from('posts')
				.select('*')
				.order('timestamp', { ascending: false })
				.range(0, 29);

			if (error) {
				alert('Failed to load posts. Are you connected to the internet?');
				return;
			}

			posts = data;
		}
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
