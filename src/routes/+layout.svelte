<script lang="ts">
    export const prerender = true;
    
    import Navbar from '$lib/components/Navbar.svelte';
	import supabase from '$lib/supabase';
	import { onMount } from 'svelte';

    let page  = '';
    let showNav = false;

    onMount(() => {
        page = window.location.href.split('/')[window.location.href.split('/').length-1];
        setInterval(() => {
            page = window.location.href.split('/')[window.location.href.split('/').length-1].split('?')[0];
            showNav = true;
        }, 10);
    });

    supabase.auth.onAuthStateChange((e) => {
        if(e == 'SIGNED_IN') {
            window.location.href = '/';
        }
    })
</script>

<svelte:head>
    <link rel="stylesheet" href="/global.css">
</svelte:head>

<slot/>

{#if !(page.includes('auth') || page.includes('login') || page.includes('signup')) && showNav}
<Navbar {page}/>
{/if}