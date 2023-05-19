<script lang="ts">
    import Navbar from '$lib/components/Navbar.svelte';
    import Notifications from '$lib/components/Notifications.svelte';
	import { THEME, initSettings } from '$lib/settings';
	import supabase from '$lib/supabase';
	import { onMount } from 'svelte';

    let page  = '';
    let showNav = false;
    let theme = '';


    onMount(() => {
        page = window.location.pathname.split('/')[window.location.pathname.split('/').length-1];
        setInterval(() => {
            page = window.location.pathname.split('/')[window.location.pathname.split('/').length-2].split('?')[0];
            showNav = true;
        }, 10);
        initSettings();

        THEME.subscribe(val => theme = val);
    });

    supabase.auth.onAuthStateChange((e) => {
        if(e == 'SIGNED_IN') {
            window.location.href = '/';
        }
    })
</script>

<svelte:head>
    <link rel="stylesheet" href="/global.css">
    {#if theme == 'light'}
    <link rel="stylesheet" href="/light-theme.css">
    {:else}
    <link rel="stylesheet" href="/dark-theme.css">
    {/if}
</svelte:head>

<Notifications/>

<slot/>

{#if !(page.includes('auth') || page.includes('login') || page.includes('signup')) && showNav}
<Navbar {page}/>
{/if}