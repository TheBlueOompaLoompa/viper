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

	async function signInWithGoogle() {
		loading = true;
		const { error } = await supabase.auth.signIn({
			provider: 'google'
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
			<Button wide={true} text="Login with Google" on:click={signInWithGoogle} />
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

<style>
	input {
		margin-bottom: 30px;
	}
</style>
