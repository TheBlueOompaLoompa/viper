<script lang="typescript">
	import Type from '../components/new/type.svelte';

	import Dropzone from 'svelte-file-dropzone';
	import Button from '../components/Button.svelte';
	import Loading from '../components/Loading.svelte';
	import closable from 'svelte-closable';

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
				await supabase.from('posts').insert([
					{
						title,
						content: body,
						type: 0,
						uid: supabase.auth.user().id,
						group_id: group.length > 0 ? group : null
					}
				]);
				break;
			case 'image':
				outval = await supabase.from('posts').insert([
					{
						title,
						content: body,
						type: 1,
						uid: supabase.auth.user().id,
						group_id: group.length > 0 ? group : null
					}
				]);
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

					break;
				}

				outval = await supabase
					.from('permissions')
					.insert([{ uid: supabase.auth.user().id, group_id: title, level: 4 }]);

				if (outval.error) {
					console.log(outval.error);
					alert(`Failed to give owner permission, please contect support to get this corrected.`);

					break;
				}

				break;
		}

		window.location.href = type == 'group' ? '/groups' : '/';
	}

	let groupInput;
	let showGroupPredict = false;
	let groups = [];

	async function updateGroups() {
		if (!group) return;
		var resp = await supabase.rpc('find_groups', { term: group, req_offset: 0 });
		groups = resp.data;
	}
</script>

<Loading fullscreen={true} {loading} />

<div class="flex flex-col justify-center items-center">
	<div id="postbox">
		<div class="flex flex-col justify-center items-center">
			<div style="width: 98%;"><Type bind:value={type} /></div>
			{#if type != 'group'}
				<div class="left" id="marker">Title</div>
				<input type="text" placeholder="A Fantastic Title" bind:value={title} />
				<div class="left" id="marker">Group</div>
				<input
					type="text"
					on:blur={updateGroups}
					on:change={updateGroups}
					on:click={() => {
						showGroupPredict = true;
					}}
					bind:this={groupInput}
					id="group"
					placeholder="Leave this empty for a public post."
					bind:value={group}
				/>
				{#if showGroupPredict}
					<div
						class="flex flex-col items-center"
						style="border-width: 1px; border-color: var(--theme-color-outline); background-color: var(--theme-color-background); box-shadow: 0px 4px 4px var(--theme-color-accent-mid); max-height: 200px; max-width: 800px; width: 84%; height: 200px; position: absolute; transform: translateY(111px); overflow-y:scroll; border-radius: 6px; padding: 6px;"
						use:closable={{ exclude: [groupInput] }}
						on:outside-click={() => {
							showGroupPredict = false;
						}}
					>
						{#each groups as group_name}
							<span
								style="-webkit-user-select: none; -moz-user-select: none; user-select: none;"
								on:click={() => {
									group = group_name;
									showGroupPredict = false;
								}}>{group_name}</span
							>
						{/each}
					</div>
				{/if}
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
				<div class="left" id="marker">Group Name</div>
				<input type="text" placeholder="Name" bind:value={title} />
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
</div>

{#if type != 'video'}
	<div class="flex flex-row justify-center fixed bottom-16 w-full">
		<Button wide={true} text="Post" on:click={post} />
	</div>
{/if}

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
