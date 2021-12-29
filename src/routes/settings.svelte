<script lang="ts">
	import { onMount } from 'svelte';
	import ChevronLeft from 'svelte-bootstrap-icons/lib/ChevronLeft';
	import Tabs from '$lib/components/settings/Tabs.svelte';
	import Settings from '$lib/components/settings/Settings.svelte'

	let tab = 'General';
	let selected = false;

	let width = 0;
	let showTabs = true;
	let showSettings = false;

	onMount(async() => {
		if(localStorage.getItem('reload') == 'true') {
			selected = true;
			localStorage.setItem('reload', 'false'); 
		}else {
			selected = false;
		}
		setInterval(() => {
			width = window.innerWidth;
			if(width < 500){
				if(selected) {
					showSettings = true;
					showTabs = false;
				}else {
					showSettings = false;
					showTabs = true;
				}
			}else {
				showSettings = true;
				showTabs = true;
			}
		}, 100);
	});
</script>

{#if showSettings && !showTabs}
<div>
<ChevronLeft style="position: absolute; top: calc(3px + 10px); left: calc(10px);" on:click={() => {selected = false}} />
</div>
{/if}

<main class={showTabs && showSettings ? '' : 'singular'}>
	{#if showTabs}
	<div>
		<h1>Settings</h1>
		<Tabs bind:tab={tab} bind:selected={selected} />
	</div>
	{/if}
	{#if showSettings}
	<Settings bind:tab={tab} bind:width={width} />
	{/if}
</main>

<style>
	main {
		display: flex;
		height: calc(100vh - 40px);
		overflow: hidden;
	}

	div {
		box-shadow: 2px 0px 4px var(--theme-color-accent-mid);
		margin-right: 10px;
	}
	div h1 {
		margin-left: 10px;
	}
	.singular div h1 {
		margin-left: 0px;
		margin-top: 2px;
	}
	.singular div {
		display: flex;
		align-items: center;
		flex-direction: column;
		
		width: 100vw;
		margin-right: 0px;
	}
	
	@media screen and (max-width: 810px) {
		main {
			max-width: 600px;
		}
	}
</style>