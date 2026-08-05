document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var loginView = document.getElementById("login-view");
  var dashboardView = document.getElementById("dashboard-view");
  var loginForm = document.getElementById("login-form");
  var loginError = document.getElementById("login-error");
  var logoutBtn = document.getElementById("logout-btn");
  var tableBody = document.getElementById("logs-tbody");
  var summaryEl = document.getElementById("summary-cards");
  var filterButtons = document.querySelectorAll(".filter-btn");
  var pageInfo = document.getElementById("page-info");
  var prevBtn = document.getElementById("prev-page");
  var nextBtn = document.getElementById("next-page");

  var previewBadge = document.getElementById("preview-badge");

  var state = { type: "", page: 1, pageSize: 50, totalPages: 1, previewMode: false };

  var TYPE_LABELS = {
    visit: "Truy cập",
    personalize_open: "Mở link riêng",
    interaction: "Tương tác",
  };

  // Dữ liệu mẫu dùng khi đăng nhập bằng mật khẩu "0" (xem giao diện, không
  // gọi API — chạy được cả khi mở qua Live Server / server tĩnh, không cần
  // backend/Turso thật).
  var MOCK_ROWS = [
    { id: 1, type: "visit", event: null, name: null, path: "/index.html", ip: "203.0.113.10", user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", created_at: "2027-02-06 00:00:05" },
    { id: 2, type: "personalize_open", event: null, name: "Minh", path: "/index.html", ip: "203.0.113.11", user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)", created_at: "2027-02-05 23:58:40" },
    { id: 3, type: "interaction", event: "xin_xam_open", name: null, path: "/index.html", ip: "203.0.113.12", user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)", created_at: "2027-02-05 23:55:12" },
    { id: 4, type: "interaction", event: "share_generate_link", name: null, path: "/index.html", ip: "203.0.113.13", user_agent: "Mozilla/5.0 (Android 14)", created_at: "2027-02-05 23:50:03" },
    { id: 5, type: "personalize_open", event: null, name: "Lan", path: "/index.html", ip: "203.0.113.14", user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", created_at: "2027-02-05 23:40:21" },
    { id: 6, type: "visit", event: null, name: null, path: "/firework.html", ip: "203.0.113.15", user_agent: "Mozilla/5.0 (iPad; CPU OS 17_0)", created_at: "2027-02-05 23:30:00" },
    { id: 7, type: "interaction", event: "change_song", name: null, path: "/index.html", ip: "203.0.113.16", user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", created_at: "2027-02-05 23:20:47" },
  ];
  var MOCK_SUMMARY = {
    byType: [
      { type: "visit", count: 128 },
      { type: "personalize_open", count: 34 },
      { type: "interaction", count: 76 },
    ],
    uniquePersonalizedNames: 21,
  };

  function showLogin() {
    loginView.classList.remove("hidden");
    dashboardView.classList.add("hidden");
  }

  function showDashboard() {
    loginView.classList.add("hidden");
    dashboardView.classList.remove("hidden");
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function fmtDate(s) {
    if (!s) return "";
    return s.replace("T", " ").replace("Z", "");
  }

  function renderSummary(summary) {
    var counts = {};
    (summary.byType || []).forEach(function (row) {
      counts[row.type] = row.count;
    });
    summaryEl.innerHTML =
      '<div class="stat-card"><div class="stat-value">' +
      (counts.visit || 0) +
      '</div><div class="stat-label">Lượt truy cập</div></div>' +
      '<div class="stat-card"><div class="stat-value">' +
      (counts.personalize_open || 0) +
      '</div><div class="stat-label">Mở link cá nhân hoá</div></div>' +
      '<div class="stat-card"><div class="stat-value">' +
      (counts.interaction || 0) +
      '</div><div class="stat-label">Tương tác tính năng</div></div>' +
      '<div class="stat-card"><div class="stat-value">' +
      (summary.uniquePersonalizedNames || 0) +
      '</div><div class="stat-label">Người nhận riêng biệt</div></div>';
  }

  function renderRows(rows) {
    if (!rows.length) {
      tableBody.innerHTML = '<tr><td colspan="7" class="empty-row">Chưa có dữ liệu</td></tr>';
      return;
    }
    tableBody.innerHTML = rows
      .map(function (r) {
        return (
          "<tr>" +
          "<td>" + escapeHtml(fmtDate(r.created_at)) + "</td>" +
          '<td><span class="type-badge type-' + escapeHtml(r.type) + '">' + escapeHtml(TYPE_LABELS[r.type] || r.type) + "</span></td>" +
          "<td>" + escapeHtml(r.event || "-") + "</td>" +
          "<td>" + escapeHtml(r.name || "-") + "</td>" +
          "<td>" + escapeHtml(r.path || "-") + "</td>" +
          "<td>" + escapeHtml(r.ip || "-") + "</td>" +
          '<td class="ua-cell" title="' + escapeHtml(r.user_agent || "") + '">' + escapeHtml(r.user_agent || "-") + "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function renderMockPage() {
    var rows = state.type ? MOCK_ROWS.filter(function (r) { return r.type === state.type; }) : MOCK_ROWS;
    renderSummary(MOCK_SUMMARY);
    renderRows(rows);
    state.totalPages = 1;
    pageInfo.textContent = "Trang 1 / 1 (" + rows.length + " dòng mẫu)";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
  }

  function enterPreviewMode() {
    state.previewMode = true;
    state.type = "";
    state.page = 1;
    filterButtons.forEach(function (b) {
      b.classList.toggle("active", !b.getAttribute("data-type"));
    });
    previewBadge.classList.remove("hidden");
    showDashboard();
    renderMockPage();
  }

  function exitPreviewMode() {
    state.previewMode = false;
    previewBadge.classList.add("hidden");
  }

  function loadLogs() {
    if (state.previewMode) {
      renderMockPage();
      return;
    }
    var url =
      "/api/logs?page=" + state.page + "&pageSize=" + state.pageSize + (state.type ? "&type=" + encodeURIComponent(state.type) : "");
    fetch(url, { credentials: "same-origin" })
      .then(function (res) {
        if (res.status === 401) {
          showLogin();
          return null;
        }
        return res.json();
      })
      .then(function (data) {
        if (!data) return;
        showDashboard();
        renderSummary(data.summary);
        renderRows(data.rows);
        state.totalPages = Math.max(1, Math.ceil(data.total / state.pageSize));
        pageInfo.textContent = "Trang " + state.page + " / " + state.totalPages + " (" + data.total + " dòng)";
        prevBtn.disabled = state.page <= 1;
        nextBtn.disabled = state.page >= state.totalPages;
      })
      .catch(function () {
        showLogin();
      });
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    loginError.classList.add("hidden");
    var username = document.getElementById("login-username").value;
    var password = document.getElementById("login-password").value;

    // Mật khẩu "0" -> xem giao diện với dữ liệu mẫu, hoàn toàn phía client,
    // không gọi API -> chạy được trên mọi server tĩnh (Live Server, v.v).
    if (password === "0") {
      enterPreviewMode();
      return;
    }

    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
      credentials: "same-origin",
    })
      .then(function (res) {
        if (res.status === 401) {
          throw new Error("Sai tài khoản hoặc mật khẩu.");
        }
        if (res.status === 500) {
          throw new Error("Server chưa cấu hình đăng nhập (thiếu DASHBOARD_USER/DASHBOARD_PASS trên môi trường này).");
        }
        if (!res.ok) {
          throw new Error("Không gọi được /api/auth/login (HTTP " + res.status + "). Trang này có đang chạy qua backend thật (Vercel/vercel dev) không?");
        }
        return res.json();
      })
      .then(function () {
        state.page = 1;
        loadLogs();
      })
      .catch(function (err) {
        loginError.textContent = err.message || "Không đăng nhập được, thử lại sau.";
        loginError.classList.remove("hidden");
      });
  });

  logoutBtn.addEventListener("click", function () {
    if (state.previewMode) {
      exitPreviewMode();
      showLogin();
      return;
    }
    fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }).then(function () {
      showLogin();
    });
  });

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      state.type = btn.getAttribute("data-type") || "";
      state.page = 1;
      loadLogs();
    });
  });

  prevBtn.addEventListener("click", function () {
    if (state.page > 1) {
      state.page--;
      loadLogs();
    }
  });
  nextBtn.addEventListener("click", function () {
    if (state.page < state.totalPages) {
      state.page++;
      loadLogs();
    }
  });

  loadLogs();
});
