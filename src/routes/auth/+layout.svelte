<script>
	import supabase from "$lib/supabase";
	import { onMount } from "svelte";

    onMount(async() => {
        const { data, error } = await supabase.auth.getSession()

        if(data != null) location.href = '/';
    });
</script>

<svelte:head>
    <link rel="stylesheet" href="/global.css">
    <link rel="stylesheet" href="/auth.css">
</svelte:head>

<slot/>