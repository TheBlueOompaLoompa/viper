<script lang="ts">
	import Post from "$lib/components/Post.svelte";
	import supabase from "$lib/supabase";
	import type { PostData } from "$lib/types";
	import { onMount } from "svelte";

    let post: PostData;

    onMount(async () => {
        const id = window.location.search.split('p=')[1];

        const { data, error } = await supabase.from('posts')
            .select('*')
            .eq('id', id);

        if(!error) {
            post = data[0] as PostData;
        }
    })
</script>

{#if post}
<main>
    <Post {post}/>
</main>
{/if}

<style>
    main {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>