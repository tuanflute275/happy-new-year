(function () {
  "use strict";

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  var params = new URLSearchParams(window.location.search);
  var rawName = params.get("to");

  if (rawName && typeof arrayList !== "undefined") {
    var name = escapeHtml(rawName.trim().slice(0, 40));
    if (name) {
      var greeting =
        "Chúc mừng năm mới " + name + "!\n" +
        "Chúc bạn năm mới 2027 an khang, thịnh vượng và vạn sự như ý.";
      arrayList.length = 0;
      arrayList.push(greeting);
    }
  }
})();
