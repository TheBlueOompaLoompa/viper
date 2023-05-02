<script lang="ts">
    import { Fonts, Image, CameraVideo, People } from 'svelte-bootstrap-icons';
	export let value = 'text';
    
    function setValue(val: string) {
        value = val;
    }
</script>

<div>
	<div class="type {value == 'text' ? 'selected' : ''}"
        on:click={() => setValue('text')}
        on:keypress={() => setValue('text')}>
        <Fonts/>
	</div>
	<div class="type {value == 'image' ? 'selected' : ''}" 
        on:click={() => setValue('image')}
        on:keypress={() => setValue('image')}>
		<Image/>
	</div>
	<div class="type {value == 'video' ? 'selected' : ''}"
        on:click={() => setValue('video')}
        on:keypress={() => setValue('video')}>
		<CameraVideo/>
	</div>
	<div class="type {value == 'group' ? 'selected' : ''}"
        on:click={() => setValue('group')}
        on:keypress={() => setValue('group')}>
		<People/>
	</div>
</div>

<style>
	div {
		display: flex;
		padding: 3px;
		border-radius: 6px;
		margin-bottom: 2px;
	}
	.type {
		width: 30px;
		align-items: center;
		justify-content: center;
	}

    .selected {
        border: solid 2px rgb(20 83 45);
        background-color: rgb(134 239 172);;
    }
</style>
