<script lang="ts">
    export let fullscreen = true;

    let stage = 0;
    let dots = '';

    setInterval(() => {
        stage += 1;
        dots += '.';
        if(stage > 3) {
            dots = ''
            stage = 0;
        }
    }, 500)
</script>

<loading class={fullscreen?'full':''}>
    <img src='/Loading.svg' alt="loading" draggable="false">
    <span>Loading{dots}</span>
</loading>

<style>
    img {
        width: 200px;
    }

    loading.full {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        position: absolute;

        top: 0;
        bottom: 0;
        right: 0;
        left: 0;

        z-index: 99999999;

        background-color: var(--theme-color-background);
    }

    span {
        color: var(--theme-color-font-alt);        
    }

    img, span {
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -webkit-user-drag: none;
    }
</style>