<script lang="ts">
    import Post from "$lib/components/Post.svelte";
	import { ImagePostCount, PostsLoaded } from "$lib/stores";
    import supabase from "$lib/supabase";
	import type { PostData } from "$lib/types";
	import { onMount } from "svelte";

    export let filter = '';

    let posts: PostData[] = [];

    const PostLoadCount = 10;

    let currentLatestPost = 0;

    let checkInterval = -1;

    let loaded = 0;
    let imagePosts = 0;

    ImagePostCount.subscribe(val => {
        imagePosts = val;
    })
    
    PostsLoaded.subscribe(val => {
        loaded = val;
    });

    let loading = false;

    async function scrollLoad() {
        loading = true;

        clearInterval(checkInterval);
        const request = supabase
            .from('posts')
            .select('*')
            .range(currentLatestPost, currentLatestPost + PostLoadCount - 1)
            .order('timestamp', { ascending: false });

        if(filter == 'profile') {
            request.eq('uid', window.location.search.split('id=')[1]);
        }else if(filter == 'group') {
            request.eq('group_id', window.location.search.split('id=')[1]);
        }

        const { data, error } = await request;

        if(!error) {
            posts = posts.concat(data as PostData[]);

            currentLatestPost += PostLoadCount;
            loading = false;
        }
    }

    onMount(() => {
        scrollLoad();

        window.onscroll = () => {
            if(document.querySelector('main')?.getBoundingClientRect().height < window.scrollY + window.innerHeight + 10 && !loading) {
                scrollLoad();
            }
        }
    })
</script>

<main>
    {#each posts as post}
    <Post {post}/>
    {/each}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;

        width: 100%;
    }
</style>