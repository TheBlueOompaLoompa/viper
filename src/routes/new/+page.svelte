<script lang="ts">
    import Type from './Type.svelte';
	import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
	import Button from '$lib/components/Button.svelte';
	import closable from 'svelte-closable';
	import imageCompression from 'browser-image-compression';
	import supabase from '$lib/supabase';
	import Loading from '$lib/components/Loading.svelte';

	type Files = {
		accepted: File[]
		rejected: File[]
	}

	let iFiles: Files = {
		// Image files
		accepted: [],
		rejected: []
	};
	let vFiles: Files = {
		// Video files
		accepted: [],
		rejected: []
	};
	let type = 'text';
	let title = '';
	let group = '';
	let body = '';
	let images: string[] = [];
	let isVideoUploaded = false;
	let isImageUploaded = false;
	let videoElement = {
		setAttribute: (a: string, b: string) => {
			console.log(a, b);
		},
		removeAttribute: (a: string) => {
			console.log(a);
		}
	};
	function handleImageFilesSelect(e: any) {
		const { acceptedFiles, fileRejections } = e.detail;
		iFiles.accepted = [...iFiles.accepted, ...acceptedFiles];
		iFiles.rejected = [...iFiles.rejected, ...fileRejections];
		for (let i = 0; i < acceptedFiles.length; i++) {
			var reader = new FileReader();
			reader.onload = function (ev) {
				if(ev.target != null) {
					images = [ev.target.result as string, ...images];
					console.log(images);
				}
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
		let outval: any = {
			data: undefined,
			error: undefined
		};

        const { data, error } = await supabase.auth.getUser();

        if(error) return;

		switch (type) {
			case 'text':
				await supabase.from('posts').insert([
					{
						title,
						content: body,
						type: 0,
						uid: data.user.id,
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
						uid: data.user.id,
						group_id: group.length > 0 ? group : null
					}
				]).select();

				if (outval.error) {
					alert('Failed to post');
				} else {
					const options = { maxSizeMB: 1.5 };
					iFiles.accepted[0] = await imageCompression(iFiles.accepted[0], options);
					console.log(outval.data)
					
					outval = await supabase.storage
						.from('media')
						.upload(outval.data[0]['id'], iFiles.accepted[0]);
					if (outval.error) {
						alert('Failed to upload image.');
					}else {
						window.location.href = `/post?p=${outval.data[0]['id']}`;
					}
				}
				break;
			case 'group':
				outval = await supabase
					.from('groups')
					.insert([{ id: title, owner: data.user.id }]);
				if (outval.error) {
					console.log(outval.error);
					alert(
						`Failed to create group, are you sure there isn't already a group with the same name?`
					);
					break;
				}
				outval = await supabase
					.from('permissions')
					.insert([{ uid: data.user.id, group_id: title, level: 4 }]);
				if (outval.error) {
					console.log(outval.error);
					alert(`Failed to give owner permission, please contect support to get this corrected.`);
					break;
				}
				break;
		}
		window.location.href =
			type == 'group' ? '/groups' : `/${group.replace(' ', '').length > 0 ? `?g=${group}` : ''}`;
	}
	let groupInput: HTMLInputElement;
	let showGroupPredict = false;
	let groups: any[] = [];
	async function updateGroups() {
		if (!group) return;
		var resp = await supabase.rpc('find_groups', { term: group, req_offset: 0 });
		groups = resp.data;
	}
	$: if (group.replace(' ', '') != '') {
		updateGroups();
	}

	let predictPos = [0, 0];

	$: if(groupInput) {
		predictPos = [groupInput.getBoundingClientRect().bottom, groupInput.getBoundingClientRect().left, groupInput.getBoundingClientRect().width]
	}
</script>

{#if !loading}
<main>
	<h2>New</h2>
	<div id="postbox">
		<div class="boxarea">
			<Type bind:value={type} />
			{#if type != 'group'}
				<div class="left" id="marker">Title</div>
				<input type="text" placeholder="A Fantastic Title" bind:value={title} />
				<div class="left" id="marker">Group</div>
				<input
					type="text"
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
						class="predict"
						style={`position: absolute; top: ${predictPos[0] + 6}px; left: ${predictPos[1] - 2}px; width: ${predictPos[2] - 10}px;`}
						use:closable={{ exclude: [groupInput] }}
						on:outside-click={() => {
							showGroupPredict = false;
						}}>
						{#each groups as g}
							<span
								style="-webkit-user-select: none; -moz-user-select: none; user-select: none;"
								on:click={() => {
									group = g.id;
									showGroupPredict = false;
								}}
								on:keypress={() => {
									group = g.id;
									showGroupPredict = false;
								}}
								>{g.id}</span
							>
						{/each}
					</div>
				{/if}
			{/if}

			{#if type == 'text'}
				<div class="left" id="marker">Body</div>
				<textarea style="resize:none;" rows="3" bind:value={body} />
			{:else if type == 'image'}
				<div class="left" id="marker">Photos</div>
				{#if !isImageUploaded}
					<Dropzone accept="image/*" on:drop={handleImageFilesSelect} />
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
</main>

	{#if type != 'video'}
	<submit class="flex flex-row justify-center fixed bottom-16 w-full">
		<Button wide={true} text="Post" on:click={post} />
	</submit>
	{/if}
{:else}
<Loading fullscreen={true}/>
{/if}

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    submit {
        display: flex;
        flex-direction: row;
        justify-content: center;
        
        position: fixed;
        bottom: 3rem;
        width: 100%;
    }

	#postbox {
		margin-top: 35px;
		border: solid 1px var(--theme-color-outline);
		border-radius: 6px;
		width: 86%;
		max-width: 700px;
		padding: 5px;
		margin-bottom: 50px;
	}

	.boxarea {
		display: flex;
		flex-direction: column;
		
		width: 100%;
		height: 100%;
	}
    
	textarea {
		margin-bottom: 7px;
	}

	input {
		margin-bottom: 7px;
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

	.predict {
		position: absolute;

		display: flex;
		flex-direction: column;
		z-index: 1;
		border: solid 1px var(--theme-color-outline);
		background-color: var(--theme-color-background);

		box-shadow: 0px 4px 4px var(--theme-color-accent-mid);
		max-height: 200px;
		height: 200px;
		overflow-y:scroll;
		border-radius: 6px;
		padding: 6px;
	}

	/*video {
		width: 90%;
		margin: 5%;
	}*/
</style>
