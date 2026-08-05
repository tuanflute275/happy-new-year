/**
 * sw.js — Service Worker cho PWA "Add to Home Screen".
 * - Precache app shell (HTML/CSS/JS/icon) lúc install để mở lại nhanh, offline được UI cơ bản.
 * - HTML: network-first (luôn lấy bản mới nhất khi online, fallback cache khi mất mạng).
 * - CSS/JS/ảnh/nhạc: cache-first (đã cache thì dùng ngay, chưa có thì tải + lưu cho lần sau).
 * - /api/* và cross-origin (CDN): không can thiệp, luôn đi network thật.
 *
 * ⚠️ LƯU Ý: mỗi khi sửa CSS/JS trong PRECACHE_URLS, phải tăng CACHE_VERSION
 * ở dưới — nếu không, người đã từng mở trang sẽ tiếp tục thấy bản CSS/JS
 * CŨ (cache-first) dù server đã có bản mới, vì sw.js không đổi thì trình
 * duyệt không kích hoạt bản Service Worker mới.
 */
const CACHE_VERSION = "v5";
const CACHE_NAME = "happy-new-year-" + CACHE_VERSION;

const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/firework.html",
  "/manifest.json",
  "/assets/css/self.css",
  "/assets/css/count_down.css",
  "/assets/css/fireworks.css",
  "/assets/css/style.css",
  "/assets/css/custom.css",
  "/assets/css/fireworkWatch.css",
  "/assets/js/self.js",
  "/assets/js/sfx.js",
  "/assets/js/count_down.js",
  "/assets/js/xin-xam.js",
  "/assets/js/minigame.js",
  "/assets/js/banhchung.js",
  "/assets/js/fireworks.js",
  "/assets/js/celebrate.js",
  "/assets/js/snowflake.js",
  "/assets/js/custom.js",
  "/assets/js/personalize.js",
  "/assets/js/script.js",
  "/assets/js/tracker.js",
  "/assets/js/share.js",
  "/assets/js/avatar-crop.js",
  "/assets/js/scriptWatch.js",
  "/assets/js/vendor/fscreen.js",
  "/assets/js/vendor/Stage.js",
  "/assets/js/vendor/MyMath.js",
  "/assets/img/icon-192.png",
  "/assets/img/icon-512.png",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.all(
        PRECACHE_URLS.map(function (url) {
          return cache.add(url).catch(function () {
            // Bỏ qua asset lỗi (ví dụ file chưa deploy) — không chặn install vì 1 file.
          });
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return key !== CACHE_NAME;
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  if (url.origin !== location.origin) return; // CDN/cross-origin: để browser xử lý bình thường
  if (url.pathname.indexOf("/api/") === 0) return; // log/auth/dashboard data: luôn phải là dữ liệu thật

  var isHtml = req.mode === "navigate" || (req.headers.get("accept") || "").indexOf("text/html") !== -1;

  if (isHtml) {
    event.respondWith(
      fetch(req)
        .then(function (res) {
          var resClone = res.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(req, resClone);
          });
          return res;
        })
        .catch(function () {
          return caches.match(req);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        if (res.ok) {
          var resClone = res.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(req, resClone);
          });
        }
        return res;
      });
    })
  );
});
