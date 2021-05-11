import supabase from '$lib/db';
import type post from './post';
import type user from './user';

export default {
	post: async (id: string): Promise<post> => {
		const { data, error } = await supabase
			.from('posts')
			.select('*')
			.eq('id', id);
		
		if (error) {
			alert('Failed to load post. Are you connected to the internet?');
			return;
		}

		return data[0];
	},
	posts: async (start: number, end: number): Promise<post[]> => {
		const { data, error } = await supabase
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
	userPosts: async (start: number, end: number, id: string): Promise<post[]> => {
		const { data, error } = await supabase
			.from('posts')
			.select('*')
			.filter('uid', 'eq', id)
			.is('group_id', null)
			.order('timestamp', { ascending: false })
			.range(start, end);

		if (error) {
			alert('Failed to load posts. Are you connected to the internet?');
			console.log(error);
			return;
		}

		return data;
	},
	groupPosts: async (start: number, end: number, group: string): Promise<post[]> => {
		group = decodeURI(window.location.href.split('?g=')[1]);
		const { data, error } = await supabase
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
	hasUsername: async (): Promise<boolean> => {
		const data = (await supabase.from('users').select('id,username')).data;

		let exists = false;
		data.forEach((acct) => {
			exists = supabase.auth.user().id == acct['id'] || exists;
		});

		return exists;
	},
	getUser: async (id?: string): Promise<user> => {
		const { data, error } = await supabase
			.from('users')
			.select('*')
			.eq('id', id ? id : supabase.auth.user().id);

		if (error) {
			alert('Failed to load user!');
			return;
		}

		return data[0];
	},
	fetchImage: async (post: post): Promise<string> => {
		const { data, error } = await supabase.storage.from('media').download(`${post['id']}`);
		if (error) {
			console.log(error);
			if (window.location.href.includes('localhost:3000')) return;
			alert('Failed to show image!');
			return;
		}
		return window.URL.createObjectURL(data);
	},
	getUsernameFromPost: async (post: post): Promise<string> => {
		return (await supabase.from('users').select('*').eq('id', post['uid'])).data[0]['username'];
	}
};
