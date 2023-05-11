import { writable } from 'svelte/store';

export const THEME = writable('');

export function initSettings() {
    THEME.set(localStorage.getItem('theme') ? localStorage.getItem('theme') as string : 'light');
    THEME.subscribe(val => localStorage.setItem('theme', val));
}