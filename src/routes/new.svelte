<script lang="typescript">
	import Type from '../components/new/type.svelte';

	import Dropzone from 'svelte-file-dropzone';
	import Button from '../components/Button.svelte';
	import Loading from '../components/Loading.svelte';

	import supabase from '$lib/db';

	let iFiles = {
		// Image files
		accepted: [],
		rejected: []
	};

	let vFiles = {
		// Video files
		accepted: [],
		rejected: []
	};

	let type = 'text';

	let title = '';
	let group = '';
	let body = '';

	let images = [];

	let isVideoUploaded = false;
	let isImageUploaded = false;

	let videoElement = {
		setAttribute: (a, b) => {
			console.log(a, b);
		},
		removeAttribute: (a) => {
			console.log(a);
		}
	};

	function handleImageFilesSelect(e) {
		const { acceptedFiles, fileRejections } = e.detail;
		iFiles.accepted = [...iFiles.accepted, ...acceptedFiles];
		iFiles.rejected = [...iFiles.rejected, ...fileRejections];

		for (let i = 0; i < acceptedFiles.length; i++) {
			var reader = new FileReader();
			reader.onload = function (ev) {
				images = [ev.target.result, ...images];
				console.log(images);
			};

			reader.readAsDataURL(acceptedFiles[i]);
		}

		isImageUploaded = true;
	}

	/*
	function handleVideoFilesSelect(e) {
		const { acceptedFiles, fileRejections } = e.detail;
		vFiles.accepted = [...vFiles.accepted, ...acceptedFiles];
		vFiles.rejected = [...vFiles.rejected, ...fileRejections];

		console.log(vFiles.accepted.length < 1);

		videoElement.src = window.URL.createObjectURL(acceptedFiles[0]);

		isVideoUploaded = true;
		setTimeout(() => {
			videoElement.setAttribute('controls', '');
		}, 1000);
	}
	*/

	function reset() {
		setTimeout(() => {
			try {
				isVideoUploaded = false;
				videoElement.removeAttribute('controls');

				vFiles = {
					accepted: [],
					rejected: []
				};
			} catch (e) {
				return e;
			}
		}, 50);
	}
	$: if (type == 'video') {
		reset();
	}

	let loading = false;

	async function post() {
		loading = true;

		let outval = {
			data: undefined,
			error: undefined
		};

		switch (type) {
			case 'text':
				await supabase
					.from('posts')
					.insert([{ title, content: body, type: 0, uid: supabase.auth.user().id, group }]);
				break;
			case 'image':
				outval = await supabase
					.from('posts')
					.insert([{ title, content: body, type: 1, uid: supabase.auth.user().id, group }]);
				if (outval.error) {
					alert('Failed to post');
				} else {
					outval = await supabase.storage
						.from('media')
						.upload(outval.data[0]['id'], iFiles.accepted[0]);
					if (outval.error) {
						alert('Failed to upload your image for the post. The image will be empty.');
					}
				}
				break;
			case 'group':
				outval = await supabase
					.from('groups')
					.insert([{ id: title, owner: supabase.auth.user().id }]);
				if (outval.error) {
					console.log(outval.error);
					alert(
						`Failed to create group, are you sure there isn't already a group with the same name?`
					);
				}
				break;
		}

		window.location.href = '/';
	}
</script>

<Loading fullscreen={true} {loading} />

<div class="center" style="flex-direction: column;">
	<div id="postbox">
		<div class="left"><Type bind:value={type} /></div>
		<div class="left" id="marker">Title</div>
		<input type="text" placeholder="A Fantastic Title" bind:value={title} />
		{#if type != 'group'}
			<div class="left" id="marker">Group</div>
			<input type="text" placeholder="Leave this empty for a public post." bind:value={group} />
		{/if}

		{#if type == 'text'}
			<div class="left" id="marker">Body</div>
			<textarea style="width: 95%; resize:none;" rows="3" bind:value={body} />
		{:else if type == 'image'}
			<div class="left" id="marker">Photos</div>
			{#if !isImageUploaded}
				<Dropzone accept={'image/*'} on:drop={handleImageFilesSelect} />
			{/if}

			{#each images as image}
				<!-- svelte-ignore a11y-missing-attribute -->
				<img src={image} />
			{/each}
		{:else if type == 'group'}
			<p>^ Group Name</p>
		{:else}
			<!--{#if !isVideoUploaded}
				<div class="left" id="marker">Video</div>
				<Dropzone accept={'video/*'} on:drop={handleVideoFilesSelect} />
			{/if}
			<video bind:this={videoElement} controls={vFiles.accepted.length > 0}></video>-->
			<p>
				Our coding snakes are hard at work building this feature, please bear with us while we
				develop this new part of the Viper app.
			</p>
		{/if}
	</div>
</div>

<div style="display: flex; justify-content: center; position:fixed; bottom: 60px; width: 100%;">
	<Button wide={true} text="Post" on:click={post} />
</div>

<style>
	#postbox {
		margin-top: 35px;

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
		width: 98%;
	}

	#marker {
		color: var(--theme-font-gray);
	}

	img {
		width: 90%;
		margin: 5%;
	}

	/*video {
		width: 90%;
		margin: 5%;
	}*/
</style>
