# 🎉 Happy New Year 2026 — Landing Page

Landing page chúc mừng năm mới (Tết Nguyên Đán) được xây dựng bằng HTML/CSS/JavaScript thuần, không cần build tool hay framework. Trang gồm hiệu ứng đếm ngược sang năm mới, pháo hoa canvas, hoa rơi (hoa đào), đèn lồng, rồng, nhạc nền Tết và một trang pháo hoa tương tác riêng.

**Demo:** https://happy-new-year-2026-iota.vercel.app/

## ✨ Tính năng

- **Đếm ngược năm mới** (`count_down.js`): đếm ngược tới thời điểm mốc (`17/02/2026`), hiển thị số ngày/giờ/phút/giây còn lại với hiệu ứng lật số bằng GSAP (TweenMax).
- **Hiệu ứng chữ máy đánh chữ** (`script.js`): hiển thị lời chúc năm mới ngẫu nhiên (chọn từ danh sách `arrayList` khai báo trong `index.html`), tự gõ ra và xoá đi liên tục.
- **Pháo hoa nền** (`fireworks.js` + canvas `trails-canvas` / `main-canvas`): pháo hoa tự động bắn nền trong trang chủ.
- **Trang pháo hoa tương tác riêng** (`firework.html` + `scriptWatch.js`): mô phỏng pháo hoa đầy đủ tính năng (chọn loại/kích cỡ shell, chất lượng, chế độ finale, chụp phơi sáng, fullscreen...), mở qua menu cài đặt hoặc truy cập trực tiếp.
- **Hiệu ứng hoa đào rơi** (`snowflake.js` vẽ trên `canvas#canvasSnow`): hoa đào rơi có tương tác né chuột.
- **Nhạc nền Tết** (`assets/audio/*`): phát ngẫu nhiên từ danh sách bài hát, tự chuyển bài khi kết thúc, có overlay yêu cầu người dùng click để bật nhạc (đáp ứng chính sách autoplay của trình duyệt).
- **Menu cài đặt** (`custom.js` + `#setting-btn`, `#setting-menu`): đổi bài hát, play/pause nhạc, mở trang pháo hoa toàn màn hình.
- **Trang trí Tết**: đèn lồng, rồng, banner "tết xum vầy" hiển thị bằng ảnh trong `assets/img/`.
- **SEO / Social sharing**: đầy đủ Open Graph & Twitter Card meta tags trong `index.html`.

## 📁 Cấu trúc thư mục

```
happy-new-year/
├── index.html              # Trang chính: countdown, pháo hoa nền, nhạc, trang trí Tết
├── firework.html            # Trang pháo hoa tương tác đầy đủ tính năng (mở từ menu cài đặt)
├── assets/
│   ├── audio/               # Nhạc Tết (mp3), phát ngẫu nhiên/nối tiếp
│   ├── css/
│   │   ├── style.css         # Style chính cho layout Tết (đèn lồng, rồng, banner...)
│   │   ├── custom.css         # Style menu cài đặt (setting-btn, setting-menu)
│   │   ├── count_down.css     # Style khối đếm ngược & hiệu ứng chữ
│   │   ├── self.css           # Style hiệu ứng typewriter
│   │   ├── fireworks.css      # Style canvas pháo hoa nền (index.html)
│   │   └── fireworkWatch.css  # Style trang pháo hoa tương tác (firework.html)
│   ├── js/
│   │   ├── count_down.js      # Logic đếm ngược + animation số bằng GSAP, tạo khối #typewriter
│   │   ├── script.js          # Hiệu ứng typewriter (gõ/xoá lời chúc), cần arrayList + TIME_WRITER
│   │   ├── self.js            # Chèn banner tự quảng bá "Hire Me" (avatar + QR) vào <body>
│   │   ├── custom.js          # Toggle menu cài đặt
│   │   ├── fireworks.js       # Engine pháo hoa nền cho index.html
│   │   ├── scriptWatch.js     # Engine pháo hoa đầy đủ tính năng cho firework.html
│   │   └── snowflake.js       # Hiệu ứng hoa đào rơi trên canvas
│   └── img/                  # Logo, avatar, QR, ảnh trang trí (đèn lồng, rồng, hoa đào...)
└── .vscode/settings.json     # Cấu hình Live Server (port 5501)
```

