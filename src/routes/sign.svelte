<script>
	import WideButton from "../components/WideButton.svelte";
</script>

<div class="center" style="flex-direction: column;">
	<h1>VIPER</h1>
	<p>Viper is a privacy focused social media app for everyone</p>

	<div id="button-container">
		<WideButton text="Register" style="margin-bottom: 40px;"></WideButton>
		<WideButton text="Login"></WideButton>
	</div>
</div>

<style>
	@media (max-width: 800px) {
		#button-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: end;

			max-width: 400px;
			width: 100%;

			position: fixed;

			bottom: 35px;
		}
	}

	@media (min-width: 800px) {
		#button-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			max-width: 400px;
			width: 100%;
			bottom: 0px;

			height: 100%;

			position: absolute;
		}
	}
</style>