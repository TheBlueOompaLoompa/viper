<script>
	export let post;
	export let img;
</script>

<div class='post {post['type'] != 1 ? 'text' : ''}'>
	<h5 style="width: 100%; margin-bottom: 10px; margin-top: 6px;">{post['title']}</h5>
	<span class="gray" style="width: 100%;">@{post['username']}</span>

	{#if post['type'] == 0}
	<p>{post['content']}</p>
	{:else if post['type'] == 1}
	<img loading="lazy" alt={post['title']} src={img}>
	{/if}
</div>

<style>
	.post {
		display: flex;
		flex-direction: column;
		align-items: center;

		width: 95%;
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

		user-select: none;
	}

	.post.text {
		align-items: flex-start;
	}

	.post img {
		width: 100%;
		border-radius: 6px;
	}
</style>
