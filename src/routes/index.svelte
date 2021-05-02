<script lang="typescript">
	import WideButton from "../components/WideButton.svelte"

	import { onMount } from 'svelte';
	import supabase from '$lib/db';

	let posts = [];
	let images = {};

	$: posts.forEach(async post => {
		if(post['type'] == 1){
			const { data, error } = await supabase
				.storage
				.from('media')
				.download(`${post['id']}`);
			images[post['id']] = window.URL.createObjectURL(data);
		}
	});

	onMount(async () => {
		let { data, error } = await supabase
			.from('posts')
			.select('*')
			.order('timestamp', {ascending: false});

		posts = data;
	});
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<div class="center" style="display: flex; flex-direction:column;">
	<h2>Home</h2>
	
	{#each posts as post}
	<div class='post {post['type'] != 1 ? 'text' : ''}'>
		<h4>{post['title']}</h4>

		{#if post['type'] == 0}
		<p>{post['content']}</p>
		{:else if post['type'] == 1}
		<img src={images[post['id']]}>
		{/if}
	</div>
	{/each}
</div>

<style>
	.post {
		display: flex;
		flex-direction: column;
		align-items: center;

		width: 95%;
		max-width: 400px;

		border: 1px solid var(--theme-color-outline);
		border-radius: 6px;

		margin-bottom: 30px;

		box-shadow: 0px 4px 4px var(--theme-color-accent-mid);
		overflow: hidden;

		--padding: 8px;
		padding-left: var(--padding);
		padding-right: var(--padding);
		padding-bottom: var(--padding);
	}

	.post.text {
		align-items: flex-start;
	}

	.post img {
		width: 100%;
		border-radius: 6px;
	}
</style>