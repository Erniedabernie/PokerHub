/* Poker Hub — offline start.

   The app is one page that keeps everything on the device, but opening it
   still meant fetching that page: no signal, no app. This worker keeps the
   last copy it fetched and hands it over when the network cannot.

   The rule is network first. With a connection the page comes from the
   site, exactly as before, so a new version shows on the next open — a
   worker that preferred its own copy would pin an old build. The saved
   copy is used only when the request fails, answers with an error, or has
   not answered within WAIT (a phone with one bar that never quite loads).

   It handles this app's own files and nothing else: other apps on the same
   address are outside its scope, and its cache has its own name. */

var CACHE = 'poker-hub-offline-v1';
var WAIT = 4000;
var SCOPE = self.registration ? self.registration.scope : self.location.href.replace(/sw\.js.*$/, '');

/* Fetched once at install, so the app is ready for offline from the first
   visit after the update rather than the second. */
var SHELL = [
  './',
  './manifest.webmanifest',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/favicon-32.png'
];

/* One entry per file: a query string (the ?v=2 on the icons, a cache
   buster on the page) is not a different file. */
function keyOf(url) { return url.origin + url.pathname; }

function save(key, res) {
  return caches.open(CACHE).then(function (c) { return c.put(key, res); });
}

/* A page load refuses an answer that arrived by way of a redirect. Rebuilt
   without that mark, it is the same page. */
function plain(res) {
  if (!res || !res.redirected) return res;
  return res.blob().then(function (body) {
    return new Response(body, { status: res.status, statusText: res.statusText, headers: res.headers });
  });
}

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(SHELL.map(function (path) {
        var url = new URL(path, SCOPE);
        return fetch(url.href, { cache: 'no-cache' }).then(plain).then(function (res) {
          if (res && res.ok) return c.put(keyOf(url), res);
        }).catch(function () { /* a missing icon must not stop the page being saved */ });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.filter(function (n) {
        return n.indexOf('poker-hub-offline-') === 0 && n !== CACHE;
      }).map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin || url.href.indexOf(SCOPE) !== 0) return;

  var key = keyOf(url);
  var saved = function () {
    return caches.open(CACHE).then(function (c) {
      return c.match(key).then(function (hit) {
        /* Any page inside the app is the app. */
        return hit || (req.mode === 'navigate' ? c.match(keyOf(new URL('./', SCOPE))) : undefined);
      });
    });
  };

  /* no-cache: ask the site every time, and take its "not modified" when
     nothing changed — current without downloading the page again. */
  var net = fetch(req.url, { cache: 'no-cache' }).then(plain).then(function (res) {
    if (res && res.ok && res.type === 'basic') {
      var copy = res.clone();
      return save(key, copy).then(function () { return res; }, function () { return res; });
    }
    return res;
  });

  e.respondWith(new Promise(function (resolve, reject) {
    var done = false;
    var settle = function (res) { if (!done) { done = true; resolve(res); } };
    var timer = setTimeout(function () {
      saved().then(function (hit) { if (hit) settle(hit); });
    }, WAIT);

    net.then(function (res) {
      clearTimeout(timer);
      if (res && res.ok) return settle(res);
      /* The site answered, but with an error page: prefer the saved copy. */
      return saved().then(function (hit) { settle(hit || res); });
    }, function () {
      clearTimeout(timer);
      return saved().then(function (hit) {
        if (hit) settle(hit);
        else if (!done) { done = true; reject(new TypeError('Offline, and nothing saved for ' + url.pathname)); }
      });
    });
  }));

  /* Keep the worker alive until the slow answer has been saved, even if
     the saved copy was already handed over. */
  e.waitUntil(net.then(function () { }, function () { }));
});
