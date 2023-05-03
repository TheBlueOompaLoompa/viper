<script lang="ts">
	import { ImagePostCount, NameCache, PostsLoaded } from "$lib/stores";
	import supabase from "$lib/supabase";
	import type { PostData, UserData } from "$lib/types";
	import { onMount } from "svelte";
	import PostContext from "$lib/components/PostContext.svelte";
	import PostTime from "$lib/components/PostTime.svelte";
    import { XSquare } from 'svelte-bootstrap-icons';

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
            post.content = src;
            PostsLoaded.update(val => {
                return val + 1;
            })
        }
    });

    let explode = false;
</script>

<post class="feed-item">
    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
        <h5 style="margin-bottom: 10px; margin-top: 6px; text-align: left; margin-right: 5%;" on:click={() => window.location.href = `/post?p=${post.id}`} on:keypress={() => window.location.href = `/post?p=${post.id}`}>{post.title}</h5><PostContext {post}/>
    </div>
    <a href="/profile?id={post.uid}"><span class="gray">@{username}</span></a>
    {#if post.type == 0}
    <p>{post.content}</p>
    {:else if post.type == 1}
    <div style="display: flex; justify-content: center; align-items: center; overflow: hidden; border-radius: 6px;">
    <img {src} on:click={() => explode = true} on:keypress={() => explode = true}>
    </div>
    {/if}
    <PostTime timestamp={post.timestamp} />
</post>

{#if explode}
<div class="explode">
    <div class="close" on:click={() => explode = false} on:keypress={() => explode = false}><XSquare/></div>
    <img {src}>
</div>
{/if}

<style>
    @media (min-width: 700px) {
        post {
            margin-left: 2.5rem;
        }
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

    h5 {
        font-size: 1.25rem;
        margin: 0px;
    }

    div.explode {
        position: fixed;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;

        display: flex;
        justify-content: center;
        align-items: center;
        
        background-color: rgba(0, 0, 0, 0.6);
    }

    div.explode .close {
        position: fixed;
        top: 1rem;
        right: 1rem;

        background-color: var(--theme-color-accent-mid);
		border-style: solid;
		border-color: var(--theme-color-outline);
		border-width: 1px;
		border-radius: 3px;

        display: flex;
        justify-content: center;
        align-items: center;

        width: 2rem;
        height: 2rem;

		box-shadow: 0px 1px 4px var(--theme-color-accent-mid);
    }

    div.explode img {
        max-width: calc(100% - 2.5rem);
        max-height: calc(100% - 2.5rem);
        margin-bottom: 2.5rem;
    }

    @media (min-width: 700px) {
        div.explode img {
            margin-left: 2.5rem;
            margin-bottom: 0rem;
        }
    }

    @media (min-width: 1000px) {
        div.explode img {
            max-width: calc(100% - 8rem);
            margin-left: 8rem;
        }
    }
</style>