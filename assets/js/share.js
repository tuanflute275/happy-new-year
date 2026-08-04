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
  var downloadBtn = document.getElementById("share-qr-download-btn");
  var qrCopyBtn   = document.getElementById("share-qr-copy-btn");

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

    // Tự sinh QR Code
    var qrContainer = document.getElementById("share-qrcode");
    if (qrContainer) {
      qrContainer.innerHTML = ""; // Xoá QR cũ
      try {
        new QRCode(qrContainer, {
          text: link,
          width: 140,
          height: 140,
          colorDark: "#3a0c0c",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      } catch (err) {
        console.error("Lỗi sinh mã QR: ", err);
      }
    }

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

  /* ---- Event: Tải ảnh QR ---- */
  if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
      var qrContainer = document.getElementById("share-qrcode");
      if (!qrContainer) return;
      
      // Tìm thẻ img sinh ra bởi qrcode.js
      var img = qrContainer.querySelector("img");
      var canvas = qrContainer.querySelector("canvas");
      var dataUrl = "";
      
      if (img && img.src && img.src.indexOf("data:image") !== -1) {
        dataUrl = img.src;
      } else if (canvas) {
        dataUrl = canvas.toDataURL("image/png");
      }
      
      if (!dataUrl) {
        alert("Chưa thể sinh ảnh QR. Vui lòng thử lại!");
        return;
      }
      
      var name = nameInput.value.trim() || "ThiepTet";
      var a = document.createElement("a");
      a.href = dataUrl;
      a.download = "ThiepTet_" + encodeURIComponent(name) + ".png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  /* ---- Event: Sao chép ảnh QR ---- */
  if (qrCopyBtn) {
    // Helper convert base64 sang Blob
    function urlToBlob(dataUrl) {
      var arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type:mime});
    }

    qrCopyBtn.addEventListener("click", function () {
      var qrContainer = document.getElementById("share-qrcode");
      if (!qrContainer) return;

      var img = qrContainer.querySelector("img");
      var canvas = qrContainer.querySelector("canvas");
      var dataUrl = "";

      if (img && img.src && img.src.indexOf("data:image") !== -1) {
        dataUrl = img.src;
      } else if (canvas) {
        dataUrl = canvas.toDataURL("image/png");
      }

      if (!dataUrl) {
        alert("Chưa thể sinh ảnh QR. Vui lòng thử lại!");
        return;
      }

      try {
        var blob = urlToBlob(dataUrl);
        navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]).then(function () {
          // Hiển thị toast thông báo copy thành công
          copyToast.innerHTML = '<i class="fa-solid fa-circle-check" style="margin-right: 5px;"></i>Đã copy ảnh QR vào bộ nhớ tạm!';
          copyToast.classList.remove("hidden");
          setTimeout(function () {
            copyToast.classList.add("hidden");
            // Trả lại text toast cũ của copy link
            copyToast.innerHTML = '<i class="fa-solid fa-circle-check" style="margin-right: 5px;"></i>Đã copy link thành công!';
          }, 2500);
        }).catch(function (err) {
          console.error("Lỗi ghi clipboard: ", err);
          alert("Trình duyệt chưa hỗ trợ copy ảnh trực tiếp, vui lòng Tải ảnh QR!");
        });
      } catch (err) {
        console.error("Lỗi copy QR: ", err);
        alert("Có lỗi xảy ra khi copy ảnh QR!");
      }
    });
  }
});
