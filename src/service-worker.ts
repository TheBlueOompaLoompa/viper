import { build, files } from '$service-worker';
import localforage from 'localforage';

const CACHE_NAME = `static-cache`;

// Add list of files to cache here.
const FILES_TO_CACHE = [...build, ...files];

for (var i = 0; i < FILES_TO_CACHE.length; i++) {
	if (FILES_TO_CACHE[i].includes('version.txt')) {
		FILES_TO_CACHE.splice(i, 1);
	}
}

self.addEventListener('install', (evt: any) => {
	console.log('[ServiceWorker] Install');

	caches.open(CACHE_NAME).then((cache) => {
		console.log('[ServiceWorker] Pre-caching offline page');
		return cache.addAll(FILES_TO_CACHE);
	});
});

self.addEventListener('activate', async (evt: any) => {
	console.log('[ServiceWorker] Activate');
	// Remove old cache if version is old
	try {
		const version = await (await fetch('/version.txt')).text();

		if (await localforage.getItem('version')) {
			if ((await localforage.getItem('version')) != version) {
				await caches.delete(CACHE_NAME);
				console.log('[ServiceWorker] Install');

				let cache = await caches.open(CACHE_NAME);
				cache.addAll(FILES_TO_CACHE);
				console.log('Updated to version ' + version);
			}
		} else {
			await caches.delete(CACHE_NAME);
			await localforage.setItem('version', version);
			let cache = await caches.open(CACHE_NAME);
			cache.addAll(FILES_TO_CACHE);
			console.log('First time cache');
		}
	} catch {}
});

self.addEventListener('fetch', (evt: any) => {
	if (evt.request.url.includes('supabase.co')) return;
	console.log('[ServiceWorker] Fetch', evt.request.url);
	// Add fetch event handler here.
	if (evt.request.mode !== 'navigate') {
		// Not a page navigation, bail.
		return;
	}
	evt.respondWith(
		fetch(evt.request).catch(() => {
			return caches.open(CACHE_NAME).then((cache) => {
				return cache.match('offline.html');
			});
		})
	);
});
