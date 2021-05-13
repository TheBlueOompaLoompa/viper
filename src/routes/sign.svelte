<script lang="ts">
	import Back from 'svelte-bootstrap-icons/lib/ChevronLeft';

	import Button from '../components/Button.svelte';
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
		let { error } = await supabase.auth.signUp(
			{
				email,
				password
			},
			{ redirectTo: '/setup' }
		);
		loading = false;
		if (error) {
			alert('Sign up failed!');
		}
		alert('Check your email for a confirmation email to continue setup.');
	}

	async function signIn() {
		loading = true;
		const { error } = await supabase.auth.signIn({
			email,
			password
		});
		if (error) {
			alert('Sign in failed!');
		}
	}

	async function signOut() {
		loading = true;
		const error = (await supabase.auth.signOut())['error'];
		if (!error) authStage = 'viper';
		else alert('Unable to logout!');
	}
</script>

<Loading fullscreen={true} {loading} />

<div class="center" style="flex-direction: column;">
	<h1>{authStage.toUpperCase()}</h1>
	{#if authStage == 'viper'}
		<p style="width:100%; text-align:center;">
			Viper is a privacy focused social media app for everyone
		</p>
	{/if}
	<div class="center-control">
		{#if authStage == 'viper'}
			<Button
				wide={true}
				text="Register"
				on:click={() => {
					changeAuthStage('register');
				}}
				style="margin-bottom: 40px;"
			/>
			<Button
				wide={true}
				text="Login"
				on:click={() => {
					changeAuthStage('login');
				}}
			/>
		{:else if authStage == 'register'}
			<h4>Email</h4>
			<input type="email" placeholder="python@snakemail.com" class="w-wide" bind:value={email} />
			<h4>Password</h4>
			<input type="password" class="w-wide" bind:value={password} />
			<Button wide={true} text="Register" on:click={signUp} />
		{:else if authStage == 'login'}
			<h4>Email</h4>
			<input type="email" placeholder="python@snakemail.com" class="w-wide" bind:value={email} />
			<h4>Password</h4>
			<input type="password" class="w-wide" bind:value={password} />
			<Button wide={true} text="Login" on:click={signIn} />
		{:else if authStage == 'logout'}
			<Button wide={true} text="Logout" on:click={signOut} />
			<div
				class="bi-chevron-left"
				on:click={() => {
					window.history.back();
				}}
			>
				<Back />
			</div>
		{/if}
	</div>
</div>
<a href="https://github.com/TheBlueOompaLoompa/viper" target="_blank">
	<div
		style="position: fixed; bottom: 0px; width: 100%; display: flex; justify-content: center; align-items: center;"
	>
		<span class="linktext">View this project on github</span>
		<svg class="octicon" height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"
			><path
				fill-rule="evenodd"
				d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
			/></svg
		>
	</div>
</a>

<style>
	input {
		margin-bottom: 30px;
	}

	.linktext {
		color: cornflowerblue;
		margin-right: 20px;
	}

	.linktext:visited {
		color: cornflowerblue;
	}

	svg {
		filter: invert(1);
	}
</style>
