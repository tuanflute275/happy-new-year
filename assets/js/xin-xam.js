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
    {
      level: "Phát Đạt",
      summary: "Sự nghiệp bứt phá, công sức năm cũ bắt đầu ra hoa trái.",
      career: "Một cơ hội lớn xuất hiện, nắm bắt nhanh sẽ đổi vận cả năm.",
      love: "Đối phương coi trọng và ủng hộ bạn nhiều hơn bạn nghĩ.",
      health: "Năng lượng tràn đầy, thích hợp bắt đầu một thói quen rèn luyện mới.",
    },
    {
      level: "An Khang",
      summary: "Gia đạo bình an, sức khỏe là tài sản lớn nhất năm nay.",
      career: "Không có biến động lớn, cứ làm tốt phần việc của mình là đủ.",
      love: "Gia đình, người thân là chỗ dựa vững chắc cho bạn suốt năm.",
      health: "Ít ốm đau, chỉ cần giữ nếp sinh hoạt điều độ như hiện tại.",
    },
    {
      level: "Như Ý",
      summary: "Muốn gì được gì, năm nay vận số ủng hộ bạn.",
      career: "Đề xuất, kế hoạch đưa ra đều được đón nhận thuận lợi.",
      love: "Điều bạn mong mỏi trong tình cảm sẽ dần trở thành sự thật.",
      health: "Cơ thể nhẹ nhõm, tâm trạng thoải mái kéo theo sức khỏe tốt.",
    },
    {
      level: "Cát Tường",
      summary: "Điềm lành báo trước, mọi chuyện đều có dấu hiệu tốt.",
      career: "Một lời đề nghị hoặc tin vui bất ngờ sẽ đến trong vài tháng tới.",
      love: "Một cuộc gặp tưởng chừng ngẫu nhiên lại mở ra điều ý nghĩa.",
      health: "Nên đi khám sức khỏe định kỳ để yên tâm cả năm.",
    },
    {
      level: "Đoàn Viên",
      summary: "Năm của sum vầy, tình cảm gia đình ấm áp hơn bao giờ hết.",
      career: "Đồng nghiệp, đối tác sẵn sàng hỗ trợ khi bạn cần.",
      love: "Các cuộc đoàn tụ, họp mặt mang lại nhiều kỷ niệm đẹp.",
      health: "Ăn uống sum vầy điều độ, tránh lạm dụng rượu bia ngày Tết.",
    },
    {
      level: "Thăng Hoa",
      summary: "Nỗ lực âm thầm nay đến lúc được công nhận rực rỡ.",
      career: "Vị trí, vai trò của bạn được nâng lên rõ rệt trong năm nay.",
      love: "Mối quan hệ tiến triển lên một cột mốc mới, đáng để mong chờ.",
      health: "Tinh thần phấn chấn giúp bạn có thêm động lực chăm sóc bản thân.",
    },
    {
      level: "Khai Vận",
      summary: "Vận xui năm cũ khép lại, một chương mới đang mở ra.",
      career: "Đổi hướng, đổi cách làm lúc này sẽ mang lại kết quả bất ngờ.",
      love: "Đóng lại một trang cũ để đón nhận một cơ hội phù hợp hơn.",
      health: "Nên thay đổi vài thói quen chưa tốt để bắt đầu vận mới thuận lợi.",
    },
    {
      level: "Tấn Tài Tấn Lộc",
      summary: "Tiền vào cửa trước, lộc vào cửa sau, năm sung túc đang tới.",
      career: "Thu nhập có thêm nguồn mới, công sức bỏ ra không hề vô ích.",
      love: "Được người ấy quan tâm, chăm sóc nhiều hơn cả về vật chất và tinh thần.",
      health: "Có điều kiện chăm sóc bản thân tốt hơn, nên tận dụng đầu tư cho sức khỏe.",
    },
    {
      level: "Vạn Sự Như Ý",
      summary: "Trăm sự đều thuận, ngàn việc đều xuôi trong năm mới này.",
      career: "Mọi kế hoạch lớn nhỏ đều có cơ hội về đích đúng hạn.",
      love: "Cả người độc thân và đã yêu đều tìm thấy sự bình yên trong tình cảm.",
      health: "Một năm khỏe mạnh, ít lo âu, sống trọn từng khoảnh khắc.",
    },
    {
      level: "Thuận Buồm Xuôi Gió",
      summary: "Ra khơi gặp sóng lành, làm việc gì cũng thuận theo ý muốn.",
      career: "Những chuyến đi, những dự án mới đều khởi đầu và kết thúc êm đẹp.",
      love: "Không có trắc trở lớn, tình cảm cứ thế nhẹ nhàng tiến triển.",
      health: "Cơ thể thích nghi tốt với thay đổi, ít gặp trục trặc bất ngờ.",
    },
    {
      level: "Mã Đáo Thành Công",
      summary: "Ngựa về đích, việc khó cũng hoá thành công trong chớp mắt.",
      career: "Một việc tưởng chừng bế tắc bất ngờ tìm được lối ra ngoạn mục.",
      love: "Sự kiên trì theo đuổi tình cảm của bạn sẽ được đền đáp xứng đáng.",
      health: "Năng lượng bền bỉ, thích hợp để theo đuổi một mục tiêu dài hạn.",
    },
    {
      level: "Tam Dương Khai Thái",
      summary: "Ba nguồn khí tốt hội tụ, mở ra một năm vượng khí toàn diện.",
      career: "Công việc, tài chính và các mối quan hệ cùng lúc khởi sắc.",
      love: "Một giai đoạn mới trong tình cảm bắt đầu đầy hứa hẹn.",
      health: "Thể chất và tinh thần đều ở trạng thái tốt hiếm có trong năm.",
    },
    {
      level: "Ngũ Phúc Lâm Môn",
      summary: "Năm phúc lành cùng gõ cửa: phú, thọ, khang, ninh, đức.",
      career: "Công việc vừa ổn định vừa có thêm cơ hội phát triển thêm.",
      love: "Gia đình nhỏ hoặc người thân yêu quanh bạn đều bình an, hoà thuận.",
      health: "Sức khỏe của cả người lớn tuổi trong nhà cũng ổn định, ít lo toan.",
    },
    {
      level: "Kim Ngân Đầy Nhà",
      summary: "Của cải tích lũy dần đầy, năm nay hợp tiết kiệm và đầu tư.",
      career: "Một khoản thu nhập phụ hoặc thưởng bất ngờ có thể xuất hiện.",
      love: "Cùng người ấy lên kế hoạch tài chính chung sẽ giúp gắn kết hơn.",
      health: "Dư dả hơn về vật chất giúp bạn đầu tư đúng mức cho sức khỏe.",
    },
    {
      level: "Hỷ Sự Liên Miên",
      summary: "Tin vui nối tiếp tin vui, niềm hạnh phúc không chỉ đến một lần.",
      career: "Liên tiếp có tin tốt về công việc trong vài tháng đầu năm.",
      love: "Có thể sẽ có một sự kiện đáng nhớ (đính hôn, sum họp, tái hợp...).",
      health: "Tâm trạng vui vẻ thường xuyên giúp bạn ăn ngon, ngủ yên hơn.",
    },
    {
      level: "Xuân Phong Đắc Ý",
      summary: "Gió xuân ấm áp, mọi ước nguyện đầu năm đều có cơ hội thành hình.",
      career: "Ý tưởng táo bạo được ủng hộ, đây là lúc để thử điều mới.",
      love: "Bạn tự tin và cuốn hút hơn trong mắt người đối diện năm nay.",
      health: "Tinh thần phóng khoáng, dễ duy trì thói quen sống tích cực.",
    },
    {
      level: "Nghênh Xuân Tiếp Phúc",
      summary: "Đón xuân về, phúc lành theo sau, năm mới nhiều điều để mong chờ.",
      career: "Khởi đầu năm thuận lợi, đà tốt này có thể kéo dài suốt nhiều tháng.",
      love: "Một lời chúc, một cuộc gặp đầu năm có thể mở ra duyên lành bất ngờ.",
      health: "Bắt đầu năm mới với thói quen tốt sẽ duy trì được lâu dài.",
    },
    {
      level: "Vượng Khí Xung Thiên",
      summary: "Khí vượng bốc cao, năm của sự tự tin và bứt phá mạnh mẽ.",
      career: "Dám nghĩ dám làm, những quyết định táo bạo mang lại kết quả tốt.",
      love: "Sự chủ động của bạn trong tình cảm sẽ tạo ra khác biệt rõ rệt.",
      health: "Thể lực sung mãn, rất hợp để bắt đầu một môn thể thao mới.",
    },
    {
      level: "Long Vân Đắc Hội",
      summary: "Rồng gặp mây, thời và vận cùng hội tụ đúng lúc.",
      career: "Đúng người, đúng thời điểm sẽ xuất hiện để giúp việc lớn thành công.",
      love: "Một cuộc gặp định mệnh có thể đến vào thời điểm bạn không ngờ tới.",
      health: "Vận động đúng lúc, đúng cách sẽ mang lại hiệu quả rõ rệt năm nay.",
    },
    {
      level: "Phúc Tinh Cao Chiếu",
      summary: "Sao phúc chiếu sáng, soi đường cho mọi quyết định năm nay.",
      career: "Những lựa chọn quan trọng đưa ra trong năm đều đi đúng hướng.",
      love: "Bạn được nhiều người quý mến, cơ hội mở lòng cũng nhiều hơn.",
      health: "Giấc ngủ và tinh thần ổn định, ít bị xáo trộn bởi lo âu vụn vặt.",
    },
    {
      level: "Đắc Nhân Tâm",
      summary: "Được lòng người, năm nay quan hệ là chìa khoá cho mọi việc.",
      career: "Sự tín nhiệm từ đồng nghiệp, cấp trên giúp công việc thuận lợi hơn.",
      love: "Cách bạn quan tâm người khác sẽ được đáp lại bằng sự trân trọng.",
      health: "Tâm lý nhẹ nhõm khi ít phải đối đầu, tranh cãi giúp sức khoẻ ổn định.",
    },
    {
      level: "Đại Triển Hồng Đồ",
      summary: "Hoài bão lớn có đất để triển khai, năm của những dự định dài hơi.",
      career: "Kế hoạch dài hạn được khởi động và có nền tảng tốt để phát triển.",
      love: "Cùng nhau xây dựng một mục tiêu chung sẽ khiến tình cảm bền chặt hơn.",
      health: "Nên có kế hoạch chăm sóc sức khoẻ dài hạn thay vì chỉ đối phó tạm thời.",
    },
    {
      level: "Bình An Vô Sự",
      summary: "Không gặp biến cố lớn, một năm nhẹ nhàng và ít lo toan.",
      career: "Không có xáo trộn bất ngờ, công việc cứ vậy mà đều đặn trôi qua.",
      love: "Mối quan hệ hiện tại tiếp tục ổn định, không có sóng gió đáng kể.",
      health: "Sức khoẻ duy trì ổn, không có vấn đề nghiêm trọng nào phát sinh.",
    },
    {
      level: "Nhân Duyên Tốt Đẹp",
      summary: "Duyên người, duyên việc đều đến đúng lúc, đúng người.",
      career: "Người đồng hành, đối tác phù hợp sẽ xuất hiện giúp công việc suôn sẻ.",
      love: "Một mối quan hệ mới hoặc cũ đều có chiều hướng phát triển tích cực.",
      health: "Tinh thần thư thái vì các mối quan hệ quanh bạn đều hoà hợp.",
    },
    {
      level: "Tài Lộc Vượng Phát",
      summary: "Của để dành tăng lên, năm nay tiền bạc rất có duyên với bạn.",
      career: "Cơ hội tăng thu nhập xuất hiện nếu bạn chủ động tìm kiếm.",
      love: "Chia sẻ tài chính minh bạch với người ấy giúp mối quan hệ bền hơn.",
      health: "Có điều kiện hơn để đầu tư cho việc khám và chăm sóc sức khoẻ.",
    },
    {
      level: "Gia Đạo Hưng Long",
      summary: "Nhà cửa yên ấm, việc lớn việc nhỏ trong gia đình đều hanh thông.",
      career: "Được gia đình hậu thuẫn, bạn có thêm động lực để cố gắng hơn.",
      love: "Không khí gia đình ấm áp lan sang cả các mối quan hệ tình cảm.",
      health: "Bữa ăn gia đình đều đặn giúp sức khoẻ cả nhà được cải thiện.",
    },
    {
      level: "Danh Lợi Song Toàn",
      summary: "Vừa có tiếng vừa có miếng, thành quả được ghi nhận xứng đáng.",
      career: "Cả danh tiếng và thu nhập đều có cơ hội tăng lên cùng lúc.",
      love: "Sự thành công của bạn khiến người ấy thêm tự hào và gắn bó.",
      health: "Áp lực thành công không ảnh hưởng nhiều nếu biết cân bằng nghỉ ngơi.",
    },
    {
      level: "Tâm An Sự Thành",
      summary: "Tâm có an thì việc mới thành, năm nay hợp sống chậm mà chắc.",
      career: "Giữ tâm lý ổn định giúp bạn ra quyết định sáng suốt hơn.",
      love: "Sự bình thản của bạn là điểm cộng lớn trong mắt người thương.",
      health: "Thiền, yoga hoặc các hoạt động thư giãn sẽ rất hợp với bạn năm nay.",
    },
  ];

  var overlay = document.getElementById("xin-xam-overlay");
  var result = document.getElementById("xin-xam-result");
  var openBtn = document.getElementById("xin-xam-btn");
  var closeBtn = document.getElementById("xin-xam-close");
  var againBtn = document.getElementById("xin-xam-again");

  if (!overlay || !result || !openBtn || !closeBtn || !againBtn) return;

  // Các quẻ tốt sẽ kích hoạt confetti
  var GOOD_LEVELS = [
    "Thượng Thượng Đại Cát", "Đại Cát", "Vượng Tài", "Vượng Duyên",
    "Phát Đạt", "Như Ý", "Cát Tường", "Thăng Hoa", "Tài Lộc Vượng Phát",
    "Danh Lợi Song Toàn", "Đại Triển Hồng Đồ"
  ];

  var CONFETTI_COLORS = [
    "#ff4d4d","#ffcc00","#ff9900","#ff6699","#66ccff","#99ff66","#ff66cc","#ffd700"
  ];

  function launchConfetti() {
    // Tạo container nếu chưa có
    var container = document.getElementById("xinxam-confetti-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "xinxam-confetti-container";
      document.body.appendChild(container);
    }
    container.innerHTML = "";

    for (var i = 0; i < 70; i++) {
      (function(idx) {
        setTimeout(function() {
          var c = document.createElement("div");
          c.className = "xinxam-confetti-piece";
          c.style.left = (10 + Math.random() * 80) + "%";
          c.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
          var size = (6 + Math.random() * 9) + "px";
          c.style.width = size;
          c.style.height = size;
          c.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
          c.style.animationDuration = (0.9 + Math.random() * 1.4) + "s";
          c.style.animationDelay = (Math.random() * 0.4) + "s";
          container.appendChild(c);
          setTimeout(function() { if (c.parentNode) c.parentNode.removeChild(c); }, 2800);
        }, idx * 18);
      })(i);
    }
  }

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

    if (window.SFX) SFX.play("pop");

    // Bắn confetti + tiếng tiền lì xì nếu rút được quẻ tốt
    if (GOOD_LEVELS.indexOf(fortune.level) !== -1) {
      setTimeout(launchConfetti, 300);
      setTimeout(function () {
        if (window.SFX) SFX.play("coin");
      }, 300);
    }
  }

  function openModal() {
    overlay.classList.remove("hidden");
    renderFortune();
  }

  function closeModal() {
    overlay.classList.add("hidden");
    // Dọn confetti khi đóng
    var container = document.getElementById("xinxam-confetti-container");
    if (container) container.innerHTML = "";
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

