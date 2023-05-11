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

<div class="button hover-rotate {wide ? 'w-wide' : ''}" {style} on:click={onClick} on:keydown={onClick} on:keypress={onClick}>
	<span class="gray" style={textStyle}>{text}</span>
</div>

<style>
	.button {
		display: flex;
		align-items: center;
		justify-content: center;

		height: 45px;
		border-radius: 6px;

		background-color: var(--theme-color-main);

		box-shadow: 0px 4px 4px var(--theme-color-accent-mid);

		user-select: none;
		-webkit-user-select: none;

		margin-bottom: 6px;
	}

	.button:active {
		background-color: var(--theme-color-accent-low);
	}

	div {
		height: 35px;
	}
</style>