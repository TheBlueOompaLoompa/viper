<script lang="ts">
	import { onMount } from 'svelte';

	import Person from 'svelte-bootstrap-icons/lib/Person';
	import House from 'svelte-bootstrap-icons/lib/House';
	import Search from 'svelte-bootstrap-icons/lib/Search';
	import PlusSquare from 'svelte-bootstrap-icons/lib/PlusSquare';
	import Chat from 'svelte-bootstrap-icons/lib/Chat';
	import People from 'svelte-bootstrap-icons/lib/People';

	let active = {
		'/': '',
		'/new': '',
		'/groups': '',
		'/dm': '',
		'/search': '',
		'/profile': ''
	};

	let last = '';

	let iconURL;

	onMount(() => {
		setInterval(() => {
			if(window.location.pathname != last) {
				Object.keys(active).forEach(page => {
					active[page] = '';
				});

				active[window.location.pathname] = 'active';

				const user = localStorage.getItem('user');

				if(user) {
					iconURL = JSON.parse(user).photoURL;
				}

				last = window.location.pathname;
			}
		}, 10);
	})
</script>

<bar>
	<div id="maxw">
		<a sveltekit:prefetch class={active['/']} href="/"><div><House/></div></a>
		<a sveltekit:prefetch class={active['/new']} href="/new"><div><PlusSquare/></div></a>
		<a sveltekit:prefetch class={active['/groups']} href="/groups"><div><People/></div></a>
		<a sveltekit:prefetch class={active['/dm']} href="/dm"><div><Chat/></div></a>
		<a sveltekit:prefetch class={active['/search']} href="/search"><div><Search/></div></a>
		<a sveltekit:prefetch class={active['/profile']} href="/profile"><div>
			{#if iconURL}
			<img src={iconURL} alt="user icon">
			{:else}
			<Person/>
			{/if}
		</div></a>
	</div>
</bar>

<style>
	bar {
		display: flex;
		justify-content: center;

		position: fixed;

		bottom: 0px;
		left: 0px;
		right: 0px;

		height: 2.5rem;

		background: var(--theme-color-background);
		box-shadow: 0px -2px 4px var(--theme-color-accent-mid);
	}

	#maxw {
		display: flex;

		justify-content: space-evenly;
		align-items: center;

		width: 100%;
		max-width: 640px;
	}

	img, a, a:visited,
	a div {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	a, a:visited {
		width: 2rem;
		height: 2rem;

		color: var(--theme-color-font-alt);
	}

	.active {
		background-color: var(--theme-color-main);
		padding: 5px;
		width: 21px;
		height: 21px;
		border-style: solid;
		border-color: var(--theme-color-outline);
		border-width: 1px;
		border-radius: 100%;

		box-shadow: 0px 1px 4px var(--theme-color-accent-mid);
	}

	a[href="/profile"] div {
		width: 100%;
		height: 100%;
	}

	img {
		border-radius: 50%;
	}

	a.active div img {
		width: 100%;
		height: 100%;
	}

	a:not(.active) div img {
		width: calc(2rem - 10px);
		height: calc(2rem - 10px);
	}
</style>