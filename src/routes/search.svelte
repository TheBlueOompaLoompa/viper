<script lang="typescript">
	import supabase from '$lib/db';
	import vfetch from '$lib/vfetch';

	import Post from '../components/Post.svelte';
	import Tabs from '../components/Tabs.svelte';
	import Button from '../components/Button.svelte';

	let search = '';

	let posts = [];
	let groups = [];
	let users = [];

	function thing() {
		window.onscroll = async function () {
			if (
				window.innerHeight + window.scrollY >= document.body.scrollHeight &&
				!scrollLoadDisabled
			) {
				scrollLoadDisabled = true;
				offset += 5;

				posts = [
					...posts,
					...(await supabase.rpc('srch', { term: search.replace(' ', ' or '), req_offset: offset }))
						.data
				];

				scrollLoadDisabled = false;
			}
		};
	}

	let first = true;
	async function onUpdateSearch() {
		switch (searchType) {
			case 'Posts':
				if (first) {
					first = false;
					thing();
				}
				try {
					posts = (
						await supabase.rpc('post_search', { term: search.replace(' ', ' or '), req_offset: 0 })
					).data;
				} catch (e) {
					alert(e);
				}
				break;
			case 'Groups':
				try {
					groups = (
						await supabase.rpc('group_search', { term: search.replace(' ', ' or '), req_offset: 0 })
					).data;
					console.log(groups);
				} catch (e) {
					alert(e);
				}
				break;
			case 'Users':
				try {
					users = (await supabase.from('users').select('id,username')).data;
					console.log(users);
				} catch (e) {
					alert(e);
				}
				break;
		}
	}

	$: {
		if (search.replace(' ', '') != '') {
			onUpdateSearch();
		}
	}

	var scrollLoadDisabled = false;
	var offset = 0;

	let images = {};
	let usernameCache = {};
	async function fetchImage(post) {
		if (post['type'] == 1 && !images[post['id']]) {
			images[post['id']] = await vfetch.fetchImage(post);
		}
	}
	async function cacheUsername(post) {
		if (!Object.keys(usernameCache)[post['uid']]) {
			usernameCache[post['uid']] = await vfetch.getUsernameFromPost(post);
		}
	}

	var i = 0;
	$: for (i = 0; i < posts.length; i++) {
		fetchImage(posts[i]);
		cacheUsername(posts[i]);
	}

	let searchType = 'Posts';
</script>

<div class="center" style="flex-direction: column;">
	<h2>Search</h2>
	<input
		type="text"
		class="w-wide"
		bind:value={search}
		placeholder="Users, posts, groups, etc..."
	/>
</div>
<center style="margin-top: 6px; margin-bottom: 30px;">
	<Tabs tabs={['Posts', 'Groups', 'Users']} c_class={'w-wide'} bind:active={searchType} />
</center>
{#if searchType == 'Posts'}
	<posts style="display: flex; flex-direction:column;">
		{#each posts as post, i}
			<div class="trans">
				<Post {post} cache={usernameCache} img={images[post['id']]} />
			</div>
		{/each}
	</posts>
{:else if searchType == 'Groups'}
	{#each groups as group}
		<a
			href={'/group/?g=' + encodeURIComponent(group)}
			style="width: 100%; display: flex; justify-content: center;"
			><Button text={group} wide={true} /></a
		>
	{/each}
{:else}
	{#each users as user}
		<div style="display: flex; justify-content: center; align-items: center;">
			<a href="/profile?p={user.id}">@{user.username}</a>
		</div>
	{/each}
{/if}

<style>
	.trans {
		display: flex;
		justify-content: center;
		width: 100%;
	}
</style>
