<script lang="ts">
	import supabase from '$lib/supabase';
	import { onMount } from 'svelte';
    import Posts from '$lib/components/Posts.svelte';
	import { NameCache } from '$lib/stores';

    let filterValue = '';
    let username = '';

    onMount(async () => {
        {
            const { data, error } = await supabase.auth.getSession()
            if(data.session == null) {
                window.location.href = '/auth';
            }
        }

        let names: any = {};
        
        NameCache.subscribe(data => {
            names = data;
            console.log(names)
            username = names[window.location.search.split('id=')[1]];
        });
    })
</script>

<outer>
    <h2>@{username}</h2>
    <Posts filter="profile"/>
</outer>

<style>
    outer {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>