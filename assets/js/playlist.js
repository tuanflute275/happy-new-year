/**
 * playlist.js — Danh sách phát nhạc Tết. Định nghĩa AUDIO_PLAYLIST (dùng
 * chung với audioList trong index.html để chọn bài ngẫu nhiên/khi hết bài),
 * dựng panel cho phép chọn thẳng 1 bài để phát ngay, ghi nhớ lựa chọn qua
 * localStorage để lần mở trang sau tự phát đúng bài đó.
 */
var AUDIO_PLAYLIST = [
  { file: "assets/audio/Chuyen-cu-bo-qua.mp3", title: "Chuyện Cũ Bỏ Qua" },
  { file: "assets/audio/Dau-chan-dau-tien.mp3", title: "Dấu Chân Đầu Tiên" },
  { file: "assets/audio/Di-Ve-Nha-Den-JustaTee.mp3", title: "Đi Về Nhà - Đen, JustaTee" },
  { file: "assets/audio/DiDeTroVe-SoobinHoangSon.mp3", title: "Đi Để Trở Về - Soobin Hoàng Sơn" },
  { file: "assets/audio/Lam-gi-phai-hot.mp3", title: "Làm Gì Phải Hốt" },
  { file: "assets/audio/Mot-nam-moi-binh-an.mp3", title: "Một Năm Mới Bình An" },
  { file: "assets/audio/NamQuaDaLamGi.mp3", title: "Năm Qua Đã Làm Gì" },
  { file: "assets/audio/NgayXuanLongPhungSumVay.mp3", title: "Ngày Xuân Long Phụng Sum Vầy" },
  { file: "assets/audio/Nu-cuoi-xuan.mp3", title: "Nụ Cười Xuân" },
  { file: "assets/audio/Tet-nay-con-se-ve.mp3", title: "Tết Này Con Sẽ Về" },
  { file: "assets/audio/Tet-trong-tam-hon.mp3", title: "Tết Trong Tâm Hồn" },
  { file: "assets/audio/TetDongDay.mp3", title: "Tết Đong Đầy" },
  { file: "assets/audio/Ve-nha-la-co-tet.mp3", title: "Về Nhà Là Có Tết" },
  { file: "assets/audio/VeNhaAnTet.mp3", title: "Về Nhà Ăn Tết" },
];

var PREFERRED_SONG_KEY = "preferred-song";

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var openBtn = document.getElementById("open-playlist-panel");
    var overlayEl = document.getElementById("playlist-overlay");
    var closeBtn = document.getElementById("playlist-close");
    var listEl = document.getElementById("playlist-list");
    var audioEl = document.getElementById("audioEl");

    if (!overlayEl || !listEl || !audioEl) return;

    // Dựng danh sách bài hát
    AUDIO_PLAYLIST.forEach(function (song) {
      var li = document.createElement("li");
      li.className = "playlist-item";
      li.dataset.file = song.file;
      li.innerHTML =
        '<span class="playlist-item-icon"><i class="fa-solid fa-play"></i>' +
        '<span class="playlist-eq"><span></span><span></span><span></span></span></span>' +
        '<span class="playlist-item-title"></span>';
      li.querySelector(".playlist-item-title").textContent = song.title;
      li.addEventListener("click", function () {
        playSong(song.file);
      });
      listEl.appendChild(li);
    });

    function playSong(file) {
      audioEl.src = file;
      audioEl.muted = false;
      audioEl.play().catch(function (error) {
        console.error("Phát nhạc thất bại: ", error);
      });
      try {
        localStorage.setItem(PREFERRED_SONG_KEY, file);
      } catch (e) {}
      // Nếu overlay "Nhấp vào bất kỳ đâu để phát nhạc" còn hiện, tắt luôn vì
      // người dùng vừa chủ động chọn bài để phát.
      var clickGate = document.getElementById("overlay");
      if (clickGate) clickGate.style.display = "none";
      updatePlayingHighlight();
    }

    function updatePlayingHighlight() {
      var rows = listEl.querySelectorAll(".playlist-item");
      for (var i = 0; i < rows.length; i++) {
        var isPlaying = audioEl.src.indexOf(rows[i].dataset.file) !== -1;
        rows[i].classList.toggle("playing", isPlaying && !audioEl.paused);
      }
    }
    audioEl.addEventListener("play", updatePlayingHighlight);
    audioEl.addEventListener("pause", updatePlayingHighlight);

    // Đồng bộ hiện/ẩn nút "Phát nhạc" / "Tạm dừng nhạc" trong menu cài đặt
    // dù bài hát được đổi từ nguồn nào (đổi ngẫu nhiên, chọn trong danh sách).
    function syncPlayPauseButtons() {
      var playBtn = document.getElementById("play-song");
      var pauseBtn = document.getElementById("pause-song");
      if (!playBtn || !pauseBtn) return;
      playBtn.style.display = audioEl.paused ? "inline" : "none";
      pauseBtn.style.display = audioEl.paused ? "none" : "inline";
    }
    audioEl.addEventListener("play", syncPlayPauseButtons);
    audioEl.addEventListener("pause", syncPlayPauseButtons);

    if (openBtn) {
      openBtn.addEventListener("click", function () {
        var menu = document.getElementById("setting-menu");
        if (menu) menu.classList.remove("active");
        overlayEl.classList.remove("hidden");
        updatePlayingHighlight();
      });
    }

    function closePanel() {
      overlayEl.classList.add("hidden");
    }
    if (closeBtn) closeBtn.addEventListener("click", closePanel);
    overlayEl.addEventListener("click", function (e) {
      if (e.target === overlayEl) closePanel();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePanel();
    });
  });
})();
