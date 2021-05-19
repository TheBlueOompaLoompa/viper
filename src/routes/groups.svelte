<script>
	export const ssr = false;
	import supabase from '$lib/db';
	import Button from '../components/Button.svelte';

	function gotoGroup(group) {
		window.location.href = `/?g=${group}`;
	}
</script>

<div class="flex flex-col justify-center items-center">
	<h2>Groups</h2>
	{#await supabase.from('groups').select('*') then data}
		{#each data.data as group}
			<Button
				text={group['id']}
				wide={true}
				on:click={() => {
					gotoGroup(group['id']);
				}}
			/>
			<div class="bpad" />
		{/each}
	{/await}
</div>

<style>
	.bpad {
		width: 100%;
		margin-bottom: 15px;
	}
</style>
