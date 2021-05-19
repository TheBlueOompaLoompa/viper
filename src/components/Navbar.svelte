<script>
	export const ssr = false;
	import Person from 'svelte-bootstrap-icons/lib/Person';
	import House from 'svelte-bootstrap-icons/lib/House';
	import Search from 'svelte-bootstrap-icons/lib/Search';
	import PlusSquare from 'svelte-bootstrap-icons/lib/PlusSquare';
	import Chat from 'svelte-bootstrap-icons/lib/Chat';
	import People from 'svelte-bootstrap-icons/lib/People';

	import { fade } from 'svelte/transition';

	export let page;
</script>

<nav class="flex flex-row justify-center fixed bottom-0 w-full h-10">
	<div class="flex flex-row justify-evenly items-center w-full max-w-screen-sm">
		<a transition:fade class={page == '' ? 'active' : ''} id="home" href="/"><House /></a>
		<a id="new" class={page == 'new' ? 'active' : ''} href="/new"><PlusSquare /></a>
		<a id="groups" class={page == 'groups' ? 'active' : ''} href="/groups"><People /></a>
		<a class={page == 'dm' ? 'active' : ''} id="dm" href="/dm"><Chat /></a>
		<a id="search" class={page == 'search' ? 'active' : ''} href="/search"><Search /></a>
		<a id="profile" class={page == 'profile' ? 'active' : ''} href="/profile"><Person /></a>
	</div>
</nav>

<style>
	nav {
		box-shadow: 0px -2px 4px var(--theme-color-accent-mid);

		background-color: var(--theme-color-background);
	}

	a,
	a:visited {
		@apply flex;
		@apply items-center;
		@apply justify-center;
		@apply h-8;
		@apply w-8;
		@apply text-gray-300;
	}
</style>
