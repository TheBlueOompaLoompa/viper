<script lang="ts">
	import Loading from '$lib/components/Loading.svelte';
	let loading = false;

    async function logout() {
		loading = true;
		console.log('Logout')
		const { auth } = await import('../../../../firebase');
		await auth.signOut();
		let temp: any;
		try {
			Object.assign(temp, auth.currentUser);
			temp.stsTokenManager.accessToken = null;
		} catch (error) {
			
		}

		var cookies = document.cookie.split(";");

		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			var eqPos = cookie.indexOf("=");
			var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		}

		localStorage.removeItem('user');
		location.href = '/';
	}
</script>

{#if loading}
<Loading fullscreen={true} />
{/if}
<center>
	<button id="logout" class="small" on:click={logout}>Logout</button>
</center>

<style>
	center {
		height: 100%;
		margin-top: 15px;
	}
</style>