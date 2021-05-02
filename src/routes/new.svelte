<script>
	import Type from "../components/new/type.svelte";

	import Dropzone from "svelte-file-dropzone";
	import WideButton from "../components/WideButton.svelte";

	import supabase from '$lib/db';

	let iFiles = {	// Image files
		accepted: [],
		rejected: []
	};

	let vFiles = {	// Video files
		accepted: [],
		rejected: []
	};

	let type = 'text';

	let title = '';
	let body =  '';

	let images = [];
	
	let isVideoUploaded = false;

	let videoElement = { setAttribute: (a, b)=>{}, removeAttribute: (a)=>{} };

	function handleImageFilesSelect(e) {
		const { acceptedFiles, fileRejections } = e.detail;
		iFiles.accepted = [...iFiles.accepted, ...acceptedFiles];
		iFiles.rejected = [...iFiles.rejected, ...fileRejections];
		
		for(let i = 0; i < acceptedFiles.length; i++){
			var reader  = new FileReader();
			reader.onload = function(ev){
				images = [ev.target.result, ...images];
				console.log(images)
			}

			reader.readAsDataURL(acceptedFiles[i]);
		}
	}

	function handleVideoFilesSelect(e) {
		const { acceptedFiles, fileRejections } = e.detail;
		vFiles.accepted = [...vFiles.accepted, ...acceptedFiles];
		vFiles.rejected = [...vFiles.rejected, ...fileRejections];

		console.log(vFiles.accepted.length < 1)

		videoElement.src = window.URL.createObjectURL(acceptedFiles[0]);

		isVideoUploaded = true;
		console.log(!isVideoUploaded)
		setTimeout(() => {
			videoElement.setAttribute('controls', '');
		}, 1000);
	}

	function reset(){
		setTimeout(() => {
			try{
				isVideoUploaded = false;
				videoElement.removeAttribute('controls');

				vFiles = {
					accepted: [],
					rejected: []
				};
			}catch(e){}
		}, 50);
	}
	$: if(type == 'video'){
		reset();
	}

	async function post(){
		console.log(type)
		switch(type){
			case 'text':
				await supabase.from('posts').insert([{ title, content: body, type: 0}]);
				break;
			case 'image':
				const { data, error } = await supabase.from('posts').insert([{ title, content: body, type: 1}]);
				await supabase
					.storage
					.from('media')
					.upload(data[0]['id'], iFiles.accepted[0]);
				break;
		}

		window.location.href = '/';
	}
</script>

<div class="center" style="flex-direction: column;">
	<div id="postbox">
		<div class="left"><Type bind:value={type} /></div>
		<div class="left" id="marker">Title</div>
		<input type="text" bind:value={title}>

		{#if type == 'text'}

			<div class="left" id="marker">Body</div>
			<textarea style="width: 95%; resize:none;" rows=3 bind:value={body}></textarea>

		{:else if type == 'image'}

			<div class="left" id="marker">Photos</div>
			<Dropzone accept={'image/*'} on:drop={handleImageFilesSelect} />
			
			{#each images as image}
				<!-- svelte-ignore a11y-missing-attribute -->
				<img src={image}>
			{/each}

		{:else}

			{#if !isVideoUploaded}
				<div class="left" id="marker">Video</div>
				<Dropzone accept={'video/*'} on:drop={handleVideoFilesSelect} />
			{/if}
			<!-- svelte-ignore a11y-media-has-caption -->
			<video bind:this={videoElement} controls={vFiles.accepted.length > 0}></video>
		{/if}
	</div>
</div>

<div style="display: flex; justify-content: center; position:fixed; bottom: 60px; width: 100%;">
	<WideButton text="Post" on:click={post}></WideButton>
</div>

<style>
	#postbox {

		margin-top: 10px;

		border-width: 1px;
		border-style: solid;
		border-radius: 6px;
		border-color: var(--theme-color-outline);

		width: 90%;
		max-width: 800px;
		padding: 5px;
		
		margin-bottom: 50px;
	}
	
	textarea {
		margin-bottom: 7px;
	}

	input {
		margin-bottom: 7px;
		width: 95%;
		height: 20px;
	}

	.left {
		width: 98%
	}

	#marker {
		color: var(--theme-font-gray);
	}

	img {
		width: 90%;
		margin: 5%;
	}

	video {
		width: 90%;
		margin: 5%;
	}
</style>