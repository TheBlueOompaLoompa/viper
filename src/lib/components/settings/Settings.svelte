<script lang="ts">
    export let width: number;
    export let tab: string;

    // Settings
    import Profile from './tabs/Profile.svelte';
    import General from './tabs/General.svelte';
</script>

<settings class={width > 500 ? '' : 'single'}>
    <h1>{tab}</h1>
    <div>
    {#if tab == 'Profile'}
        <Profile />
    {:else if tab == 'General'}
        <General />
    {/if}
    </div>
</settings>

<style>
    settings {
		min-height: 43px;
		height: 100%;
	}

    settings.single {
        width: 100vw;
        margin-left: 10px;
        margin-right: 10px;
    }

    div {
        padding-top: 25px;
    }

    settings.single h1 {
        position: absolute;
        top: -3px;
        left: 50%;
        right: 50%;
        width: 0px;

        display: flex;
        justify-content: center;

        margin: 0px;
        margin-top: 5px;
    }
</style>