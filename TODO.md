# Checklist tính năng & tối ưu — Happy New Year Landing Page

File này tổng hợp các tính năng đã làm, nên làm tiếp và các phần cần tối ưu, để check dần từng mục. Xem [README.md](README.md) để biết cấu trúc dự án hiện tại.

---

## ✅ Đã hoàn thành

- [x] **Cá nhân hoá lời chúc qua URL** (`?to=Tên`) — [assets/js/personalize.js](assets/js/personalize.js). Truy cập `index.html?to=Minh` sẽ hiện "Chúc mừng năm mới Minh" thay vì lời chúc ngẫu nhiên.
- [x] **Cập nhật mốc đếm ngược Tết 2027** (06/02/2027) — [assets/js/count_down.js](assets/js/count_down.js).
- [x] **Xin xăm đầu năm** — nút 🧧 nổi góc trái, bấm rút quẻ ngẫu nhiên (8 quẻ) với lời chúc công việc/tình yêu/sức khỏe — [assets/js/xin-xam.js](assets/js/xin-xam.js).
- [x] **Hiển thị thêm lịch âm** — "Hôm nay: ngày 5/8 (Dương lịch) — ngày 23 tháng Sáu (Âm lịch)" hiện bên dưới tiêu đề và trên countdown, tự động cập nhật mỗi ngày. Dùng thư viện `lunar-javascript` (CDN). *File liên quan: `count_down.js`, `custom.css`, `index.html`.*
- [x] **Tích hợp confetti vào Xin xăm đầu năm** — thay vì làm lì xì trùng lặp, hiệu ứng confetti đã được tích hợp vào Xin xăm khi người dùng rút được quẻ cát lành (Đại Cát, Thượng Cát...). *File liên quan: `xin-xam.js`, `custom.css`.*
- [x] **Ghi log truy cập + Dashboard xem log (yêu cầu đăng nhập)** — Ghi 3 loại: lượt truy cập trang (time/IP/user-agent), lượt mở link cá nhân hoá (`?to=Tên`), tương tác tính năng (xin xăm, đổi nhạc, chia sẻ, lite mode...). Lưu vào **Turso** (SQLite serverless, persistent qua các lần deploy — khác với ghi file cục bộ trên Vercel sẽ mất dữ liệu). Dashboard tại `/dashboard.html` yêu cầu đăng nhập (tài khoản cố định qua env var + cookie session ký HMAC-SHA256, không lưu session ở DB). Đã test toàn bộ luồng (log → 401 khi chưa đăng nhập → sai mật khẩu bị chặn → đăng nhập đúng → xem/filter/phân trang log → đăng xuất) bằng Playwright + SQLite file local, không lỗi. **Cần bạn tự setup trước khi deploy — xem mục "Setup Turso + Dashboard" trong README.md.** *File liên quan: `api/*.js` (mới), `dashboard.html`, `assets/js/tracker.js`, `assets/js/dashboard.js`, `assets/css/dashboard.css`, `.env.example`, `package.json`, `scripts/build.js`.*

---

## 🚀 Tính năng nên làm tiếp (ưu tiên cao, ít rủi ro)

- [x] **Hiệu ứng "Giao thừa"** — khi đếm ngược về 0: tự bắn pháo hoa finale (tận dụng `store` có sẵn trong `fireworks.js`) trong 60s + hiện banner "Chúc mừng năm mới 2027". *File liên quan: `count_down.js` (event `newyear:arrived`), `assets/js/celebrate.js` (mới), `custom.css`.*
- [x] **Nút "Chia sẻ" + "Tạo lời chúc riêng"** trong menu cài đặt — cho phép nhập tên người nhận để tự sinh link `?to=Tên`, copy link hoặc chia sẻ trực tiếp (Web Share API) và hỗ trợ xem trước. *File liên quan: `index.html`, `custom.css`, `share.js`.*
- [x] **Chế độ nhẹ (Lite mode)** — nút toggle "Lite Mode" trong menu cài đặt để bật/tắt pháo hoa nền + hoa đào rơi tức thì cho máy yếu/mobile, lưu lựa chọn qua `localStorage`. *File liên quan: `index.html`, `snowflake.js`, `fireworks.js`.*
- [x] **QR code tự sinh** cho link lời chúc cá nhân hoá (thay vì ảnh `qr.png` tĩnh) — tự sinh bằng thư viện `qrcode.js` qua CDN mỗi khi tạo link thành công, dễ quét in/gửi Zalo. *File liên quan: `index.html`, `share.js`, `custom.css`.*


## 🌟 Tính năng nâng cao (giá trị cao nhưng tốn công hơn, làm sau)

