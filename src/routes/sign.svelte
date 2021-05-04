<script lang="ts">
	import Back from "svelte-bootstrap-icons/lib/ChevronLeft";

	import WideButton from "../components/WideButton.svelte";
	import Loading from '../components/Loading.svelte';

	import supabase from '$lib/db';

	let authStage = supabase.auth.user() ? 'logout' : 'viper';
	function changeAuthStage(stage: string) {
		authStage = stage;
	}

	let email: string;
	let password: string;

	let loading = false;

	async function signUp() {
		loading = true;
		let { user, error } = await supabase.auth.signUp({
			email,
			password,
		}, { redirectTo: '/setup' });
		loading = false;
		alert('Check your email for a confirmation email to continue setup.');
	}

	async function signIn() {
		loading = true;
		const { user, error } = await supabase.auth.signIn({
			email,
			password,
		});
	}

	async function signOut() {
		loading = true;
		const error = (await supabase.auth.signOut())['error'];
		if(!error) authStage = 'viper';
		else alert('ERROR: Unable to logout')
	}
</script>

<Loading fullscreen={true} loading={loading} />

<div class="center" style="flex-direction: column;">
	
	<h1>{authStage.toUpperCase()}</h1>
	{#if authStage == 'viper'}
		<p style="width:100%; text-align:center;">Viper is a privacy focused social media app for everyone</p>
	{/if}
	<div class="center-control">
		{#if authStage == 'viper'}
			<WideButton text="Register" on:click={() => {changeAuthStage('register')}} style="margin-bottom: 40px;"></WideButton>
			<WideButton text="Login" on:click={() => {changeAuthStage('login')} }></WideButton>
		{:else if authStage == 'register'}
		<h4>Email</h4>
		<input type="email" placeholder="python@snakemail.com" class="w-wide" bind:value={email}>
		<h4>Password</h4>
		<input type="password" class="w-wide" bind:value={password}>
		<WideButton text="Register" on:click={signUp}></WideButton>
		{:else if authStage == 'login'}
			<h4>Email</h4>
			<input type="email" placeholder="python@snakemail.com" class="w-wide" bind:value={email}>
			<h4>Password</h4>
			<input type="password" class="w-wide" bind:value={password}>
			<WideButton text="Login" on:click={signIn}></WideButton>
		{:else if authStage == 'logout'}
			<WideButton text="Logout" on:click={signOut}></WideButton>
			<div class="bi-chevron-left" on:click={() => {window.history.back();}}><Back /></div>
		{/if}
	</div>
</div>

<style>
	input {
		margin-bottom: 30px;
	}
</style>
