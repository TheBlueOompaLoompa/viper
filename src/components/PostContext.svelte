<script>
	import supabase from '$lib/db';
	import Button from './Button.svelte';
	import Dots from 'svelte-bootstrap-icons/lib/ThreeDotsVertical';
	import closable from 'svelte-closable';

	let showContext = false;
	export let post;
	let isOwner = false;

	let dots;

	if (post) isOwner = post['uid'] == (supabase.auth.user() ? supabase.auth.user().id : '');

	function toggleContext() {
		showContext = !showContext;
		console.log(showContext);
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

	var hasTouchScreen = false;
	if ('maxTouchPoints' in navigator) {
		hasTouchScreen = navigator.maxTouchPoints > 0;
	} else if ('msMaxTouchPoints' in navigator) {
		hasTouchScreen = navigator.msMaxTouchPoints > 0;
	} else {
		var mQ = window.matchMedia && matchMedia('(pointer:coarse)');
		if (mQ && mQ.media === '(pointer:coarse)') {
			hasTouchScreen = !!mQ.matches;
		} else if ('orientation' in window) {
			hasTouchScreen = true; // deprecated, but good fallback
		} else {
			// Only as a last resort, fall back to user agent sniffing
			var UA = navigator.userAgent;
			hasTouchScreen =
				/\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
				/\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
		}
	}
</script>

<container>
	<div bind:this={dots}><Dots on:click={toggleContext} /></div>
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
