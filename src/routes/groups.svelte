<script>
	export const ssr = false;
	import supabase from '$lib/db';
	import Button from '../components/Button.svelte';

	function gotoGroup(group) {
		window.location.href = `/?g=${group}`;
	}
</script>

<div class="center" style="display: flex; flex-direction:column;">
	<h2>Groups</h2>
	{#await supabase
		.from('groups')
		.select('*') then data}
		{#each data.data as group}
			<Button
				text={group['id']}
				wide={true}
				on:click={() => {
					gotoGroup(group['id']);
				}}
			/>
		{/each}
	{/await}
</div>
