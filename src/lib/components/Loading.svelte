<script lang="ts">
    export let fullscreen = false;
</script>

<div class={fullscreen ? 'fullscreen' : ''}>
    <img src="/load.svg" alt="Loading">
</div>

<style>
    .fullscreen {
        position: absolute;

        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;

        z-index: 99999999;
        background-color: var(--theme-color-background);

        display: flex;
        align-items: center;
        justify-content: center;
    }

    img {
        animation-duration: 2s;
        animation-iteration-count: infinite;
        animation-name: spin;
        animation-timing-function: linear;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }
</style>