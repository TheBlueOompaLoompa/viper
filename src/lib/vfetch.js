import supabase from '$lib/db';

export default {
	posts: async (start, end) => {
		const { data, error } = await supabase
				.from('posts')
				.select('*')
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
	fetchImage: async (post) => {
		const { data, error } = await supabase.storage.from('media').download(`${post['id']}`);
		if (error) {
			console.log(error)
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
