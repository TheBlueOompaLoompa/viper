<script>
	export let posts;
	export let usernameCache;
	export let images;

	export let options;

	import Post from '../components/Post.svelte';
	import { fly } from 'svelte/transition';
</script>

<posts class="flex flex-col items-center">
	<h2>{options.title}</h2>

	{#if posts.length < 1}
		<p>There aren't any posts here, maybe your should <a href="/new">make your own!</a> ;)</p>
	{/if}

	{#each posts as post, i}
		<div
			class="trans"
			in:fly={{
				x: -200,
				duration: 1000,
				delay: (i - options.greatestPost + options.postFetchCount) * 200
			}}
		>
			<Post {post} cache={usernameCache} img={images[post['id']]} />
		</div>
	{/each}
</posts>

<style>
	posts {
		overscroll-behavior: contain;
	}

	.trans {
		display: flex;
		justify-content: center;
		width: 100%;
	}
</style>
