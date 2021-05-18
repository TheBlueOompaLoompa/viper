<script lang="typescript">
	import supabase from '$lib/db';
	import vfetch from '$lib/vfetch';
	
	let search = "";
	
	let results = [];
	
	async function onUpdateSearch(srch) {
		alert('Update search');
		try {
			results = await supabase
				.from('posts')
				.select('*')
				.textSearch('name', `'%${srch}%'`, {
					type: 'websearch',
					config: 'english'
				});
		}catch(e) {
			alert(e);
		}
		
	}
	
	$: {
		console.log(search);
		onUpdateSearch(search);
	}
	
	let posts = [];
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
	$: results.forEach(async (post) => {
		fetchImage(post);
		cacheUsername(post);
	});
</script>

<div class="center" style="flex-direction: column;">
	<h2>Search</h2>
	<input type="text" class="w-wide" bind:value={search} placeholder="Users, posts, groups, etc..." />
</div>
