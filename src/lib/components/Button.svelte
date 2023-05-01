<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let text = 'Placeholder Text';
	export let style = '';
	export let textStyle = '';
	export let wide = false;
	let dispatch = createEventDispatcher();
	function onClick() {
		dispatch('click');
	}
</script>

<div class="button {wide ? 'w-wide' : ''}" {style} on:click={onClick} on:keydown={onClick} on:keypress={onClick}>
	<span class="gray" style={textStyle}>{text}</span>
</div>

<style>
	div {
		height: 35px;
	}
</style>