> Lưu ý: `script.js` (hiệu ứng typewriter) phụ thuộc vào hai biến toàn cục `arrayList` và `TIME_WRITER`, được khai báo trong `<script>` inline của `index.html` (dòng ~94-108) và **phải load trước** `script.js` trong thẻ `<script>`.

## 🚀 Cách chạy dự án

Vì đây là dự án static HTML/CSS/JS, chỉ cần một static server (không cần Node/npm build):

### Cách 1: VSCode Live Server (khuyến nghị, đã cấu hình sẵn)
1. Cài extension **Live Server** trong VSCode.
2. Mở `index.html`, chuột phải → **Open with Live Server** (project đã cấu hình cổng `5501` trong `.vscode/settings.json`).

### Cách 2: Dùng server tĩnh bất kỳ
```bash
# Python
python -m http.server 5500

# Node (http-server)
npx http-server -p 5500
```
Sau đó mở `http://localhost:5500/index.html`.

> ⚠️ Không nên mở trực tiếp file `index.html` bằng `file://` vì một số trình duyệt chặn autoplay/canvas khi không chạy qua HTTP server.

## 🎨 Tuỳ biến nội dung

- **Đổi mốc thời gian đếm ngược**: sửa biến `dateString` trong [assets/js/count_down.js](assets/js/count_down.js) (định dạng `dd/MM/yyyy`).
- **Đổi lời chúc năm mới**: sửa mảng `arrayList` trong [index.html](index.html) (khoảng dòng 96-107).
- **Đổi nhạc nền**: thêm/xoá file mp3 trong `assets/audio/` và cập nhật mảng `audioList` trong `index.html` (khoảng dòng 112-121).
- **Đổi ảnh trang trí / favicon / OG image**: thay file trong `assets/img/` và cập nhật thẻ `<meta>` tương ứng ở đầu `index.html`.
- **Tuỳ biến pháo hoa (firework.html)**: dùng menu **Settings** (icon bánh răng) ngay trên trang để chọn loại/kích thước shell, chất lượng, hiệu ứng phơi sáng, chế độ finale...

## 🛠️ Công nghệ sử dụng

- HTML5 / CSS3 / Vanilla JavaScript (không dùng framework)
- [GSAP (TweenMax) 2.0.2](https://cdnjs.com/libraries/gsap) — animation số đếm ngược, chữ, hoa văn
- [Font Awesome 6.6.0](https://cdnjs.com/libraries/font-awesome) — icon menu cài đặt
- `Stage.js`, `MyMath.js`, `fscreen.js` (thư viện nội bộ của mẫu pháo hoa gốc, load qua CDN S3) — engine vẽ pháo hoa canvas
- Canvas API — vẽ hoa đào rơi, pháo hoa

## 📌 Ghi chú

- Trang phụ thuộc vào một số script/CDN bên ngoài (GSAP, Font Awesome, thư viện pháo hoa host trên S3) — cần kết nối internet khi chạy.
- `assets/js/script.js` yêu cầu biến toàn cục `arrayList` và `TIME_WRITER` đã được khai báo trước đó (định nghĩa inline trong `index.html`) — nếu tách file, cần đảm bảo thứ tự load script đúng như trong `index.html`.
- Do chính sách autoplay của trình duyệt, nhạc chỉ thực sự phát sau khi người dùng click vào overlay "Nhấp vào bất kỳ đâu để phát nhạc".

## 👤 Tác giả

**TUANFLUTE** — [tuanflute275.github.io/introduce](https://tuanflute275.github.io/introduce/)
