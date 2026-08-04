document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var FORTUNES = [
    {
      level: "Thượng Thượng Đại Cát",
      summary: "Vạn sự hanh thông, tài lộc dồi dào!",
      career: "Công việc thuận lợi, có cơ hội thăng tiến bất ngờ trong năm nay.",
      love: "Tình cảm nồng ấm, các mối quan hệ thêm khăng khít, bền chặt.",
      health: "Sức khỏe dồi dào, tinh thần phơi phới suốt cả năm.",
    },
    {
      level: "Đại Cát",
      summary: "Cửa tài mở rộng, quý nhân xuất hiện đúng lúc.",
      career: "Có người giúp đỡ đúng thời điểm khó khăn, dự án thành công ngoài mong đợi.",
      love: "Người ấy sẽ chủ động đến gần bạn hơn, đừng ngại tiến thêm một bước.",
      health: "Ăn ngủ điều độ, năm nay ít bệnh vặt, thể trạng cải thiện rõ.",
    },
    {
      level: "Trung Cát",
      summary: "Bình an là phúc, cứ vững tâm mà tiến bước.",
      career: "Công việc ổn định, chăm chỉ chắc chắn sẽ được đền đáp xứng đáng.",
      love: "Duyên lành đang đến gần, hãy mở lòng đón nhận thêm một chút.",
      health: "Nhớ nghỉ ngơi đủ giấc, đừng ôm việc quá nhiều mà quên bản thân.",
    },
    {
      level: "Tiểu Cát",
      summary: "Chuyện nhỏ như ý, chuyện lớn cần kiên nhẫn.",
      career: "Tiến độ có chậm chút nhưng kết quả cuối năm vẫn khiến bạn hài lòng.",
      love: "Tình cảm cần thêm thời gian vun đắp, đừng vội vàng kết luận.",
      health: "Chú ý dạ dày và giấc ngủ, hạn chế thức khuya vô cớ.",
    },
    {
      level: "Bình",
      summary: "Không sóng gió, không bứt phá — một năm an ổn.",
      career: "Giữ vững những gì đang có, đây là năm để tích lũy hơn là bung sức.",
      love: "Các mối quan hệ cũ vẫn bền, chưa phải lúc cho một khởi đầu mới.",
      health: "Sức khỏe ở mức ổn, tập thể dục đều đặn sẽ giúp bạn khá hơn nữa.",
    },
    {
      level: "Vượng Tài",
      summary: "Năm nay hợp làm ăn, tiền vào như nước!",
      career: "Ý tưởng kinh doanh nhỏ có thể mang lại nguồn thu bất ngờ.",
      love: "Chuyện tình cảm suôn sẻ khi cả hai cùng nhìn về một hướng.",
      health: "Nên vận động nhiều hơn để tiền bạc và sức khỏe cùng đi lên.",
    },
    {
      level: "Vượng Duyên",
      summary: "Năm của những cuộc gặp gỡ đẹp và bất ngờ.",
      career: "Networking tốt sẽ mở ra cơ hội mới ngoài dự tính.",
      love: "Người độc thân dễ gặp được đối tượng phù hợp trong năm nay.",
      health: "Tinh thần vui vẻ giúp bạn ít ốm vặt hơn hẳn năm ngoái.",
    },
    {
      level: "Hanh Thông",
      summary: "Khó khăn năm cũ ở lại, mọi việc năm mới đều trôi chảy.",
      career: "Những dự định bị trì hoãn lâu nay sẽ được khởi động lại thuận lợi.",
      love: "Hiểu lầm cũ được hoá giải, các mối quan hệ trở nên nhẹ nhõm hơn.",
      health: "Cơ thể phục hồi tốt sau giai đoạn mệt mỏi, nên duy trì lối sống lành mạnh.",
    },
  ];

  var overlay = document.getElementById("xin-xam-overlay");
  var result = document.getElementById("xin-xam-result");
  var openBtn = document.getElementById("xin-xam-btn");
  var closeBtn = document.getElementById("xin-xam-close");
  var againBtn = document.getElementById("xin-xam-again");

  if (!overlay || !result || !openBtn || !closeBtn || !againBtn) return;

  function renderFortune() {
    var fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    result.innerHTML =
      '<div class="xin-xam-level">' + fortune.level + "</div>" +
      '<div class="xin-xam-summary">' + fortune.summary + "</div>" +
      '<div class="xin-xam-row"><strong>Công việc:</strong> ' + fortune.career + "</div>" +
      '<div class="xin-xam-row"><strong>Tình yêu:</strong> ' + fortune.love + "</div>" +
      '<div class="xin-xam-row"><strong>Sức khỏe:</strong> ' + fortune.health + "</div>";

    result.classList.remove("xin-xam-reveal");
    requestAnimationFrame(function () {
      result.classList.add("xin-xam-reveal");
    });
  }

  function openModal() {
    overlay.classList.remove("hidden");
    renderFortune();
  }

  function closeModal() {
    overlay.classList.add("hidden");
  }

  openBtn.addEventListener("click", openModal);
  againBtn.addEventListener("click", renderFortune);
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });
});
