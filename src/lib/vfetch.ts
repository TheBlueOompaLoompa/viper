import supabase from '$lib/db';
import type post from './post';
import type user from './user';

export default {
	post: async (id: string): Promise<post> => {
		const { data, error } = await supabase.from('posts').select('*').eq('id', id);

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
	getPermissionLevel: async (group_id: string, uid: string): Promise<number> => {
		const { data, error } = await supabase
			.from('permissions')
			.select('level')
			.eq('uid', uid)
			.eq('group_id', group_id);

		console.log(uid, group_id);

		if (error || data.length < 1) {
			alert('Failed to get permission level.');
			return -1;
		}

		return data[0]['level'];
	},
	addUserToGroup: async (username: string, group_id: string, level: number): Promise<void> => {
		let uid: string;
		{
			const { data, error } = await supabase.from('users').select('id').eq('username', username);

			if (error) {
				alert('Failed to get user id!');
				return;
			}

			uid = data[0]['id'];
		}

		const { error } = await supabase.from('permissions').insert([{ uid, group_id, level }]);

		if (error) {
			alert('Failed to give user permissions!');
			return;
		}
	},
	removeUserFromGroup: async (username: string, group_id: string): Promise<void> => {
		let uid: string;
		{
			const { data, error } = await supabase.from('users').select('id').eq('username', username);

			if (error) {
				alert('Failed to get user id!');
				return;
			}

			uid = data[0]['id'];
		}

		const { error } = await supabase
			.from('permissions')
			.delete()
			.eq('uid', uid)
			.eq('group_id', group_id);

		if (error) {
			alert('Failed to remove user permissions!');
			return;
		}
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
	getUid: async (): Promise<string> => {
		return supabase.auth.user().id;
	},
	fetchImage: async (post: post): Promise<string> => {
		const { data, error } = await supabase.storage.from('media').download(`${post['id']}`);
		if (error) {
			console.log(error);
			if (window.location.href.includes('localhost:3000')) return;
			console.log('Failed to show image!');
			return;
		}
		return window.URL.createObjectURL(data);
	},
	getUsernameFromPost: async (post: post): Promise<string> => {
		return (await supabase.from('users').select('*').eq('id', post['uid'])).data[0]['username'];
	}
};
