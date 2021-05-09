<script>
	import supabase from '$lib/db';
	import Button from './Button.svelte';
	import Dots from 'svelte-bootstrap-icons/lib/ThreeDotsVertical';

	let showContext = false;
	export let post;
	let isOwner = false;

	if (post) isOwner = post['uid'] == supabase.auth.user().id;

	function toggleContext() {
		showContext = !showContext;
	}

	async function deletePost() {
		const { error } = await supabase.from('posts').delete().match({ id: post['id'] });

		if (error) {
			alert('Failed to delete post!');
			return;
		}

		if (post['type'] != 0) {
			const { error } = await supabase.storage.from('media').remove([`${post['id']}`]);

			if (error) {
				alert(
					`Failed to delete image from post! Please note down the text below so an admin can manually delete it.\n ${post['id']}`
				);
			}
		}

		window.location.reload();
	}
</script>

<container>
	<Dots on:click={toggleContext} />
	{#if showContext}
		<context-menu>
			{#if isOwner}
				<Button text={'Delete'} on:click={deletePost} />
			{/if}
		</context-menu>
	{/if}
</container>

<style>
	container {
		position: absolute;
		transform: translateY(13px);

		display: flex;
		justify-content: flex-end;
		width: 88%;
		max-width: 700px;
	}

	context-menu {
		position: absolute;
		transform: translateY(24px) translateX(-6px);
		padding: 5px;
		width: 200px;

		background-color: var(--theme-color-background);
		filter: invert(0.07);

		border: 1px solid var(--theme-color-outline);
		border-radius: 6px;
	}
</style>
