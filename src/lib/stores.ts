import { writable } from 'svelte/store';
import type { Notification } from './types';

export const NameCache = writable({});
export const ImagePostCount = writable(0);
export const PostsLoaded = writable(0);
export const Notifications = writable<Notification[]>([]);