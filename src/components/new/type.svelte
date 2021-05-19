<script lang="ts">
	import Fonts from 'svelte-bootstrap-icons/lib/Fonts';
	import Image from 'svelte-bootstrap-icons/lib/Image';
	import CameraVideo from 'svelte-bootstrap-icons/lib/CameraVideo';
	import People from 'svelte-bootstrap-icons/lib/People';

	export let value = 'text';
</script>

<div>
	{#if value == 'text'}
		<div class="bg-green-300 border-green-900 border-2">
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
		<div class="bg-green-300 border-green-900 border-2">
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
		<div class="bg-green-300 border-green-900 border-2">
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
	{#if value == 'group'}
		<div class="bg-green-300 border-green-900 border-2">
			<People
				on:click={() => {
					value = 'group';
				}}
			/>
		</div>
	{:else}
		<div class="type">
			<People
				on:click={() => {
					value = 'group';
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
		width: 30px;

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
