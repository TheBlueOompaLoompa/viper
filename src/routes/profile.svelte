<script lang="ts">
import { prefetch } from '$app/navigation';

	import Gear from 'svelte-bootstrap-icons/lib/Gear';

	function openSettings() {
		window.location.href = '/settings';
	}

	function pref() {
		prefetch('/settings')
	}
</script>

<div id="settings" on:focus={pref} on:mouseover={pref}>
	<Gear on:click={openSettings} />
</div>

<style>
	#settings {
		position: absolute;
		top: 10px;
		right: 10px;
	}
</style>