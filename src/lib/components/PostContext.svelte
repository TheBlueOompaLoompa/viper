<script lang="ts">
	import supabase from '$lib/supabase';
	import Button from './Button.svelte';
	import { ThreeDotsVertical } from 'svelte-bootstrap-icons';
	import closable from 'svelte-closable';
    import type { PostData } from '$lib/types';
	import { onMount } from 'svelte';

    export let post: PostData;

	let showContext = false;
	let isOwner = false;
	let dots;

    onMount(async () => {
        const { data, error } = await supabase.auth.getSession();
        if(post && data.session != null) isOwner = post['uid'] == data.session.user.id;
    });

	function toggleContext() {
		showContext = !showContext;
		console.log(showContext);
	}

	async function share() {
		toggleContext();
		let tmp = window.location.href.split('/');
		tmp.splice(3, tmp.length - 3);
		await navigator.clipboard.writeText(`${tmp.join('/')}/post?p=${post['id']}`);
		alert('Copied link to clipboard.');
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

	var hasTouchScreen = 'ontouchstart' in window;
</script>

<container>
	<div bind:this={dots} on:click={toggleContext} on:keypress={toggleContext}><ThreeDotsVertical/></div>
	{#if showContext}
		<context-menu
			use:closable={{ exclude: [dots] }}
			on:outside-click={() => {
				if (hasTouchScreen) showContext = false;
			}}
		>
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