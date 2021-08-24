<script lang="ts">
	import Gear from 'svelte-bootstrap-icons/lib/Gear';

	function openSettings() {
		window.location.href = '/settings';
	}
</script>

<div id="settings">
	<Gear on:click={openSettings} />
</div>

<style>
	#settings {
		position: absolute;
		top: 10px;
		right: 10px;
	}
</style>