/**
 * tracker.js — Ghi log lượt truy cập, link cá nhân hoá (?to=Tên) và tương
 * tác tính năng, gửi về /api/log (Turso). Không chặn/không throw nếu API
 * lỗi hoặc offline — chỉ là beacon, không ảnh hưởng tới trải nghiệm chính.
 */
(function () {
  "use strict";

  function post(type, extra) {
    var payload = Object.assign(
      { type: type, path: location.pathname, referrer: document.referrer },
      extra || {}
    );
    try {
      fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(function () {});
    } catch (e) {}
  }

  post("visit");

  var to = new URLSearchParams(location.search).get("to");
  if (to) {
    post("personalize_open", { name: to.slice(0, 60) });
  }

  var EVENT_MAP = {
    "xin-xam-btn": "xin_xam_open",
    "xin-xam-again": "xin_xam_draw",
    "change-song": "change_song",
    "open-share-panel": "share_open",
    "share-gen-btn": "share_generate_link",
    "share-copy-btn": "share_copy_link",
    "share-native-btn": "share_native",
    "toggle-lite": "toggle_lite_mode",
  };
  var SELECTOR = Object.keys(EVENT_MAP)
    .map(function (id) {
      return "#" + id;
    })
    .join(",");

  document.addEventListener(
    "click",
    function (e) {
      var el = e.target.closest(SELECTOR);
      if (el) post("interaction", { event: EVENT_MAP[el.id] });
    },
    true
  );
})();
