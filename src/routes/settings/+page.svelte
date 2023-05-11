<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import Switch from '$lib/components/Switch.svelte';
	import { THEME } from "$lib/settings";
	import supabase from '$lib/supabase';

    let settings: any[] = [
        ['switch', 'Theme' , false, 'Dark', 'Light'],
        ['button', 'Sign Out', signOut]
    ];

    async function signOut() {
        await supabase.auth.signOut();
    }

    THEME.subscribe(val => settings[0][2] = (val == 'dark'));
    $: THEME.set(settings[0][2] ? 'dark' : 'light');
</script>

<main class="center" style="flex-direction: column;">
    <h2>Settings</h2>
    <div class="settings">
    {#each settings as item}
        {#if item[0] != 'button'}
        <row>
            <h4>{item[1]}</h4>
            {#if item[0] == 'switch'}
            <Switch bind:value={item[2]}/>
            <p>{item[2] ? item[3] : item[4]}</p>
            {/if}
        </row>
        {:else}
        <Button on:click={item[2]} text={item[1]} wide={true} style="margin-top: 1rem;" />
        {/if}
    {/each}
    </div>
</main>

<style>
    div.settings {
        display: flex;
        flex-direction: column;
        align-items: center;

        width: 85%;
        max-width: 300px;
    }

    div.settings row {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        background-color: rgb(127, 127, 127, .2);
        border-radius: var(--rounding);
        padding: 1rem;
    }

    h4, p {
        margin: 0px;
    }

    .settings h4 {
        justify-self: start;
        margin-right: auto;
    }

    p {
        margin-left: 1rem;
    }
</style>