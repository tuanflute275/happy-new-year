/**
 * share.js — Tạo lời chúc riêng & Chia sẻ
 * Mở panel từ menu cài đặt → nhập tên → sinh link ?to=Tên → copy / Web Share API
 */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var overlay    = document.getElementById("share-overlay");
  var panel      = document.getElementById("share-panel");
  var openBtn    = document.getElementById("open-share-panel");
  var closeBtn   = document.getElementById("share-close");
  var nameInput  = document.getElementById("share-name-input");
  var genBtn     = document.getElementById("share-gen-btn");
  var resultEl   = document.getElementById("share-result");
  var linkText   = document.getElementById("share-link-text");
  var copyBtn    = document.getElementById("share-copy-btn");
  var nativeBtn  = document.getElementById("share-native-btn");
  var previewBtn = document.getElementById("share-preview-btn");
  var copyToast  = document.getElementById("share-copy-toast");

  if (!overlay) return;

  /* ---- Helpers ---- */
  function getBaseUrl() {
    return window.location.origin + window.location.pathname;
  }

  function buildLink(name) {
    return getBaseUrl() + "?to=" + encodeURIComponent(name.trim());
  }

  function openPanel() {
    overlay.classList.remove("hidden");
    // Reset mỗi lần mở
    nameInput.value = "";
    resultEl.classList.add("hidden");
    copyToast.classList.add("hidden");
    setTimeout(function () { nameInput.focus(); }, 150);
  }

  function closePanel() {
    overlay.classList.add("hidden");
    resultEl.classList.add("hidden");
    copyToast.classList.add("hidden");
  }

  function showResult(name) {
    var link = buildLink(name);
    linkText.textContent = link;
    resultEl.classList.remove("hidden");
    copyToast.classList.add("hidden");

    // Ẩn nút Web Share nếu API không hỗ trợ
    nativeBtn.style.display = navigator.share ? "inline-flex" : "none";
  }

  /* ---- Event: mở panel ---- */
  if (openBtn) {
    openBtn.addEventListener("click", function () {
      // Đóng settings menu trước
      var menu = document.getElementById("setting-menu");
      if (menu) menu.classList.remove("active");
      openPanel();
    });
  }

  /* ---- Event: đóng panel ---- */
  closeBtn.addEventListener("click", closePanel);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closePanel();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePanel();
  });

  /* ---- Event: tạo link ---- */
  genBtn.addEventListener("click", function () {
    var name = nameInput.value.trim();
    if (!name) {
      nameInput.classList.add("share-input-error");
      nameInput.placeholder = "⚠️ Hãy nhập tên người nhận!";
      setTimeout(function () {
        nameInput.classList.remove("share-input-error");
        nameInput.placeholder = "Ví dụ: Minh, Linh, Anh Tuấn...";
      }, 2000);
      return;
    }
    showResult(name);
  });

  nameInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") genBtn.click();
  });

  /* ---- Event: copy link ---- */
  copyBtn.addEventListener("click", function () {
    var link = linkText.textContent;
    if (!link) return;
    navigator.clipboard.writeText(link).then(function () {
      copyToast.classList.remove("hidden");
      setTimeout(function () { copyToast.classList.add("hidden"); }, 2500);
    }).catch(function () {
      // Fallback
      var ta = document.createElement("textarea");
      ta.value = link;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      copyToast.classList.remove("hidden");
      setTimeout(function () { copyToast.classList.add("hidden"); }, 2500);
    });
  });

  /* ---- Event: Web Share API ---- */
  nativeBtn.addEventListener("click", function () {
    var name = nameInput.value.trim();
    var link = linkText.textContent;
    if (!link) return;
    navigator.share({
      title: "🎉 Thiệp Tết 2027 — Chúc mừng năm mới " + name + "!",
      text: "Mình gửi tặng bạn thiệp chúc Tết 2027 rồi nhé! 🧧🎆",
      url: link,
    }).catch(function () { /* user cancelled */ });
  });

  /* ---- Event: xem trước ---- */
  previewBtn.addEventListener("click", function () {
    var link = linkText.textContent;
    if (link) window.open(link, "_blank");
  });
});