- [x] **Mini-game chờ giao thừa** — 2 game nhẹ, nút nổi xếp cột góc phải (dưới nút cài đặt, trên nút xin xăm):
  - **"Đập lợn tiết kiệm"** 🐷: đập heo liên tục (8-11 lần bí mật/lượt) nhận lộc ngẫu nhiên, vỡ heo hiện tổng lộc (đếm số lên dần) + xếp hạng (Heo Đất/Bạc/Vàng/Kim Cương) kèm flash toàn màn hình + rung nhẹ + tiền/sao rơi, có nút đập lại.
  - **"Gói bánh chưng"** (icon vuông lá xanh + lưới dây lạt, không dùng emoji vì không có emoji bánh chưng): bấm đúng thứ tự 7 lớp truyền thống (lá dong → gạo nếp → đậu xanh → thịt heo → đậu xanh → gạo nếp → buộc lạt), tốc độ gói quyết định danh hiệu (Nghệ Nhân/Khéo Léo/Chăm Chỉ/Lần Đầu), hoàn thành hiện hình bánh vuông với lưới dây lạt + hiệu ứng lá/sao rơi.
  - Đã test: 4 nút cột phải (cài đặt/bánh chưng/heo/xin xăm) không đè nhau ở cả desktop và mobile, luồng chơi/reset/đóng của cả 2 game đều đúng, sửa lỗi emoji 🫘 không render (đổi sang 🟢). *File liên quan: `assets/js/minigame.js`, `assets/js/banhchung.js` (mới), `custom.css`, `index.html`.*
- [x] **Avatar cá nhân hoá** — trong panel "Tạo lời chúc riêng", có thể chọn ảnh, kéo để đổi vị trí + kéo thanh trượt để zoom (widget crop tự viết bằng canvas, không dùng thư viện ngoài), ảnh được nén còn ~200×200 JPEG và lưu qua endpoint mới `/api/avatar` (Turso, bảng `avatars`) để ảnh đi kèm được link chia sẻ tới đúng người nhận (không chỉ hiện trên máy người tạo). Link sinh ra dạng `?to=Tên&avatar=id`; người nhận mở link sẽ thấy ảnh đại diện tròn phía trên lời chúc trong `.centeredBox`. Ảnh giới hạn tối đa ~105KB sau decode (đủ cho ảnh đại diện nhỏ), chỉ nhận `image/webp|jpeg|png`. *File liên quan: `api/_db.js`, `api/avatar.js` (mới), `assets/js/avatar-crop.js` (mới), `assets/js/personalize.js`, `assets/js/share.js`, `index.html`, `assets/css/custom.css`, `assets/css/style.css`, `scripts/build.js`.*
- [ ] **Chuyển ngôn ngữ VI/EN** — phục vụ khách quốc tế xem trang.
- [x] **PWA (Add to Home Screen)** — thêm `manifest.json` (icon 192/512, tạo từ `logo.jpg` cắt vuông qua `sharp`), `sw.js` (Service Worker): precache app shell (HTML/CSS/JS/icon) lúc install, HTML dùng network-first (luôn lấy bản mới khi online), CSS/JS/ảnh/nhạc dùng cache-first (mở lại nhanh), `/api/*` và CDN cross-origin không bị cache. Thêm meta tag Apple (`apple-mobile-web-app-capable`, `apple-touch-icon`...) để hỗ trợ "Add to Home Screen" trên iOS Safari. Đã test: manifest hợp lệ, SW cài đặt + kiểm soát trang (`controller: true`), cache lưu 30 tài nguyên, reload không lỗi, build production vẫn ra đủ file. *File liên quan: `manifest.json`, `sw.js` (mới), `assets/img/icon-192.png`, `assets/img/icon-512.png` (mới), `index.html`.*

---

## 🔧 Tối ưu / sửa lỗi kỹ thuật (nên làm sớm, rủi ro thấp)

