<script>
	import supabase from '$lib/db';
	import Button from './Button.svelte';
	import Dots from 'svelte-bootstrap-icons/lib/ThreeDotsVertical';

	let showContext = false;
	export let post;
	let isOwner = false;

	if (post) isOwner = post['uid'] == (supabase.auth.user() ? supabase.auth.user().id : '');

	function toggleContext() {
		showContext = !showContext;
	}

	function share() {
		toggleContext();
		var copyInput = document.createElement('input');
		document.body.appendChild(copyInput);

		let tmp = window.location.href.split('/');
		tmp.splice(3, tmp.length - 3);

		copyInput.value = `${tmp.join('/')}/post?p=${post['id']}`;

		copyInput.select();
		copyInput.setSelectionRange(0, 99999);

		document.execCommand('copy');

		document.body.removeChild(copyInput);

		setTimeout(() => {
			alert('Copied link to clipboard.');
		}, 5);
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
			<Button text="Share" on:click={share} />
			{#if isOwner}
				<div style="margin: 15px;" />
				<Button textStyle="color: red;" text={'Delete'} on:click={deletePost} />
			{/if}
		</context-menu>
	{/if}
</container>

<style>
	context-menu {
		position: absolute;
		transform: translateY(5px) translateX(-185px);
		padding: 5px;
		width: 200px;

		background-color: var(--theme-color-background);
		filter: invert(0.07);

		border: 1px solid var(--theme-color-outline);
		border-radius: 6px;
	}
</style>
