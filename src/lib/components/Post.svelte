<script lang="ts">
    export let title: string;
    export let uid: string;
    export let username: string;
    export let content: string;
    export let timestamp: number;

    import { createFuzzyDate } from '$lib/dateProcessor';

    const ImageRegex = /src="(data:image\/[^;]+;base64[^"]+)"/i;
</script>

<post>
    <span>{title}</span>
    <a href="/profile?uid={uid}">@{username}</a>

    {#if ImageRegex.exec(content)}
        <div>
            <img src={content} alt="Post Content">
        </div>
    {:else}
        <p>{content}</p>
    {/if}

    <timestamp>Posted {createFuzzyDate(timestamp)}</timestamp>
</post>

<style>
    post {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;

        display: flex;
        flex-direction: column;
        align-items: flex-start;

		width: 88%;
		max-width: 700px;
		border: 1px solid var(--theme-color-outline);
		border-radius: 6px;
		margin-bottom: 30px;
		box-shadow: 0px 4px 4px var(--theme-color-accent-mid);
		overflow: hidden;
		padding: 8px;
    }

    post *:not(img) {
        width: 100%;
        text-align: left;
    }

    img, div:has(img) {
        border-radius: 6px;
    }

    div:has(img) {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    a, a:link, a:visited, a:hover, a:active {
        text-decoration: none;
        color: var(--theme-color-font-alt);
        margin-top: 3px;
    }

    p {
        margin: 15px 0px 15px 10px;
    }

    timestamp {
        color: var(--theme-color-font-alt);
        font-size: small;
    }
</style>