import supabase from '$lib/db';

export default {
	posts: async (start, end) => {
		let group;
		if(window.location.href.includes('?g=')){
			group = decodeURI(window.location.href.split('?g=')[1]);
		}

		let out = {
			data: undefined,
			error: undefined
		}

		if(group){
			out = await supabase
				.from('posts')
				.select('*')
				.eq('group_id', group)
				.order('timestamp', { ascending: false })
				.range(start, end);
		}else{
			out = await supabase
				.from('posts')
				.select('*')
				.is('group_id', null)
				.order('timestamp', { ascending: false })
				.range(start, end);
		}

		if (out.error) {
			alert('Failed to load posts. Are you connected to the internet?');
			return;
		}
		
		return out.data;
	},
	hasUsername: async () => {
		let data = (await supabase.from('users').select('id,username')).data;

		let exists = false;
		data.forEach((acct) => {
			exists = supabase.auth.user().id == acct['id'] || exists;
		});

		return exists;
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
