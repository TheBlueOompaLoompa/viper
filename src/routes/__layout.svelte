<script lang="ts">
	import * as cookie from 'cookie';
	import { onMount } from 'svelte';
	import { themeStore } from '$lib/stores';

	import Navbar from '$lib/components/Navbar.svelte';	

	function themeCookie(theme: string) {
		if(theme == '1') {
			document.cookie = 'theme=dark; SameSite=Lax; Secure;';
		}else if(theme == '2') {
			document.cookie = 'theme=white; SameSite=Lax; Secure;';
		}
	}

	onMount(() => {
		if (localStorage.getItem('user') && cookie.parse(document.cookie)['verified'] === 'false') {
			window.location.href = '/login';
		}

		let theme = localStorage.getItem('theme');
		themeStore.set(theme ? parseInt(theme) : 0);

		themeStore.subscribe(value => {
			theme = value.toString();
			themeCookie(theme);
		});

		themeCookie(theme);
		

		if(theme == null) {
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				document.cookie = 'theme=dark; SameSite=Lax; Secure;';
			}else {
				document.cookie = 'theme=white; SameSite=Lax; Secure;';
			}
		}

		setInterval(() => {
			if(window.location.href.startsWith('/profile') && !localStorage.getItem('user')) {
				window.location.href = '/login';
			}
		}, 100);
	});
</script>

<slot></slot>

<Navbar />