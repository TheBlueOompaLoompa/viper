<script lang="ts">
    import Switch from "$lib/components/Switch.svelte";
	import { THEME } from "$lib/settings";

    let theme = false;
    THEME.subscribe(val => theme = (val == 'dark'));
    $: THEME.set(theme ? 'dark' : 'light');
</script>

<main class="center">
    <h2>Settings</h2>
    <Switch bind:value={theme}/>
</main>

<style>
    main {
        flex-direction: column;
    }
</style>