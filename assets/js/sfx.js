/**
 * sfx.js — Hiệu ứng âm thanh nhỏ khi tương tác (tiền lì xì, múa lân, đập
 * heo, gói bánh...). Tự tổng hợp bằng Web Audio API — không cần file âm
 * thanh có sẵn, không tốn băng thông, không vướng bản quyền.
 *
 * Dùng: SFX.play("coin" | "lion" | "hit" | "break" | "pop" | "success")
 * An toàn khi gọi trước khi DOM ready hoặc nếu trình duyệt không hỗ trợ
 * Web Audio — chỉ lặng lẽ không phát âm, không throw lỗi.
 */
(function () {
  "use strict";

  var ctx = null;
  var master = null;

  function getContext() {
    if (ctx) return ctx;
    var Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.22; // âm lượng nhỏ, không lấn nhạc nền
    master.connect(ctx.destination);
    return ctx;
  }

  function now() {
    return ctx.currentTime;
  }

  // Một tiếng "tút" ngắn từ oscillator, có envelope attack/decay riêng.
  function tone(freq, startOffset, duration, type, peakGain) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    var t0 = now() + startOffset;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(peakGain != null ? peakGain : 0.9, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  // Một tiếng nhiễu ngắn (noise burst) lọc qua bandpass — dùng cho tiếng
  // thanh la, tiếng vỡ, tiếng sột soạt.
  function noiseBurst(startOffset, duration, filterFreq, filterQ, peakGain) {
    var bufferSize = Math.ceil(ctx.sampleRate * duration);
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    var src = ctx.createBufferSource();
    src.buffer = buffer;

    var filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = filterFreq;
    filter.Q.value = filterQ != null ? filterQ : 1;

    var gain = ctx.createGain();
    var t0 = now() + startOffset;
    gain.gain.setValueAtTime(peakGain != null ? peakGain : 0.7, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start(t0);
    src.stop(t0 + duration + 0.02);
  }

  var EFFECTS = {
    // Tiền lì xì / xin xăm rút được quẻ tốt — 3 nốt cao dồn nhanh như tiếng xu rơi.
    coin: function () {
      tone(1400, 0, 0.16, "triangle", 0.8);
      tone(1800, 0.07, 0.16, "triangle", 0.75);
      tone(2200, 0.14, 0.2, "triangle", 0.7);
    },
    // Bấm vào kỳ lân — 2 tiếng trống trầm + 1 tiếng thanh la.
    lion: function () {
      tone(95, 0, 0.18, "sine", 1);
      tone(90, 0.16, 0.18, "sine", 0.9);
      noiseBurst(0.05, 0.35, 5500, 0.8, 0.5);
    },
    // Đập heo tiết kiệm — 1 tiếng gõ ngắn.
    hit: function () {
      tone(320, 0, 0.08, "square", 0.5);
    },
    // Heo vỡ — tiếng vỡ + tiền rơi.
    break: function () {
      noiseBurst(0, 0.3, 2200, 0.6, 0.65);
      tone(1500, 0.08, 0.15, "triangle", 0.6);
      tone(1900, 0.15, 0.18, "triangle", 0.55);
    },
    // Thêm 1 lớp gói bánh chưng — tiếng sột soạt nhẹ.
    pop: function () {
      noiseBurst(0, 0.07, 3200, 1.2, 0.35);
    },
    // Gói bánh xong — hợp âm 3 nốt đi lên, ấm áp.
    success: function () {
      tone(523, 0, 0.22, "triangle", 0.6);
      tone(659, 0.1, 0.22, "triangle", 0.6);
      tone(784, 0.2, 0.3, "triangle", 0.65);
    },
  };

  function play(name) {
    var effect = EFFECTS[name];
    if (!effect) return;
    var c = getContext();
    if (!c) return;
    if (c.state === "suspended") {
      c.resume().catch(function () {});
    }
    try {
      effect();
    } catch (e) {
      // Bỏ qua lỗi audio — không ảnh hưởng tới chức năng chính của trang.
    }
  }

  window.SFX = { play: play };

  // Kỳ lân trước đây chỉ là ảnh trang trí tĩnh — thêm tương tác bấm vào phát
  // tiếng múa lân (CSS pointer-events cho .dragon được mở riêng trong custom.css).
  document.addEventListener("DOMContentLoaded", function () {
    var dragon = document.querySelector(".group__common.dragon");
    if (!dragon) return;
    dragon.addEventListener("click", function () {
      window.SFX.play("lion");
      dragon.classList.remove("dragon-dance");
      requestAnimationFrame(function () {
        dragon.classList.add("dragon-dance");
      });
    });
  });
})();
