/**
 * banhchung.js — Gói bánh chưng
 * Bấm theo đúng thứ tự lớp truyền thống (lá dong -> gạo nếp -> đậu xanh ->
 * thịt heo -> đậu xanh -> gạo nếp -> buộc lạt). Tốc độ gói quyết định danh hiệu.
 */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var wrapper = document.getElementById("banhchung-wrapper");
  var openBtn = document.getElementById("banhchung-btn");
  var overlay = document.getElementById("banhchung-overlay");
  var card = document.getElementById("banhchung-card");
  var stackEl = document.getElementById("banhchung-stack");
  var stepEl = document.getElementById("banhchung-step");
  var result = document.getElementById("banhchung-result");
  var addBtn = document.getElementById("banhchung-add");
  var againBtn = document.getElementById("banhchung-again");
  var closeBtn = document.getElementById("banhchung-close");

  if (!wrapper || !openBtn || !overlay || !card || !stackEl || !stepEl || !result || !addBtn || !againBtn || !closeBtn) return;

  var STEPS = [
    { emoji: "🍃", label: "Lá dong" },
    { emoji: "🌾", label: "Gạo nếp" },
    { emoji: "🟢", label: "Đậu xanh" },
    { emoji: "🥩", label: "Thịt heo" },
    { emoji: "🟢", label: "Đậu xanh" },
    { emoji: "🌾", label: "Gạo nếp" },
    { emoji: "🎀", label: "Buộc lạt" },
  ];

  var SPEED_TIERS = [
    { max: 8, name: "Nghệ Nhân Gói Bánh", desc: "Tay nghề thượng thừa, bánh vuông vức chỉ trong chớp mắt!" },
    { max: 15, name: "Tay Gói Khéo Léo", desc: "Nhanh và chắc tay, bánh chưng nhà bạn Tết này chắc đẹp lắm!" },
    { max: 25, name: "Gói Bánh Chăm Chỉ", desc: "Chậm nhưng chắc, cái bánh nào cũng đầy tình cảm!" },
    { max: Infinity, name: "Gói Bánh Lần Đầu", desc: "Không sao, ai cũng có lần đầu — Tết sau chắc sẽ nhanh hơn!" },
  ];

  var state = { stepIndex: 0, startTime: 0, done: false };

  function resetState() {
    state.stepIndex = 0;
    state.startTime = performance.now();
    state.done = false;
  }

  function pickSpeedTier(seconds) {
    for (var i = 0; i < SPEED_TIERS.length; i++) {
      if (seconds <= SPEED_TIERS[i].max) return SPEED_TIERS[i];
    }
    return SPEED_TIERS[SPEED_TIERS.length - 1];
  }

  function renderStack() {
    var html = "";
    for (var i = 0; i < state.stepIndex; i++) {
      html += '<span class="banhchung-layer">' + STEPS[i].emoji + "</span>";
    }
    stackEl.innerHTML = html;
  }

  function renderStep() {
    if (state.stepIndex < STEPS.length) {
      var next = STEPS[state.stepIndex];
      stepEl.innerHTML = "Bước tiếp theo: <strong>" + next.emoji + " " + next.label + "</strong>";
    }
  }

  function launchLeafBurst() {
    var container = document.getElementById("banhchung-leaf-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "banhchung-leaf-container";
      document.body.appendChild(container);
    }
    container.innerHTML = "";
    var pieces = ["🍃", "🌾", "✨"];
    for (var i = 0; i < 45; i++) {
      (function (idx) {
        setTimeout(function () {
          var c = document.createElement("div");
          c.className = "banhchung-leaf-piece";
          c.textContent = pieces[Math.floor(Math.random() * pieces.length)];
          c.style.left = 5 + Math.random() * 90 + "%";
          c.style.fontSize = 14 + Math.random() * 16 + "px";
          c.style.animationDuration = 0.9 + Math.random() * 1.2 + "s";
          c.style.animationDelay = Math.random() * 0.3 + "s";
          container.appendChild(c);
          setTimeout(function () {
            if (c.parentNode) c.parentNode.removeChild(c);
          }, 2600);
        }, idx * 18);
      })(i);
    }
  }

  function renderIdle() {
    renderStack();
    renderStep();
    result.innerHTML = "";
    addBtn.classList.remove("hidden");
    againBtn.classList.add("hidden");
  }

  function renderDone() {
    var seconds = (performance.now() - state.startTime) / 1000;
    var tier = pickSpeedTier(seconds);
    stepEl.textContent = "Đang gói và buộc lạt... 🎀";
    addBtn.classList.add("hidden");

    setTimeout(function () {
      stepEl.innerHTML = "🟩 Bánh chưng đã gói xong!";
      result.innerHTML =
        '<div id="banhchung-cake"><span class="banhchung-cake-square"></span></div>' +
        '<div class="banhchung-tier">' + tier.name + "</div>" +
        '<div class="banhchung-desc">' + tier.desc + "</div>" +
        '<div class="banhchung-time">Thời gian gói: ' + seconds.toFixed(1) + " giây</div>";
      card.classList.remove("banhchung-card-pop");
      requestAnimationFrame(function () {
        card.classList.add("banhchung-card-pop");
      });
      againBtn.classList.remove("hidden");
      launchLeafBurst();
    }, 700);
  }

  function handleAdd() {
    if (state.done || state.stepIndex >= STEPS.length) return;
    state.stepIndex++;
    renderStack();
    if (state.stepIndex >= STEPS.length) {
      state.done = true;
      renderDone();
    } else {
      renderStep();
    }
  }

  function openModal() {
    resetState();
    renderIdle();
    overlay.classList.remove("hidden");
  }

  function closeModal() {
    overlay.classList.add("hidden");
    var container = document.getElementById("banhchung-leaf-container");
    if (container) container.innerHTML = "";
  }

  openBtn.addEventListener("click", openModal);
  addBtn.addEventListener("click", handleAdd);
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
