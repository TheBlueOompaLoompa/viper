<script>
	import PostContext from './PostContext.svelte';
	import PostTime from './PostTime.svelte';
	import Loading from '../components/Loading.svelte';

	export let post;
	export let cache;
	export let img;

	let username = 'Loading...';
	$: username = cache[post['uid']] ? cache[post['uid']] : 'Loading...';

	let loading = true;
	let imgClass = 'loading';

	function hideLoad() {
		loading = false;
		imgClass = '';
	}
</script>

<div
	class="flex flex-col post {post['type'] != 1 ? 'text' : ''}"
	style="max-height: {window.innerHeight - 42}px;"
>
	<div class="flex flex-row items-center justify-between w-full">
		<h5 style="margin-bottom: 10px; margin-top: 6px; text-align: left; margin-right: 5%;">
			{post['title']}
		</h5>
		<PostContext {post} />
	</div>
	<div style="width: 100%;">
		<a href="/profile?p={post['uid']}"><span class="gray">@{username}</span></a>
	</div>

	{#if post['type'] == 0}
		<p>{post['content']}</p>
	{:else if post['type'] == 1}
		<Loading {loading} />
		<img class={imgClass} alt={post['title']} src={img} on:load={hideLoad} />
	{/if}
	<PostTime timestamp={post['timestamp']} />
</div>

<style>
	.post {
		align-items: center;

		width: 88%;
		max-width: 700px;

		border: 1px solid var(--theme-color-outline);
		border-radius: 6px;

		margin-bottom: 30px;

		box-shadow: 0px 4px 4px var(--theme-color-accent-mid);
		overflow: hidden;

		--padding: 8px;
		padding-left: var(--padding);
		padding-right: var(--padding);
		padding-bottom: var(--padding);
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.post.text {
		align-items: flex-start;
	}

	.post img {
		max-width: 100%;
		border-radius: 6px;
		height: 100%;
	}

	a:visited {
		color: rgb(23, 1, 218);
	}

	.loading {
		visibility: hidden;
	}
</style>
