<script>
	import WideButton from '../components/WideButton.svelte';
	import Loading from '../components/Loading.svelte';
	import supabase from '$lib/db';

	let username = '';
	let loading = false;

	async function onFinish() {
		if(username.length < 4 || username.length > 32){
			alert('Usernames have to be between 4 and 32 characters!');
			return;
		}
		
		loading = true;
		const { data, error } = await supabase
			.from('users')
			.select('*');

		let exists = false;
		let alreadySetup = false;

		const user = supabase.auth.user();

		data.forEach(usr => {
			exists = usr['username'] == username || exists;
			alreadySetup = usr['id'] == user || alreadySetup;
		});
		if(exists) {
			alert('Someone already has that username!');
			loading = false;
			return;
		}
		if(alreadySetup) {
			alert('You already setup your account!');
			window.location.href = '/';
			return;
		}

		await supabase
			.from('users')
			.insert([{ id: user.id, username }]);

		window.location.href = '/';

		console.log(data);
	}
</script>

<div class="center" style="flex-direction: column;">
	<h2>Setup</h2>
	<div class="center-control">
		<input type="text" class="w-wide" placeholder="Username eg. Snakelover42" bind:value={username}>
		<shift>
			<WideButton text="Finish" on:click={onFinish} />
		</shift>
	</div>
</div>

<style>
	shift {
		display: flex;
		flex-direction: row;
		justify-content: center;

		width: 100%;
		margin-top: 30px;
	}
</style>