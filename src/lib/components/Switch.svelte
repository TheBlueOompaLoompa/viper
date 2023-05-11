<script lang="ts">
    export let value = false;
</script>

<background class="hover-rotate {value ? 'active' : ''}" on:click={() => value = !value} on:keypress={() => value = !value}>
    <handle></handle>
</background>

<style>
    background, handle {
        --height: 1.5rem;
        --switch-time: .2s;
    }

    background {
        display: flex;
        align-items: center;
        justify-content: start;

        background-color: white;
        border: 1px solid var(--theme-color-accent-mid);

        width: 3.5rem;

        border-radius: calc(var(--height)  / 2);
        height: var(--height);
        transition: background-color var(--switch-time);
    }

    handle {
        --padding: .2rem;
        width: calc(var(--height) - var(--padding));
        height: calc(var(--height) - var(--padding));
        background-color: white;

        margin-left: calc(var(--padding)/2);
        margin-right: calc(var(--padding)/2);
        border: 1px solid var(--theme-color-accent-mid);
        border-radius: calc((var(--height) - (var(--padding)/2)) / 2);
        box-shadow: 0px 0px 4px var(--theme-color-accent-mid);

        z-index: 2;

        transition: transform var(--switch-time);
    }

    background.active {
        background-color: var(--theme-color-accent-mid);
    }

    background.active handle {
        position: absolute;
        transform: translateX(calc(150% - var(--padding)));
    }
</style>