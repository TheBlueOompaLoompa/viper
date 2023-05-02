import { writable } from 'svelte/store';

export const NameCache = writable({});
export const ImagePostCount = writable(0);
export const PostsLoaded = writable(0);