<script lang="ts">
    const tabs = [
		'General',
		'Profile',
	];

    export let selected: boolean;
    export let tab: string;
</script>

<tabs>
    {#each tabs as t}
        <button on:click={() => {tab = t; selected = true}}>{t}</button>
    {/each}
</tabs>

<style>
    button:not(.small) {
		width: 400px;
	}

    tabs {
		display: flex;
		flex-direction: column;
		
		min-height: 43px;
		height: 100%;
	}
	
	tabs * {
		max-width: 250px;
	}
</style>