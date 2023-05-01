<script lang="ts">
    import Post from "$lib/components/Post.svelte";
    import supabase from "$lib/supabase";
	import type { PostData } from "$lib/types";
	import { onMount } from "svelte";

    let posts: PostData[] = [];

    onMount(async () => {
        const { data, error } = await supabase.from('posts').select('*').limit(10).order('timestamp', { ascending: false });

        if(!error) {
            posts = data as PostData[];
        }
    })
</script>

{#each posts as post}
    <Post {post}/>
{/each}