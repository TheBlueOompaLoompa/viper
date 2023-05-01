<script lang="ts">
	import { NameCache } from "$lib/stores";
	import supabase from "$lib/supabase";
	import type { PostData, UserData } from "$lib/types";
	import { onMount } from "svelte";

    export let post: PostData;

    let src = '';
    let username = '';

    onMount(async () => {
        let names = {};

        NameCache.subscribe(data => {
            names = data;
        })
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
        }
    });
</script>

<post>
    <h5>{post.title}</h5>
    <a href="/profile?id={post.uid}"><span class="gray">@{username}</span></a>
    {#if post.type == 0}
    <p>{post.content}</p>
    {:else if post.type == 1}
    <img {src} alt="" srcset="">
    {/if}
</post>

<style>
    post {
        display: flex;
        flex-direction: column;
        width: 88%;
        max-width: 700px;
        max-height: 90vh;
        border: 1px solid var(--theme-color-outline);
        border-radius: 6px;
        margin-bottom: 30px;
        box-shadow: 0 4px 4px var(--theme-color-accent-mid);
        overflow: hidden;

        padding: var(--padding-space);
    }

    img {
        max-width: 100%;
        margin-left: auto;
        margin-right: auto;
        border-radius: var(--image-radius);
        align-self: center;
    }

    a {
        text-decoration: none;
    }
</style>