const STATIC_CACHE_NAME = "static-data-v1";
const DYNAMIC_CACHE_NAME = "dynamic-data-v1";

//assets prepared for precaching static data in install event
const ASSETS = [
	'/',
	'/index.html',
	'pages/offline.html',
	'/js/application.js',
	'/js/materialize.min.js',
	'/css/styles.css',
	'/css/materialize.min.css',
	'/img/movie.png',
	'https://fonts.googleapis.com/icon?family=Material+Icons',
	'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2'
];

// if cache size reaches limit of cached data, this function deletes the oldest data cached
function cacheSizeLimit(cacheName, cacheMaxSize){
	return caches.open(cacheName).then(cache => {
		cache.keys().then(keys => {
			if(keys.length > cacheMaxSize){
				cache.delete(keys[0]).then(cacheSizeLimit(cacheName, cacheSizeLimit));
			}
		})
	})
}



// install event
self.addEventListener('install', event => {
	console.log("serivce worker je instaliran");
	event.waitUntil(
		// into cache, under STATIC_CACHE_NAME name, save all given assets 
		caches.open(STATIC_CACHE_NAME).then(cache => {
				cache.addAll(ASSETS);
		})
	);
});

// activate event
self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(key => key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME)
				.map(key => caches.delete(key))
			);
		})
	);
});

// fetch event
self.addEventListener('fetch', event => {
	if(event.request.url.indexOf("firestore.googleapis.com") === -1){
		event.respondWith(
			//check if any cached data matches with data requested
			caches.match(event.request).then(cacheRes => {

				if (cacheRes) {
					// cacheRes is not empty, so cache exists
					return cacheRes;
				} 
				else {
					// cacheRes is empty so request is sent to server
					return fetch(event.request).then(fetchRes => {
						return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
							cache.put(event.request.url, fetchRes.clone());
							//   cacheSizeLimit(DYNAMIC_CACHE_NAME, 1);
							cacheSizeLimit(DYNAMIC_CACHE_NAME, 15);
							return fetchRes;  
						})
					})	
				}
			}).catch(() => {
				if(event.request.url.indexOf('.html') > -1){
					return caches.match('/pages/offline.html');
				} 
			})
		);
	}
});

