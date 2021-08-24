<script lang="ts">
	import { onMount } from 'svelte';

	import Navbar from '../components/Navbar.svelte';	

	onMount(() => {
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			document.cookie = 'theme=dark';
		}else {
			document.cookie = 'theme=white';
		}
	});
</script>

<slot></slot>

<Navbar />