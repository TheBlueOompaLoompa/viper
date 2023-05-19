<script lang="ts">
    import { XSquare } from 'svelte-bootstrap-icons';
    import { Notifications } from '$lib/stores';
    import { fade, fly } from 'svelte/transition';
	import type { Notification } from '$lib/types';
	import { onMount } from 'svelte';

    let notifications: Notification[] = [];

    Notifications.subscribe(v => notifications = v);

    onMount(() => {
        const timeFrac = .01;
        setInterval(() => {
            for(let i = 0; i < notifications.length; i++) {
                notifications[i].timer -= timeFrac;
                if(notifications[i].timer <= 0) {
                    close(i)
                }
            }
        }, 1000*timeFrac);
    });

    function close(i: number) {
        notifications.splice(i)
        Notifications.set(notifications);
    }
</script>

<notifications>
    {#each notifications as {type, title, body, start, timer}, i}
    <notification class="{type}" transition:fly="{{ x: 200, duration: 200 }}">
        <div class="close" on:click={() => close(i)} on:keypress={() => close(i)}><XSquare/></div>
        <h4>{title}</h4>
        <p>{body}</p>
        <timer style="width: {timer/start*100}%" transition:fade="{{ delay: 200, duration: 200 }}"/>
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
        overflow: hidden;
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

    notification timer {
        position: absolute;
        right: 0px;
        bottom: calc(.7rem + .5rem);
        display: block;

        height: .2rem;
        border-radius: .2rem;

        background-color: var(--theme-color-accent-top);
    }
</style>