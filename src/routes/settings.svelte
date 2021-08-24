<script>
	import { onMount } from 'svelte';

	let logout;

	onMount(async () => {
        const { auth } = await import('../firebase');

		logout = function() {
			auth.signOut();
		}
	});

	let group = 'profile';
</script>

<main>
	<groups>
		<button>Profile</button>
	</groups>
	<settings>
		{#if group == 'profile'}
			<button class="small" on:click={logout}>Logout</button>
		{/if}
	</settings>
</main>

<style>
	groups,
	groups * {
		max-width: 250px;
	}

	button:not(.small) {
		width: 250px;
	}

	main {
		margin: 20px auto 20px auto;
		max-width: 600px;
	}
</style>