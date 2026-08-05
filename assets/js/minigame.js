/**
 * minigame.js — Đập lợn tiết kiệm
 * Bấm liên tục để đập heo, mỗi lần nhận "lộc" ngẫu nhiên. Đập đủ số lần
 * (bí mật, random mỗi lượt chơi) thì heo vỡ, tổng lộc quyết định hạng heo.
 */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var wrapper = document.getElementById("minigame-wrapper");
  var openBtn = document.getElementById("minigame-btn");
  var overlay = document.getElementById("minigame-overlay");
  var card = document.getElementById("minigame-card");
  var piggy = document.getElementById("minigame-piggy");
  var locEl = document.getElementById("minigame-loc");
  var result = document.getElementById("minigame-result");
  var hitBtn = document.getElementById("minigame-hit");
  var againBtn = document.getElementById("minigame-again");
  var closeBtn = document.getElementById("minigame-close");

  if (!wrapper || !openBtn || !overlay || !card || !piggy || !locEl || !result || !hitBtn || !againBtn || !closeBtn) return;

  var TIERS = [
    { min: 6000, name: "Heo Kim Cương", medal: "💎", desc: "Lộc đầy nhà, năm mới sung túc vượt bậc!" },
    { min: 3000, name: "Heo Vàng", medal: "🥇", desc: "Tiết kiệm giỏi, năm mới tài lộc dồi dào!" },
    { min: 1000, name: "Heo Bạc", medal: "🥈", desc: "Một năm chi tiêu vừa đủ, ấm no bền vững!" },
    { min: 0, name: "Heo Đất", medal: "🥉", desc: "Từng đồng lộc nhỏ cũng đáng quý, tích tiểu thành đại!" },
  ];

  var state = { hits: 0, needed: 0, totalLoc: 0, broken: false };

  function resetState() {
    state.hits = 0;
    state.needed = 8 + Math.floor(Math.random() * 4); // 8–11 lần, bí mật với người chơi
    state.totalLoc = 0;
    state.broken = false;
  }

  function pickTier(total) {
    for (var i = 0; i < TIERS.length; i++) {
      if (total >= TIERS[i].min) return TIERS[i];
    }
    return TIERS[TIERS.length - 1];
  }

  function shakePiggy() {
    piggy.classList.remove("minigame-shake");
    requestAnimationFrame(function () {
      piggy.classList.add("minigame-shake");
    });
  }

  var BURST_EMOJI = ["🪙", "💰", "✨", "⭐"];

  function launchCoinBurst() {
    var container = document.getElementById("minigame-coin-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "minigame-coin-container";
      document.body.appendChild(container);
    }
    container.innerHTML = "";
    for (var i = 0; i < 70; i++) {
      (function (idx) {
        setTimeout(function () {
          var c = document.createElement("div");
          c.className = "minigame-coin-piece";
          c.textContent = BURST_EMOJI[Math.floor(Math.random() * BURST_EMOJI.length)];
          c.style.left = 5 + Math.random() * 90 + "%";
          c.style.fontSize = 14 + Math.random() * 18 + "px";
          c.style.animationDuration = 0.9 + Math.random() * 1.3 + "s";
          c.style.animationDelay = Math.random() * 0.4 + "s";
          container.appendChild(c);
          setTimeout(function () {
            if (c.parentNode) c.parentNode.removeChild(c);
          }, 2800);
        }, idx * 15);
      })(i);
    }
  }

  function flashScreen() {
    var flash = document.createElement("div");
    flash.className = "minigame-flash";
    document.body.appendChild(flash);
    setTimeout(function () {
      if (flash.parentNode) flash.parentNode.removeChild(flash);
    }, 550);
  }

  function shakeCard() {
    card.classList.remove("minigame-card-shake", "minigame-card-celebrate");
    requestAnimationFrame(function () {
      card.classList.add("minigame-card-shake", "minigame-card-celebrate");
    });
  }

  function countUpLoc(target) {
    var strongEl = locEl.querySelector("strong");
    var duration = 700;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      strongEl.textContent = Math.floor(target * progress);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function renderIdle() {
    locEl.innerHTML = "Lộc hiện tại: <strong>" + state.totalLoc + "</strong>";
    result.innerHTML = "";
    piggy.innerHTML = "🐷";
    hitBtn.classList.remove("hidden");
    againBtn.classList.add("hidden");
  }

  function renderBroken() {
    var tier = pickTier(state.totalLoc);
    piggy.innerHTML =
      '<div class="minigame-burst-title">🎉 HEO ĐÃ VỠ! 🎉</div>' +
      '<span class="minigame-badge-wrap"><span class="minigame-badge-pig">🐷</span>' +
      '<span class="minigame-badge-medal">' + tier.medal + "</span></span>";
    locEl.innerHTML = "Tổng lộc thu được: <strong>0</strong>";
    result.innerHTML =
      '<div class="minigame-tier">' + tier.name + "</div>" +
      '<div class="minigame-desc">' + tier.desc + "</div>";
    hitBtn.classList.add("hidden");
    againBtn.classList.remove("hidden");

    flashScreen();
    shakeCard();
    countUpLoc(state.totalLoc);
    launchCoinBurst();
  }

  function handleHit() {
    if (state.broken) return;
    state.hits++;
    state.totalLoc += 50 + Math.floor(Math.random() * 451); // 50–500
    shakePiggy();
    locEl.innerHTML = "Lộc hiện tại: <strong>" + state.totalLoc + "</strong>";
    if (state.hits >= state.needed) {
      state.broken = true;
      renderBroken();
    }
  }

  function openModal() {
    resetState();
    renderIdle();
    overlay.classList.remove("hidden");
  }

  function closeModal() {
    overlay.classList.add("hidden");
    var container = document.getElementById("minigame-coin-container");
    if (container) container.innerHTML = "";
  }

  openBtn.addEventListener("click", openModal);
  hitBtn.addEventListener("click", handleHit);
  piggy.addEventListener("click", handleHit);
  againBtn.addEventListener("click", function () {
    resetState();
    renderIdle();
  });
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !overlay.classList.contains("hidden")) closeModal();
  });
});
