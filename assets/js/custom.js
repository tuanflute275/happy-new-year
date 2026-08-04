document.addEventListener("DOMContentLoaded", function () {
    const settingBtn = document.getElementById("setting-btn");
    const settingMenu = document.getElementById("setting-menu");

    settingBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        settingMenu.classList.toggle("active");
    });

    // Đóng menu nếu nhấp ra ngoài
    document.addEventListener("click", function (e) {
        if (!settingBtn.contains(e.target) && !settingMenu.contains(e.target)) {
            settingMenu.classList.remove("active");
        }
    });
});