<script lang="ts">
	import { prefetch } from '$app/navigation';
	import { onMount } from 'svelte';

	import Gear from 'svelte-bootstrap-icons/lib/Gear';

	function openSettings() {
		window.location.href = '/settings';
	}

	function pref() {
		prefetch('/settings')
	}

	let isAuth = false;

	onMount(async () => {
		if(localStorage.getItem('user')) {
			isAuth = true;
		}
	});
</script>

<div id="settings" on:focus={pref} on:mouseover={pref}>
	{#if isAuth}
	<Gear on:click={openSettings} />
	{:else}
	<button on:click={() => {location.href = '/login'}}>Login</button>
	{/if}
</div>

<center>
	
</center>

<style>
	#settings {
		position: absolute;
		top: 10px;
		right: 10px;
	}
</style>