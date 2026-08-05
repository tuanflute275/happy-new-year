/**
 * celebrate.js — Hiệu ứng "Giao thừa"
 * Khi count_down.js phát hiện đếm ngược về 0 (event "newyear:arrived"):
 * bắn pháo hoa finale (tận dụng store của fireworks.js) + hiện banner chúc mừng.
 */
(function () {
  "use strict";
  var CELEBRATION_DURATION = 60000;

  function showBanner() {
    var banner = document.createElement("div");
    banner.id = "newyear-banner";
    banner.innerHTML = "<span>🎉 CHÚC MỪNG NĂM MỚI 2027 🎉</span>";
    document.body.appendChild(banner);
    requestAnimationFrame(function () {
      banner.classList.add("show");
    });
    setTimeout(function () {
      banner.classList.remove("show");
      setTimeout(function () {
        banner.remove();
      }, 1000);
    }, CELEBRATION_DURATION);
  }

  function triggerFinale() {
    if (typeof store === "undefined") return;
    store.setState({
      config: Object.assign({}, store.state.config, {
        finale: true,
        autoLaunch: true,
      }),
    });
    setTimeout(function () {
      store.setState({
        config: Object.assign({}, store.state.config, { finale: false }),
      });
    }, CELEBRATION_DURATION);
  }

  function celebrate() {
    showBanner();
    triggerFinale();
  }

  if (window.__newYearArrived) {
    celebrate();
  } else {
    document.addEventListener("newyear:arrived", celebrate);
  }
})();
