import { build, files, timestamp } from '$service-worker';

const CACHE_NAME = 'static-cache-v2';

// Add list of files to cache here.
const FILES_TO_CACHE = [
	...build,
	...files
];

self.addEventListener('install', (evt: any) => {
	console.log('[ServiceWorker] Install');

	evt.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('[ServiceWorker] Pre-caching offline page');
			return cache.addAll(FILES_TO_CACHE);
		})
	);
});

self.addEventListener('activate', (evt: any) => {
	console.log('[ServiceWorker] Activate');
	// Remove previous cached data from disk.
	evt.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(
				keyList.map((key) => {
					if (key !== CACHE_NAME) {
						console.log('[ServiceWorker] Removing old cache', key);
						return caches.delete(key);
					}
				})
			);
		})
	);
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