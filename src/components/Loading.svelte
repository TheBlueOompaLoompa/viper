<script>
	export let fullscreen = false;
	export let loading = false;
</script>


{#if loading}
{#if fullscreen}
<div class="center fullscreen" style="flex-direction: column;">
	<div class="center fullscreen" style="flex-direction: row;">
		<img src="load.svg" alt="loading">
	</div>
</div>
{:else}
<div class="center" style="flex-direction: column;">
	<div class="center" style="flex-direction: row;">
		<img src="load.svg" alt="loading">
	</div>
</div>
{/if}
{/if}


<style>
	div.fullscreen {
		position: absolute;
		top: 0px;
		bottom: 0px;
		left: 0px;
		right: 0px;
		width: 100%;
		height: 100%;
		background-color: var(--theme-color-background);
		z-index: 1;
	}

	@-moz-keyframes spin { 100% { -moz-transform: rotate(-360deg); } }
	@-webkit-keyframes spin { 100% { -webkit-transform: rotate(-360deg); } }
	@keyframes spin { 100% { -webkit-transform: rotate(-360deg); transform:rotate(-360deg); } }

	img {
		color: var(--theme-color-font);
		-webkit-animation:spin 4s linear infinite;
		-moz-animation:spin 4s linear infinite;
		animation:spin 4s linear infinite;
	}
</style>