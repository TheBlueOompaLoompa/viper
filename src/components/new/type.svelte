<script lang="ts">
	import Fonts from 'svelte-bootstrap-icons/lib/Fonts';
	import Image from 'svelte-bootstrap-icons/lib/Image';
	import CameraVideo from 'svelte-bootstrap-icons/lib/CameraVideo';
	import People from 'svelte-bootstrap-icons/lib/People';

	export let value = 'text';
</script>

<div>
	<div class="type {value == 'text' ? 'bg-green-300 border-green-900 border-2' : ''}">
		<Fonts
			on:click={() => {
				value = 'text';
			}}
		/>
	</div>
	<div class="type {value == 'image' ? 'bg-green-300 border-green-900 border-2' : ''}">
		<Image
			on:click={() => {
				value = 'image';
			}}
		/>
	</div>
	<div class="type {value == 'video' ? 'bg-green-300 border-green-900 border-2' : ''}">
		<CameraVideo
			on:click={() => {
				value = 'video';
			}}
		/>
	</div>
	<div class="type {value == 'group' ? 'bg-green-300 border-green-900 border-2' : ''}">
		<People
			on:click={() => {
				value = 'group';
			}}
		/>
	</div>
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
</style>
