<script lang="ts">
	import Fonts from 'svelte-bootstrap-icons/lib/Fonts';
	import Image from 'svelte-bootstrap-icons/lib/Image';
	import CameraVideo from 'svelte-bootstrap-icons/lib/CameraVideo';

	export let value = 'text';
</script>

<div>
	{#if value == 'text'}
		<div class="highlighted type">
			<Fonts
				on:click={() => {
					value = 'text';
				}}
			/>
		</div>
	{:else}
		<div class="type">
			<Fonts
				on:click={() => {
					value = 'text';
				}}
			/>
		</div>
	{/if}
	{#if value == 'image'}
		<div class="highlighted type">
			<Image
				on:click={() => {
					value = 'image';
				}}
			/>
		</div>
	{:else}
		<div class="type">
			<Image
				on:click={() => {
					value = 'image';
				}}
			/>
		</div>
	{/if}
	{#if value == 'video'}
		<div class="highlighted type">
			<CameraVideo
				on:click={() => {
					value = 'video';
				}}
			/>
		</div>
	{:else}
		<div class="type">
			<CameraVideo
				on:click={() => {
					value = 'video';
				}}
			/>
		</div>
	{/if}
</div>

<style>
	div {
		display: flex;
		padding: 3px;
		border-radius: 6px;

		margin-bottom: 2px;
	}

	.type {
		width: calc(6px + 16px);
		height: calc(6px + 16px);

		align-items: center;
		justify-content: center;
	}

	.highlighted {
		background-color: var(--theme-color-accent-low);

		border-style: solid;
		border-color: var(--theme-color-outline);
		border-width: 1px;
		color: black;
	}
</style>
