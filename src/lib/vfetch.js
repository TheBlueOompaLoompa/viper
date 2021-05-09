import supabase from '$lib/db';

export default {
	posts: async (start, end) => {
		const {data, error} = await supabase
			.from('posts')
			.select('*')
			.is('group_id', null)
			.order('timestamp', { ascending: false })
			.range(start, end);

		if (error) {
			alert('Failed to load posts. Are you connected to the internet?');
			return;
		}
		
		return data;
	},
	userPosts: async (start, end, id) => {
		console.log(id)
		const {data, error} = await supabase
			.from('posts')
			.select('*')
			.filter('uid', 'eq', id)
			.is('group_id', null)
			.order('timestamp', { ascending: false })
			.range(start, end);

		if (error) {
			alert('Failed to load posts. Are you connected to the internet?');
			console.log(error)
			return;
		}
		
		return data;
	},
	groupPosts: async (start, end, group) => {		
		group = decodeURI(window.location.href.split('?g=')[1]);
		const {data, error} = await supabase
			.from('posts')
			.select('*')
			.eq('group_id', group)
			.order('timestamp', { ascending: false })
			.range(start, end);

		if (error) {
			alert('Failed to load posts. Are you connected to the internet?');
			return;
		}
		
		return data;
	},
	hasUsername: async () => {
		let data = (await supabase.from('users').select('id,username')).data;

		let exists = false;
		data.forEach((acct) => {
			exists = supabase.auth.user().id == acct['id'] || exists;
		});

		return exists;
	},
	getUser: async (id) => {
		const {data, error} = await supabase
			.from('users')
			.select('*')
			.eq('id', id ? id : supabase.auth.user().id);

		return data[0];
	},
	fetchImage: async (post) => {
		const { data, error } = await supabase.storage.from('media').download(`${post['id']}`);
		if (error) {
			console.log(error)
			if(window.location.href.includes('localhost:3000'))
				return;
			alert('Failed to show image!');
			return;
		}
		return window.URL.createObjectURL(data);
	},
	getUsernameFromPost: async (post) => {
		return (
				await supabase.from('users').select('*').eq('id', post['uid'])
			).data[0]['username'];
	},
};
