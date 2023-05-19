<script lang="ts">
	import notify from "$lib/notify";
	import { NotificationType } from "$lib/types";
	import { onMount } from "svelte";

    onMount(() => {
        notify('No Messaging Yet', `We haven't had time yet to make this part of viper. It will come sometime in the future.`, 6, NotificationType.Msg);
    })
</script>

<main class="center">
    <h2>Messages</h2>
</main>
