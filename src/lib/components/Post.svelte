<script lang="ts">
	import { ImagePostCount, NameCache, PostsLoaded } from "$lib/stores";
	import supabase from "$lib/supabase";
	import type { PostData, UserData } from "$lib/types";
	import { onMount } from "svelte";
	import PostContext from "$lib/components/PostContext.svelte";
	import PostTime from "$lib/components/PostTime.svelte";

    export let post: PostData;

    let src = '';
    let username = '';

    onMount(async () => {
        let names: any = {};

        NameCache.subscribe(data => {
            names = data;
        })

        if(post.type == 1) ImagePostCount.update(val => val + 1);

        if(Object.keys(names).includes(post.uid)) {
            username = names[post.uid];
        }else {
            const { data: userArr, error } = await supabase.from('users').select('*').eq('id', post.uid);
            if(!error) {
                const user: UserData = userArr[0] as UserData;
                username = user.username;
                names[post.uid] = username
                NameCache.set(names);
            }
        }
        

        // Load Images
        if(post.type == 1) {
            const { data, error } = await supabase.storage.from('media').download(post.id);
            if(error) {
                console.error(error);
                return;
            }
            src = window.URL.createObjectURL(data);
            PostsLoaded.update(val => {
                return val + 1;
            })
        }
    });
</script>

<post>
    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
        <h5 style="margin-bottom: 10px; margin-top: 6px; text-align: left; margin-right: 5%;">{post.title}</h5><PostContext {post}/>
    </div>
    <a href="/profile?id={post.uid}"><span class="gray">@{username}</span></a>
    {#if post.type == 0}
    <p>{post.content}</p>
    {:else if post.type == 1}
    <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; border-radius: 6px;">
    <img {src}>
    </div>
    {/if}
    <PostTime timestamp={post.timestamp} />
</post>

<style>
    post {
        display: flex;
        flex-direction: column;

        width: 88%;
        max-width: 700px;
        
        border: 1px solid var(--theme-color-outline);
        border-radius: 6px;

        margin-bottom: 30px;

        box-shadow: 0 4px 4px var(--theme-color-accent-mid);
        overflow: hidden;

        --padding: 8px;
		padding-left: var(--padding);
		padding-right: var(--padding);
		padding-bottom: var(--padding);
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
    }

    img {
        display: block;

        border-radius: 6px;
        max-width: 100%;
        height: auto;
    }

    a {
        text-decoration: none;
    }
</style>