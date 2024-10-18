document.addEventListener("DOMContentLoaded", function () {
    const settingBtn = document.getElementById("setting-btn");
    const settingMenu = document.getElementById("setting-menu");

    settingBtn.addEventListener("click", function () {
        if (settingMenu.classList.contains("hidden")) {
            settingMenu.classList.remove("hidden");
            settingMenu.style.display = "block";
        } else {
            settingMenu.classList.add("hidden");
            settingMenu.style.display = "none";
        }
    });

    // Đóng menu nếu nhấp ra ngoài
    document.addEventListener("click", function (e) {
        if (!settingBtn.contains(e.target) && !settingMenu.contains(e.target)) {
            settingMenu.classList.add("hidden");
            settingMenu.style.display = "none";
        }
    });
});