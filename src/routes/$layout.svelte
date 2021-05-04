<script lang="ts">
	import { onMount } from 'svelte';

	import supabase from '$lib/db';

	import Navbar from '../components/Navbar.svelte';

	let showNav = false;
	let page = 'home';

	onMount(() => {
		showNav = false;

		if (!supabase.auth.user() && !window.location.href.includes('sign'))
			window.location.href = '/sign';

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
	<Navbar
		on:profile={() => {
			showNav = false;
		}}
		{page}
	/>
{/if}

<style>
	main {
		padding-bottom: 42px;
	}
</style>
