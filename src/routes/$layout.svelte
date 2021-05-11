<script lang="ts">
	import Navbar from '../components/Navbar.svelte';
	import Button from '../components/Button.svelte';

	import { onMount } from 'svelte';

	import supabase from '$lib/db';


	let showNav = false;
	let showLogMsg = false;
	let page = 'home';

	function gotoSign() {
		window.location.href = '/sign';
	}

	onMount(() => {
		showNav = false;

		if (!supabase.auth.user() && !window.location.href.includes('sign'))
			showLogMsg = true;

		setInterval(() => {
			if (!window.location.href.includes('sign') && !window.location.href.includes('setup'))
				showNav = true;
			page = window.location.href.split('/')[3];
		}, 300);
	});

	supabase.auth.onAuthStateChange((event) => {
		switch (event) {
			case 'SIGNED_IN':
				window.location.href = '/';
				break;
		}
	});
</script>

<svelte:head>
	<link rel="shortcut icon" href="/favicon.png" />
	<title>Viper</title>
</svelte:head>

<main>
	<slot />
</main>

{#if showNav}
	<Navbar {page} />
{/if}

{#if showLogMsg}
	<p id="close" on:click={() => { showLogMsg = !showLogMsg; }}>X</p>
	<div class="logmsg center" style="flex-direction: column;">
		<p>You aren't currently logged in.</p>
		<br>
		<Button text="Signup or Login" wide={true} on:click={gotoSign} />
	</div>
{/if}

<style>
	main {
		padding-bottom: 42px;
	}

	.logmsg {
		position: fixed;
		bottom: 0px;
		left: 0px;
		right: 0px;
		height: 200px;

		background-color: rgb(13, 13, 17);
		box-shadow: 0px -4px 4px var(--theme-color-accent-mid);

		z-index: 2;
	}

	#close {
		position: fixed;

		right: 15px;
		bottom: 150px;

		z-index: 3;

		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
	}
</style>
