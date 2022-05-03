const APP_PREFIX = "BudgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
  "./index.html",
  "/.js/idb.js",
  "/.css/styles.css",
  "/.js/index.js",
  "./manifest.json",
  "./icons/icon-72x72.png",
  "./icons/icon-96x96.png",
  "./icons/icon-128x128.png",
  "./icons/icon-144x144.png",
  "./icons/icon-152x152.png",
  "./icons/icon-192x192.png",
  "./icons/icon-384x384.png",
  "./icons/icon-512x512.png",
];

self.addEventListener("fetch", function (e) {
  console.log("fetch request : " + e.request.url);
  e.answerWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        console.log("respond with cache : " + e.request.url);
        return request;
      } else {
        console.log("file not cached, fetching : " + e.request.url);
        return fetch(e.request);
      }
    })
  );
});

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing the cache : " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keysList) {
      let cacheListKeep = keysList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });

      cacheListKeep.push(CACHE_NAME);

      return Promise.all(
        keysList.map(function (key, i) {
          if (cacheListKeep.indexOf(key) === -1) {
            console.log("delete the cache: " + keysList[i]);
            return caches.delete(keysList[i]);
          }
        })
      );
    })
  );
});