- [x] **Sửa `<html lang="en">` → `lang="vi"`** (cả `index.html` và `firework.html`) — nội dung toàn tiếng Việt.
- [x] **Sửa nội dung OG meta sai** — "Giáp Thìn 2027" (Giáp Thìn là 2024) → đã sửa thành "Đinh Mùi 2027" (đúng con giáp năm 2027) trong cả 4 thẻ meta liên quan.
- [x] **Thêm `alt`** cho tất cả `<img>` trong `index.html` (đèn lồng, rồng/múa lân, banner sum vầy) — đã thêm mô tả tiếng Việt cho cả 4 ảnh.
- [x] **Sửa `z-index` phi lý** trong `custom.css` — đã được dọn lại thành hệ z-index hợp lý (9999–250000 theo từng lớp UI) khi làm lại giao diện settings/share panel.
- [x] **Sửa viewport meta** — đã thêm `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no`. Đã test trên iPhone 12 (Playwright): không còn tràn ngang trang.
- [x] **Responsive mobile** — tiêu đề `.year`/`.year2` (WELCOME...) giờ dùng `font-size: clamp(...)` co giãn liên tục theo `vw` thay vì breakpoint cố định → không còn rớt dòng ở mọi kích thước màn hình. Thêm `@media (max-width: 480px)` thu nhỏ `.centeredBox pre` (lời chúc), `.dragon`, `.tet_xum_vay`, `.den-long__group img`, `#overlay` (chữ "Nhấp vào bất kỳ đâu để phát nhạc" đang set inline `font-size:2em` quá to). Sửa thêm lỗi `.centeredBox pre` dùng `white-space: pre` (không tự xuống dòng) → đổi `pre-wrap` + `overflow-wrap: break-word` nên câu chúc dài không còn bị cắt cụt ở lề màn hình. Đã test 430×932 (iPhone 14 Pro Max): không tràn viewport, không chồng lấn giữa các phần tử. *File: `custom.css`, `style.css`.*
- [x] **Gộp code trùng lặp** — `handleSongEnded` và `handleNextMusic` trong `index.html` gần như giống nhau 100%. Đã sửa `handleSongEnded` để chỉ gọi lại `handleNextMusic()` thay vì lặp lại toàn bộ logic (đồng thời khắc phục luôn lỗi phát 2 bài liên tiếp mỗi khi bài hát kết thúc).
- [x] **Tự host 3 script pháo hoa** (`fscreen.js`, `Stage.js`, `MyMath.js`) thay vì phụ thuộc một bucket S3 cá nhân bên ngoài — đã tải về và lưu tại `assets/js/vendor/`, cập nhật lại đường dẫn `<script>` trong `index.html` và `firework.html`.
- [x] **Tối ưu file nhạc** — đã chuyển toàn bộ 14 file từ 128–197kbps xuống 96kbps CBR (dùng ffmpeg/libmp3lame) và bỏ ảnh bìa album gắn kèm (không dùng tới vì trang chỉ phát nhạc nền qua `<audio>`, không hiển thị artwork). Tổng dung lượng `assets/audio/` giảm từ ~55MB xuống ~34MB (~38%), thời lượng từng bài giữ nguyên, chất lượng vẫn ổn cho nhạc nền.
- [x] **Thêm loading indicator** khi đang tải nhạc lần đầu (file nặng, có thể mất vài giây trên mạng chậm) — thêm badge tròn "Đang tải nhạc..." (spinner + text) cố định trên đầu trang, gắn vào sự kiện `loadstart`/`waiting` (hiện) và `playing`/`canplay`/`error` (ẩn) của thẻ `<audio>`. Tự động áp dụng cho mọi lượt tải nhạc (lần đầu, đổi bài, tự chuyển bài khi kết thúc). Đã test bằng Playwright (desktop + mobile 390×844): badge hiện đúng lúc, ẩn đúng lúc, không đè lên nút cài đặt/xin xăm/widget liên hệ. *File liên quan: `index.html`, `custom.css`.*
- [x] **Build step: minify CSS + obfuscate JS trước khi deploy Vercel** — thêm `package.json` + `scripts/build.js` (dùng `javascript-obfuscator` + `clean-css`), sinh ra bản build vào `dist/` (đã gitignore). Chỉ obfuscate 9 file JS tự viết (`celebrate.js`, `count_down.js`, `custom.js`, `personalize.js`, `script.js`, `self.js`, `share.js`, `snowflake.js`, `xin-xam.js`) và các `<script>` inline trong `index.html`/`firework.html`; giữ nguyên `fireworks.js`, `scriptWatch.js`, `assets/js/vendor/*` (code demo bên thứ ba, tránh obfuscate làm hỏng animation nhạy thời gian). CSS được minify toàn bộ. `vercel.json` trỏ `buildCommand: npm run build`, `outputDirectory: dist` để Vercel tự build lúc deploy. Lưu ý: obfuscate làm JS **tăng** dung lượng (~48KB → ~76.5KB do overhead của string-array/decoder) — không phải tối ưu về size, chỉ tối ưu về việc gây khó đọc code; phần "tối ưu" thật sự nằm ở CSS minify + các mục nhạc/ảnh ở trên. Đã test toàn bộ bản build qua Playwright (đếm ngược, nhạc, xin xăm, đổi bài) — không lỗi console. *File liên quan: `package.json`, `scripts/build.js`, `vercel.json`, `.gitignore`.*
- [x] **Tối ưu ảnh** — thêm bước nén ảnh (dùng `sharp`) vào `scripts/build.js`: PNG được nén bằng palette quantization, JPEG nén lại ở quality 80 (mozjpeg); chỉ giữ bản nén nếu thực sự nhỏ hơn bản gốc (an toàn cho ảnh đã tối ưu sẵn như `bg.jpg`). Riêng `happy-new-year.png` (1.9MB, dùng cho `og:image`/`twitter:image`) hoá ra là ảnh chụp toàn trang dạng gradient chứ không phải hình vẽ phẳng màu — nén PNG bị rạn màu (banding) nên đã đổi hẳn sang JPEG (`happy-new-year.jpg`, quality 85) ở mức nguồn, giảm 1.9MB → 186KB (~90%) mà không lộ khác biệt khi so ảnh gốc/nén. Đã cập nhật 2 thẻ meta `og:image`/`twitter:image` trong `index.html` sang đuôi `.jpg` và test lại (200 OK, không lỗi console). *File liên quan: `scripts/build.js`, `assets/img/happy-new-year.jpg`, `index.html`.*

---

### Cách dùng file này
Tick `[x]` từng mục khi làm xong và test ok. Có thể làm theo đúng thứ tự ưu tiên ở trên, hoặc báo mình mục nào bạn muốn làm trước.
