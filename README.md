# 🎉 Happy New Year 2027 — Landing Page

Landing page chúc mừng năm mới (Tết Nguyên Đán) — HTML/CSS/JavaScript thuần (không framework), có thêm một lớp API nhẹ (Vercel Serverless Functions + Turso) để ghi log truy cập và dashboard xem log. Trang có thể tự deploy tĩnh 100%, phần API là optional (chỉ cần cho log/dashboard).

**Demo:** https://happy-new-year-2027-iota.vercel.app/

## ✨ Tính năng

### Trải nghiệm chính
- **Đếm ngược Tết** (`count_down.js`): đếm ngược tới mốc Tết (`06/02/2027`), số lật bằng GSAP (TweenMax). Kèm hiển thị **lịch âm hôm nay** (thư viện `lunar-javascript`), tự cập nhật mỗi ngày.
- **Hiệu ứng "Giao thừa"**: khi đếm ngược chạm 0 → tự bắn pháo hoa **finale** trong 60s + hiện banner "Chúc mừng năm mới" (`celebrate.js`).
- **Lời chúc kiểu máy đánh chữ** (`script.js`): chọn ngẫu nhiên 1 câu từ `arrayList` (khai báo inline trong `index.html`), tự gõ ra/xoá đi liên tục. Hỗ trợ **cá nhân hoá qua URL** `?to=Tên` (`personalize.js`) — hiện "Chúc mừng năm mới [Tên]" thay cho câu ngẫu nhiên, kèm ảnh đại diện nếu link có `&avatar=id`.
- **Pháo hoa nền** (`fireworks.js`, canvas) trên trang chủ + **trang pháo hoa tương tác riêng** `firework.html` (`scriptWatch.js`) — chọn loại/kích cỡ shell, chất lượng, chế độ finale, phơi sáng, fullscreen...
- **Mưa hoa đào 🌸 + hoa mai 🌼** rơi nhẹ nhàng (`snowflake.js`, canvas) — trộn 2 loại hoa (ảnh `hoa_dao.png` / `hoa_mai.png`), có tương tác né chuột.
- **Kỳ lân bấm được** — click vào hình kỳ lân ở góc trái phát tiếng trống + thanh la múa lân kèm animation nhún nhảy (`sfx.js`).
- **Hiệu ứng âm thanh khi tương tác** (`sfx.js`): tự tổng hợp bằng Web Audio API (không cần file audio) — tiếng tiền/lì xì, múa lân, đập heo, vỡ heo, gói bánh, chuông thành công. Âm lượng nhỏ, không lấn nhạc nền.
- **Nhạc nền Tết** (14 bài, `assets/audio/`) — phát ngẫu nhiên/tự chuyển bài, có overlay yêu cầu click để bật (theo chính sách autoplay), loading indicator khi đang tải. **Danh sách phát** (`playlist.js`) trong menu cài đặt: chọn đúng bài muốn nghe, lưu lựa chọn qua `localStorage`.
- **Trang trí Tết**: đèn lồng, kỳ lân/rồng, banner "tết xum vầy" (`assets/img/`).

### Tương tác & cá nhân hoá
- **Xin xăm đầu năm** (`xin-xam.js`) — nút 🧧 nổi, rút 1 trong 36 quẻ ngẫu nhiên (lời chúc công việc/tình yêu/sức khỏe), quẻ tốt kèm hiệu ứng confetti + tiếng tiền rơi.
- **Đập lợn tiết kiệm** (`minigame.js`) — đập heo liên tục nhận "lộc" ngẫu nhiên, vỡ heo hiện tổng lộc + xếp hạng (Heo Đất/Bạc/Vàng/Kim Cương) kèm flash + rung + tiền rơi.
- **Gói bánh chưng** (`banhchung.js`) — xếp đúng thứ tự 7 lớp truyền thống (lá dong → gạo nếp → đậu xanh → thịt heo → đậu xanh → gạo nếp → buộc lạt), tốc độ gói ra danh hiệu.
- **Tạo lời chúc riêng & chia sẻ** (`share.js` + `avatar-crop.js`) — nhập tên người nhận, tuỳ chọn thêm ảnh đại diện (crop/zoom bằng canvas tự viết, lưu qua `/api/avatar`), sinh link `?to=Tên&avatar=id`, tự sinh **QR code**, copy link hoặc chia sẻ trực tiếp (Web Share API).

### Cài đặt & tối ưu
- **Menu cài đặt** (`custom.js`): đổi nhạc, danh sách phát, **Chế độ nhẹ** (tắt pháo hoa nền + hoa rơi cho máy yếu, nhớ lựa chọn), tạo lời chúc & chia sẻ.
- **PWA — Add to Home Screen**: `manifest.json` + Service Worker (`sw.js`) precache toàn bộ CSS/JS/icon, HTML network-first (luôn mới khi online), CSS/JS/ảnh/nhạc cache-first (mở lại nhanh). Hỗ trợ cả Android (Chrome) và iOS Safari.
- **Responsive mobile**: tiêu đề co giãn theo `vw` (không rớt dòng), layout/ảnh trang trí tự thu nhỏ ở màn hình nhỏ.

