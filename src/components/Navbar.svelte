<script>
	export const ssr = false;
	import Person from 'svelte-bootstrap-icons/lib/Person';
	import House from "svelte-bootstrap-icons/lib/House";
	import Search from "svelte-bootstrap-icons/lib/Search";
	import PlusSquare from "svelte-bootstrap-icons/lib/PlusSquare";
	import Chat from "svelte-bootstrap-icons/lib/Chat";

	import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();

	function onProfile() {
		dispatch("profile");
	}

	export let page;
</script>
<div id="nav" class="nav-container">
	{#if page == 'new'}
	<a id="new" class='active' href="/new"><PlusSquare /></a>
	{:else}
	<a id="new" href="/new"><PlusSquare /></a>
	{/if}
	{#if page == 'search'}
	<a id="search" class="active" href="/search"><Search /></a>
	{:else}
	<a id="search" href="/search"><Search /></a>
	{/if}
	{#if page == ''}
	<a class="active" id="home" href="/"><House /></a>
	{:else}
	<a id="home" href="/"><House /></a>
	{/if}
	<a id="profile" href="/sign" on:click={onProfile}><Person /></a>
	{#if page == 'dm'}
	<a class="active" id="dm" href="/dm"><Chat /></a>
	{:else}
	<a id="dm" href="/dm"><Chat /></a>
	{/if}
	
</div>

<style>
	.nav-container {
		display: flex;
		flex-direction: row;

		align-items: center;
		justify-content: space-evenly;

		position: fixed;
		bottom: 0px;
		width: 100%;
		height: 42px;

		box-shadow: 0px -2px 4px var(--theme-color-accent-mid);

		background-color: var(--theme-color-background);
		opacity: 100%;
	}

	a, a:visited {
		display: flex;
		align-items: center;
		height: 21px;
		color: var(--theme-color-font);
	}
</style>
