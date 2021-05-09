<script>
	export const ssr = false;
	import Person from 'svelte-bootstrap-icons/lib/Person';
	import House from 'svelte-bootstrap-icons/lib/House';
	import Search from 'svelte-bootstrap-icons/lib/Search';
	import PlusSquare from 'svelte-bootstrap-icons/lib/PlusSquare';
	import Chat from 'svelte-bootstrap-icons/lib/Chat';
	import People from 'svelte-bootstrap-icons/lib/People';

	import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();

	function onProfile() {
		dispatch('profile');
	}

	export let page;
</script>

<nav>
	<div id="nav" class="nav-container">
		{#if page == ''}
			<a class="active" id="home" href="/"><House /></a>
		{:else}
			<a id="home" href="/"><House /></a>
		{/if}
		{#if page == 'new'}
			<a id="new" class="active" href="/new"><PlusSquare /></a>
		{:else}
			<a id="new" href="/new"><PlusSquare /></a>
		{/if}
		{#if page == 'groups'}
			<a id="groups" class="active" href="/groups"><People /></a>
		{:else}
			<a id="groups" href="/groups"><People /></a>
		{/if}
		{#if page == 'dm'}
			<a class="active" id="dm" href="/dm"><Chat /></a>
		{:else}
			<a id="dm" href="/dm"><Chat /></a>
		{/if}
		{#if page == 'search'}
			<a id="search" class="active" href="/search"><Search /></a>
		{:else}
			<a id="search" href="/search"><Search /></a>
		{/if}
		{#if page == 'profile'}
			<a id="profile" class="active" href="/profile" on:click={onProfile}><Person /></a>
		{:else}
			<a id="profile" href="/profile" on:click={onProfile}><Person /></a>
		{/if}
	</div>
</nav>

<style>
	nav {
		display: flex;
		flex-direction: row;
		justify-content: center;

		position: fixed;
		bottom: 0px;
		width: 100%;
		height: 42px;

		box-shadow: 0px -2px 4px var(--theme-color-accent-mid);

		background-color: var(--theme-color-background);
		opacity: 100%;
	}
	.nav-container {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;

		align-items: center;

		width: 100%;
		max-width: 650px;
	}

	a,
	a:visited {
		display: flex;
		align-items: center;
		height: 21px;
		color: var(--theme-color-font);
	}
</style>
