<script>
	export let posts;
	export let usernameCache;
	export let images;

	export let options;

	import Post from '../components/Post.svelte';
	import XSquare from 'svelte-bootstrap-icons/lib/XSquare';
	import { fly } from 'svelte/transition';

	let explode;

	function explodeImg(id) {
		explode = id;
	}
</script>

{#if explode}
	<div
		style="position: fixed; top: 0px; left: 0px; bottom: 0px; right: 0px; background-color: #000000af;"
	>
		<XSquare
			on:click={() => {
				explodeImg(undefined);
			}}
			style="position: fixed; right: 10px; top: 10px; width: 30px; height: 30px; z-index: 2;"
		/>
		<explode>
			<img src={images[explode]} alt="ExplodedImage" style="border-radius: 6px;" />
		</explode>
	</div>
{/if}

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
			<Post {post} cache={usernameCache} img={images[post['id']]} {explodeImg} />
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

	explode {
		display: flex;
		justify-content: center;
		align-items: center;

		position: fixed;
		top: 0px;
		left: 0px;
		width: 100%;
		height: calc(100% - 42px);
	}

	explode img {
		object-fit: scale-down;
		max-height: 100%;
		max-width: 100%;
	}
</style>
