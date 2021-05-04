<script>
	import { createEventDispatcher } from 'svelte';
	export let text;
	export let style = '';
	export let wide = false;
	let dispatch = createEventDispatcher();

	function onClick() {
		dispatch('click');
	}
</script>

<div class="button {wide ? 'w-wide' : ''}" {style} on:click={onClick}>
	<span class="gray">{text}</span>
</div>
