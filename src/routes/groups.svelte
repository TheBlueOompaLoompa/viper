<script>
	export const ssr = false;
	import supabase from '$lib/db';
	import Button from '../components/Button.svelte';

	let groups = [];

	async function go () {
		var data = (await supabase.from('groups').select('*')).data;

		console.log(data);

		data.forEach(group => {
			groups = [...groups, { uri: "/group/?g=" + encodeURIComponent(group.id), id: group.id}];
		});
	}

	go();
</script>

<div class="flex flex-col justify-center items-center">
	<h2>Groups</h2>
	{#each groups as group}
		<a href={group['uri']} style="width: 100%; display: flex; justify-content: center;"><Button
			text={group['id']}
			wide={true}
		/></a>
		<div class="bpad" />
	{/each}
</div>

<style>
	.bpad {
		width: 100%;
		margin-bottom: 15px;
	}
</style>