### Backend nhẹ (Vercel Functions + Turso) — optional
- **Ghi log & Dashboard** (`api/*.js` + `dashboard.html`) — ghi 3 loại: lượt truy cập, lượt mở link cá nhân hoá, tương tác tính năng. Lưu vào **Turso** (SQLite serverless, persistent). Dashboard xem log tại `/dashboard.html`, yêu cầu đăng nhập (cookie session ký HMAC-SHA256). Xem chi tiết ở mục [🔐 Ghi log & Dashboard](#-ghi-log--dashboard-turso-optional) dưới đây.

### SEO / Social sharing
Đầy đủ Open Graph & Twitter Card meta tags trong `index.html`.

## 📁 Cấu trúc thư mục

```
happy-new-year/
├── index.html                # Trang chính: countdown, pháo hoa nền, nhạc, mini-game, trang trí Tết
├── firework.html              # Trang pháo hoa tương tác đầy đủ tính năng
├── dashboard.html              # Dashboard xem log (yêu cầu đăng nhập)
├── manifest.json                # PWA manifest (icon, tên, theme màu)
├── sw.js                          # PWA Service Worker (precache + cache-first/network-first)
├── api/                            # Vercel Serverless Functions (optional — chỉ cho log/dashboard)
│   ├── _db.js                       # Turso client + schema + insert/query log & avatar
│   ├── _auth.js                      # Ký/verify cookie session (HMAC-SHA256, stateless)
│   ├── log.js                         # POST — ghi log (public)
│   ├── logs.js                         # GET — đọc log cho dashboard (cần session hợp lệ)
│   ├── avatar.js                        # GET/POST — lưu & phục vụ ảnh đại diện cá nhân hoá
│   └── auth/
│       ├── login.js                       # POST — đăng nhập, cấp cookie session
│       └── logout.js                       # POST — xoá cookie session
├── assets/
│   ├── audio/                 # 14 bài nhạc Tết (mp3, đã nén 96kbps)
│   ├── css/
│   │   ├── style.css            # Layout chính (đèn lồng, kỳ lân, banner, lời chúc...)
│   │   ├── custom.css            # Menu cài đặt, các panel/nút nổi, mini-game, hiệu ứng
│   │   ├── count_down.css        # Khối đếm ngược & hiệu ứng chữ digital
│   │   ├── self.css              # Banner tự quảng bá "Hire Me"
│   │   ├── fireworks.css         # Canvas pháo hoa nền (index.html)
│   │   ├── fireworkWatch.css     # Trang pháo hoa tương tác (firework.html)
│   │   └── dashboard.css         # Trang dashboard xem log
│   ├── js/
│   │   ├── count_down.js           # Đếm ngược + animation số (GSAP) + lịch âm + phát hiện "giao thừa"
│   │   ├── celebrate.js             # Hiệu ứng banner + pháo hoa finale khi đếm ngược về 0
│   │   ├── script.js                 # Typewriter lời chúc (cần arrayList + TIME_WRITER)
│   │   ├── personalize.js             # Cá nhân hoá lời chúc + avatar qua ?to=Tên&avatar=id
│   │   ├── self.js                     # Banner "Hire Me" + tương tác bấm kỳ lân
│   │   ├── sfx.js                       # Hiệu ứng âm thanh (Web Audio API, tự tổng hợp)
│   │   ├── xin-xam.js                    # Xin xăm đầu năm (36 quẻ + confetti)
│   │   ├── minigame.js                    # Mini-game "Đập lợn tiết kiệm"
│   │   ├── banhchung.js                    # Mini-game "Gói bánh chưng"
│   │   ├── playlist.js                      # Panel danh sách phát nhạc
│   │   ├── share.js                          # Panel tạo lời chúc riêng & chia sẻ + QR code
│   │   ├── avatar-crop.js                     # Widget chọn/crop/zoom ảnh đại diện (canvas)
│   │   ├── tracker.js                          # Ghi log truy cập/tương tác, gửi về /api/log
│   │   ├── custom.js                            # Toggle menu cài đặt
│   │   ├── fireworks.js                          # Engine pháo hoa nền (index.html)
│   │   ├── scriptWatch.js                         # Engine pháo hoa đầy đủ tính năng (firework.html)
│   │   ├── snowflake.js                            # Mưa hoa đào + hoa mai trên canvas
│   │   ├── dashboard.js                             # Logic trang dashboard (login, filter, phân trang)
│   │   └── vendor/                                   # fscreen.js, Stage.js, MyMath.js — tự host, không phụ thuộc CDN ngoài
│   └── img/                    # Logo, avatar, QR, icon PWA, ảnh trang trí (đèn lồng, kỳ lân, hoa đào, hoa mai...)
├── scripts/build.js            # Build: minify CSS, obfuscate JS tự viết, nén ảnh (sharp) → dist/
├── package.json / package-lock.json
├── vercel.json                  # buildCommand: npm run build, outputDirectory: dist
├── .env.example                  # Mẫu biến môi trường (Turso + dashboard) — copy thành .env
└── .vscode/settings.json          # Cấu hình Live Server (port 5501)
```

> **Lưu ý phụ thuộc biến toàn cục:** `script.js` (typewriter) cần `arrayList` + `TIME_WRITER` khai báo trong `<script>` inline của `index.html` (trước khi `script.js` load). `personalize.js` phải load **trước** `script.js` (ghi đè `arrayList` nếu có `?to=`) nhưng **sau** khối inline đó. Nếu thêm/sửa thứ tự script trong `index.html`, giữ đúng thứ tự này.

## 🚀 Cách chạy dự án

Trang tĩnh chạy được ngay không cần build — chỉ cần 1 static server:

### Cách 1: VSCode Live Server (khuyến nghị, đã cấu hình sẵn)
1. Cài extension **Live Server**.
2. Mở `index.html` → chuột phải → **Open with Live Server** (cổng `5501` theo `.vscode/settings.json`).

### Cách 2: Server tĩnh bất kỳ
```bash
python -m http.server 5500        # hoặc: npx http-server -p 5500
```
Mở `http://localhost:5500/index.html`.

> ⚠️ Không mở trực tiếp bằng `file://` — một số trình duyệt chặn autoplay/canvas/Service Worker khi không chạy qua HTTP(S).
> ⚠️ Server tĩnh (Live Server, `http.server`...) **không** chạy được thư mục `api/` — dashboard/log cần `vercel dev` hoặc deploy thật (xem mục Dashboard bên dưới). Trang chính (`index.html`, `firework.html`) vẫn hoạt động đầy đủ trên server tĩnh.

### Build production (minify + obfuscate + nén ảnh)
```bash
npm install
npm run build     # sinh ra dist/ (đã gitignore) — Vercel tự chạy lệnh này khi deploy
```

## 🎨 Tuỳ biến nội dung

- **Đổi mốc đếm ngược**: sửa `dateString` trong [assets/js/count_down.js](assets/js/count_down.js) (`dd/MM/yyyy`).
- **Đổi lời chúc**: sửa mảng `arrayList` trong [index.html](index.html) (khối `<script>` inline, trước `personalize.js`).
- **Đổi nhạc nền**: thêm/xoá file mp3 trong `assets/audio/` và cập nhật `AUDIO_PLAYLIST` trong [assets/js/playlist.js](assets/js/playlist.js) — đây là nguồn duy nhất cho cả panel danh sách phát và logic chọn ngẫu nhiên.
- **Đổi ảnh trang trí / favicon / OG image**: thay file trong `assets/img/` và cập nhật `<meta>`/`<link>` tương ứng ở đầu `index.html`.
- **Đổi quẻ xin xăm**: sửa mảng `FORTUNES` trong [assets/js/xin-xam.js](assets/js/xin-xam.js).
- **Tuỳ biến pháo hoa** (`firework.html`): dùng menu **Settings** (icon bánh răng) trên trang đó.
- **Đổi icon PWA**: thay `assets/img/icon-192.png` / `icon-512.png`, cập nhật `manifest.json` nếu đổi kích thước.

## 🔐 Ghi log & Dashboard (Turso) — optional

Ghi 3 loại sự kiện — lượt truy cập (time/IP/user-agent), lượt mở link cá nhân hoá (`?to=Tên`), tương tác tính năng (xin xăm, mini-game, đổi nhạc, chia sẻ...) — vào **Turso** (SQLite serverless, persistent qua các lần deploy). Xem log tại `/dashboard.html`, yêu cầu đăng nhập. **Không bắt buộc** — thiếu phần này trang chính vẫn chạy đầy đủ, chỉ log/dashboard không hoạt động.

### 1. Tạo database Turso (miễn phí)
Cách dễ nhất — qua web dashboard **https://turso.tech** (Sign up → Create Database → copy Database URL + tạo Auth Token). Hoặc qua CLI:
```bash
curl -sSfL https://get.tur.so/install.sh | bash   # cài Turso CLI
turso auth login
turso db create happynewyear-logs
turso db show happynewyear-logs --url
turso db tokens create happynewyear-logs
```

### 2. Khai báo biến môi trường
Copy [.env.example](.env.example) → `.env` (chỉ dùng local, đã gitignore) và điền:
```
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
DASHBOARD_USER=admin
DASHBOARD_PASS=<mật khẩu mạnh>
DASHBOARD_SESSION_SECRET=<chuỗi random dài>
IS_UAT=true   # chỉ để local/preview — bật bypass đăng nhập bằng mật khẩu "0" khi test
```
Sinh `DASHBOARD_SESSION_SECRET`: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

Trên **Vercel**: Project Settings → Environment Variables → khai báo 5 biến (không cần `IS_UAT` trên Production — code đã chặn cứng bypass ở `VERCEL_ENV=production` dù có set nhầm). **Thêm biến sau khi đã deploy thì phải Redeploy lại** mới nhận được.

### 3. Chạy thử ở local
`api/*.js` theo convention Vercel Serverless Functions — cần `vercel dev` để `/api/*` hoạt động đúng:
```bash
npm install -g vercel && vercel dev
```
Mở `http://localhost:3000/dashboard.html`.

> 💡 Test nhanh không cần Turso: set `TURSO_DATABASE_URL=file:./local-test.db` (không cần `TURSO_AUTH_TOKEN`).
> 💡 Xem giao diện dashboard **không cần backend gì cả**: mở `dashboard.html` qua bất kỳ server tĩnh, đăng nhập với mật khẩu `0` → hiện dashboard với dữ liệu mẫu (client-side thuần, có badge "Dữ liệu mẫu" để phân biệt).

### 4. Bảo mật
- `/api/log` không yêu cầu đăng nhập (đúng chủ đích — mọi khách xem trang tự động gọi để ghi lượt truy cập).
- `/api/logs` và `/dashboard.html` yêu cầu cookie session hợp lệ (HMAC-SHA256, hết hạn 8h, stateless — không lưu session ở DB).

## 🛠️ Công nghệ sử dụng

- HTML5 / CSS3 / Vanilla JavaScript — không dùng framework frontend
- [GSAP (TweenMax) 2.0.2](https://cdnjs.com/libraries/gsap) — animation số đếm ngược, chữ
- [lunar-javascript](https://www.jsdelivr.com/package/npm/lunar-javascript) (CDN) — chuyển đổi dương lịch ↔ âm lịch
- [qrcode.js](https://cdnjs.com/libraries/qrcodejs) (CDN) — tự sinh QR code cho link chia sẻ
- [Font Awesome 6.6.0](https://cdnjs.com/libraries/font-awesome) — icon menu/panel
- Google Fonts: **Inter** (UI/panel), **Lora** (lời chúc, đủ dấu tiếng Việt)
- `Stage.js`, `MyMath.js`, `fscreen.js` — engine pháo hoa canvas, tự host tại `assets/js/vendor/`
- **Canvas API** — pháo hoa, mưa hoa đào/mai
- **Web Audio API** — hiệu ứng âm thanh tương tác (tự tổng hợp, không dùng file audio)
- **Service Worker + Web App Manifest** — PWA "Add to Home Screen"
- [Vercel Serverless Functions](https://vercel.com/docs/functions) (`/api`) + [Turso](https://turso.tech) (`@libsql/client`) — log & dashboard (optional)
- Build tooling: `javascript-obfuscator`, `clean-css`, `sharp` (nén ảnh) — chạy qua `scripts/build.js`

## 📌 Ghi chú

- Trang phụ thuộc một số CDN ngoài (GSAP, Font Awesome, lunar-javascript, qrcode.js) — cần internet khi chạy. 3 script pháo hoa nền (`fscreen`/`Stage`/`MyMath`) đã tự host, không còn phụ thuộc bucket S3 ngoài.
- Do chính sách autoplay của trình duyệt, nhạc chỉ thực sự phát sau khi người dùng click vào overlay "Nhấp vào bất kỳ đâu để phát nhạc".
- **Service Worker cache**: mỗi khi sửa CSS/JS, phải tăng `CACHE_VERSION` trong [sw.js](sw.js) — nếu không, người đã từng mở trang sẽ tiếp tục thấy bản CSS/JS **cũ** (cache-first) dù server đã có bản mới, vì trình duyệt chỉ kích hoạt Service Worker mới khi nội dung `sw.js` thay đổi.
- Build production (`npm run build`) sẽ **obfuscate** các file JS tự viết (không đụng `fireworks.js`/`scriptWatch.js`/`vendor/` — code demo bên thứ ba, nhạy thời gian) và **minify** toàn bộ CSS — chỉ ảnh hưởng bản `dist/`, không ảnh hưởng khi chạy trực tiếp source.
- `assets/js/script.js` (typewriter) và `assets/js/personalize.js` phụ thuộc biến toàn cục khai báo inline trong `index.html` — xem lưu ý ở mục Cấu trúc thư mục.

## 👤 Tác giả

**TUANFLUTE** — [tuanflute275.github.io/introduce](https://tuanflute275.github.io/introduce/)
