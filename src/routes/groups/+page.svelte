<script lang="ts">
	import supabase from "$lib/supabase";
    import Button from "$lib/components/Button.svelte";
    import Posts from "$lib/components/Posts.svelte";
	import { onMount } from "svelte";
	import notify from "$lib/notify";
	import { NotificationType } from "$lib/types";
	import Loading from "$lib/components/Loading.svelte";

    let groups: any = [];
    let isGroup = false;
    let groupName = '';
    let loading = false;

    onMount(async () => {
        console.log(location.href)
        if(location.href.includes('id=')) {
            isGroup = true;
            groupName = decodeURI(location.href.split('id=')[1]);
        }else {
            loading = true;

            const { data, error } = await supabase
                .from('groups')
                .select('*');

            loading = false;
            
            if(!error) {
                groups = data;
            }else {
                notify('Failed to Load Groups!', 'The groups couldn\'t be loaded to list out.', NotificationType.Err);
            }
        }
    });

    function goto(id: string) {
        location.href = `/groups?id=${encodeURI(id)}`;
    }
</script>

<main class="center" style="flex-direction: column;">
    {#if !isGroup}
        <h2>Groups</h2>
        {#if loading}
        <Loading/>
        {/if}
        {#each groups as group}
        <Button text={group.id} wide={true} on:click={() => goto(group.id)}/>
        {/each}
    {:else}
        <h2>{groupName}</h2>
        <Posts filter="group"/>
    {/if}
</main>