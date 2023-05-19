<script lang="ts">
    import { XSquare } from 'svelte-bootstrap-icons';
    import { Notifications } from '$lib/stores';
    import { fly } from 'svelte/transition';
	import type { Notification } from '$lib/types';

    let notifications: Notification[] = [];

    Notifications.subscribe(v => notifications = v);

    function close(i: number) {
        notifications.splice(i)
        Notifications.set(notifications);
    }
</script>

<notifications>
    {#each notifications as {type, title, body}, i}
    <notification class="{type}" transition:fly="{{ x: 200, duration: 500 }}">
        <div class="close" on:click={() => close(i)} on:keypress={() => close(i)}><XSquare/></div>
        <h4>{title}</h4>
        <p>{body}</p>
    </notification>
    {/each}
</notifications>

<style>
    notifications {
        display: flex;
        flex-direction: column;

        position: fixed;
        top: 3rem;
        right: 1rem;
        width: calc(100% - 2rem);
        max-width: 300px;

        overflow-y: auto;
        overflow-x: hidden;

        z-index: 999;
    }

    notification {
        box-shadow: 0px 2px 4px var(--theme-font-gray);
        background-color: var(--theme-font-gray);
        border-radius: var(--rounding);
        padding: 1rem;
        margin-bottom: .7rem;
    }

    notification .close {
        position: absolute;
        right: 1rem;
    }

    notification h4 {
        margin: 0px;
        max-width: calc(100% - 2rem);
    }

    notification p {
        margin: 0px;
        margin-top: 1rem;
    }

    notification.err {
        background-color: red;
        box-shadow: 0px 2px 4px red;
        color: rgb(255, 255, 255);
    }
</style>