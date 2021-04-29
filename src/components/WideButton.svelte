<script>
	import { createEventDispatcher } from 'svelte';
	export let text;
	export let style = '';
	let dispatch = createEventDispatcher();

	function onClick() {
		dispatch("click");
	}
</script>
<div class="button w-wide" style={style} on:click={onClick}><span class="gray">{text}</span></div>