/**
 * avatar-crop.js — Widget chọn & crop ảnh đại diện nhỏ (không dùng thư viện
 * ngoài). Người dùng chọn ảnh, kéo để đổi vị trí, kéo thanh trượt để zoom;
 * getCroppedDataUrl() xuất ra ảnh vuông đã crop dạng JPEG data URL.
 */
(function () {
  "use strict";

  var frame, placeholder, imgEl, fileInput, pickBtn, removeBtn, zoomRange;
  var state = null; // { img, naturalW, naturalH, frameSize, minScale, scale, offsetX, offsetY }
  var dragging = false;
  var lastX = 0;
  var lastY = 0;

  function $(id) {
    return document.getElementById(id);
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function clampOffsets() {
    var w = state.naturalW * state.scale;
    var h = state.naturalH * state.scale;
    var maxX = Math.max(0, (w - state.frameSize) / 2);
    var maxY = Math.max(0, (h - state.frameSize) / 2);
    state.offsetX = clamp(state.offsetX, -maxX, maxX);
    state.offsetY = clamp(state.offsetY, -maxY, maxY);
  }

  function render() {
    if (!state) return;
    var w = state.naturalW * state.scale;
    var h = state.naturalH * state.scale;
    imgEl.style.width = w + "px";
    imgEl.style.height = h + "px";
    imgEl.style.left = (state.frameSize - w) / 2 + state.offsetX + "px";
    imgEl.style.top = (state.frameSize - h) / 2 + state.offsetY + "px";
  }

  function setScaleFromRange() {
    if (!state) return;
    var t = parseFloat(zoomRange.value); // 0..1
    state.scale = state.minScale * (1 + 2 * t);
    clampOffsets();
    render();
  }

  function showPicked() {
    placeholder.classList.add("hidden");
    imgEl.classList.remove("hidden");
    removeBtn.classList.remove("hidden");
    zoomRange.classList.remove("hidden");
  }

  function reset() {
    state = null;
    imgEl.classList.add("hidden");
    imgEl.removeAttribute("src");
    placeholder.classList.remove("hidden");
    removeBtn.classList.add("hidden");
    zoomRange.classList.add("hidden");
    zoomRange.value = "0";
    fileInput.value = "";
  }

  function loadFile(file) {
    if (!file || !/^image\//.test(file.type)) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        var frameSize = frame.getBoundingClientRect().width || 110;
        var minScale = Math.max(frameSize / img.naturalWidth, frameSize / img.naturalHeight);
        state = {
          img: img,
          naturalW: img.naturalWidth,
          naturalH: img.naturalHeight,
          frameSize: frameSize,
          minScale: minScale,
          scale: minScale,
          offsetX: 0,
          offsetY: 0,
        };
        zoomRange.value = "0";
        showPicked();
        render();
      };
      imgEl.src = e.target.result;
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function getCroppedDataUrl(outSize) {
    if (!state) return null;
    outSize = outSize || 200;
    var canvas = document.createElement("canvas");
    canvas.width = outSize;
    canvas.height = outSize;
    var ctx = canvas.getContext("2d");
    var w = state.naturalW * state.scale;
    var h = state.naturalH * state.scale;
    var imgLeft = (state.frameSize - w) / 2 + state.offsetX;
    var imgTop = (state.frameSize - h) / 2 + state.offsetY;
    var sx = clamp(-imgLeft / state.scale, 0, state.naturalW);
    var sy = clamp(-imgTop / state.scale, 0, state.naturalH);
    var sSize = Math.min(state.frameSize / state.scale, state.naturalW - sx, state.naturalH - sy);
    ctx.drawImage(state.img, sx, sy, sSize, sSize, 0, 0, outSize, outSize);
    return canvas.toDataURL("image/jpeg", 0.72);
  }

  function onPointerDown(e) {
    if (!state) return;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    try {
      frame.setPointerCapture(e.pointerId);
    } catch (err) {}
  }

  function onPointerMove(e) {
    if (!dragging || !state) return;
    var dx = e.clientX - lastX;
    var dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    state.offsetX += dx;
    state.offsetY += dy;
    clampOffsets();
    render();
  }

  function onPointerUp(e) {
    dragging = false;
    try {
      frame.releasePointerCapture(e.pointerId);
    } catch (err) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    frame = $("avatar-crop-frame");
    placeholder = $("avatar-crop-placeholder");
    imgEl = $("avatar-crop-img");
    fileInput = $("avatar-file-input");
    pickBtn = $("avatar-pick-btn");
    removeBtn = $("avatar-remove-btn");
    zoomRange = $("avatar-zoom-range");

    if (!frame || !fileInput) return;

    pickBtn.addEventListener("click", function () {
      fileInput.click();
    });
    fileInput.addEventListener("change", function () {
      if (fileInput.files && fileInput.files[0]) loadFile(fileInput.files[0]);
    });
    removeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      reset();
    });
    zoomRange.addEventListener("input", setScaleFromRange);

    frame.addEventListener("pointerdown", onPointerDown);
    frame.addEventListener("pointermove", onPointerMove);
    frame.addEventListener("pointerup", onPointerUp);
    frame.addEventListener("pointercancel", onPointerUp);

    window.AvatarCrop = {
      hasAvatar: function () {
        return !!state;
      },
      getCroppedDataUrl: getCroppedDataUrl,
      reset: reset,
    };
  });
})();
