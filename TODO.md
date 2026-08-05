# Checklist tính năng & tối ưu — Happy New Year Landing Page

File này tổng hợp các tính năng đã làm, nên làm tiếp và các phần cần tối ưu, để check dần từng mục. Xem [README.md](README.md) để biết cấu trúc dự án hiện tại.

---

## ✅ Đã hoàn thành

- [x] **Cá nhân hoá lời chúc qua URL** (`?to=Tên`) — [assets/js/personalize.js](assets/js/personalize.js). Truy cập `index.html?to=Minh` sẽ hiện "Chúc mừng năm mới Minh" thay vì lời chúc ngẫu nhiên.
- [x] **Cập nhật mốc đếm ngược Tết 2027** (06/02/2027) — [assets/js/count_down.js](assets/js/count_down.js).
- [x] **Xin xăm đầu năm** — nút 🧧 nổi góc trái, bấm rút quẻ ngẫu nhiên (8 quẻ) với lời chúc công việc/tình yêu/sức khỏe — [assets/js/xin-xam.js](assets/js/xin-xam.js).
- [x] **Hiển thị thêm lịch âm** — "Hôm nay: ngày 5/8 (Dương lịch) — ngày 23 tháng Sáu (Âm lịch)" hiện bên dưới tiêu đề và trên countdown, tự động cập nhật mỗi ngày. Dùng thư viện `lunar-javascript` (CDN). *File liên quan: `count_down.js`, `custom.css`, `index.html`.*
- [x] **Tích hợp confetti vào Xin xăm đầu năm** — thay vì làm lì xì trùng lặp, hiệu ứng confetti đã được tích hợp vào Xin xăm khi người dùng rút được quẻ cát lành (Đại Cát, Thượng Cát...). *File liên quan: `xin-xam.js`, `custom.css`.*

---

## 🚀 Tính năng nên làm tiếp (ưu tiên cao, ít rủi ro)

- [x] **Hiệu ứng "Giao thừa"** — khi đếm ngược về 0: tự bắn pháo hoa finale (tận dụng `store` có sẵn trong `fireworks.js`) trong 60s + hiện banner "Chúc mừng năm mới 2027". *File liên quan: `count_down.js` (event `newyear:arrived`), `assets/js/celebrate.js` (mới), `custom.css`.*
- [x] **Nút "Chia sẻ" + "Tạo lời chúc riêng"** trong menu cài đặt — cho phép nhập tên người nhận để tự sinh link `?to=Tên`, copy link hoặc chia sẻ trực tiếp (Web Share API) và hỗ trợ xem trước. *File liên quan: `index.html`, `custom.css`, `share.js`.*
- [x] **Chế độ nhẹ (Lite mode)** — nút toggle "Lite Mode" trong menu cài đặt để bật/tắt pháo hoa nền + hoa đào rơi tức thì cho máy yếu/mobile, lưu lựa chọn qua `localStorage`. *File liên quan: `index.html`, `snowflake.js`, `fireworks.js`.*
- [x] **QR code tự sinh** cho link lời chúc cá nhân hoá (thay vì ảnh `qr.png` tĩnh) — tự sinh bằng thư viện `qrcode.js` qua CDN mỗi khi tạo link thành công, dễ quét in/gửi Zalo. *File liên quan: `index.html`, `share.js`, `custom.css`.*


## 🌟 Tính năng nâng cao (giá trị cao nhưng tốn công hơn, làm sau)

- [ ] **Pháo hoa đồng bộ nhịp nhạc** — dùng Web Audio API phân tích beat bài đang phát, đồng bộ cường độ bắn pháo hoa theo nhạc.
- [ ] **Mini-game chờ giao thừa** — ví dụ "đập lợn tiết kiệm", "gói bánh chưng" (game rất nhẹ, giữ chân khách khi chờ đếm ngược).
- [ ] **Avatar cá nhân hoá** — cho phép upload/crop ảnh nhỏ hiển thị cùng lời chúc riêng (đi kèm `?to=Tên`).
- [ ] **Chuyển ngôn ngữ VI/EN** — phục vụ khách quốc tế xem trang.
- [ ] **Bản dành cho công ty/nhóm** — tuỳ biến logo, tên, câu chúc theo thương hiệu riêng.
- [ ] **Nhắc giao thừa qua Web Push** — nút "nhắc tôi lúc giao thừa", gửi thông báo trình duyệt đúng lúc (cần Service Worker).
- [ ] **PWA (Add to Home Screen)** — cache static assets, mở lại nhanh, lưu như một thiệp Tết trên màn hình chính.
- [ ] **Series các bản Tết theo năm** — liên kết các bản Tết 2025/2027/2027... thành một "album" theo năm.
- [ ] **Analytics đơn giản** (Plausible/GA) — biết được bao nhiêu người mở link thiệp (cần tài khoản dịch vụ ngoài).

---

## 🔧 Tối ưu / sửa lỗi kỹ thuật (nên làm sớm, rủi ro thấp)

- [x] **Sửa `<html lang="en">` → `lang="vi"`** (cả `index.html` và `firework.html`) — nội dung toàn tiếng Việt.
- [x] **Sửa nội dung OG meta sai** — "Giáp Thìn 2027" (Giáp Thìn là 2024) → đã sửa thành "Đinh Mùi 2027" (đúng con giáp năm 2027) trong cả 4 thẻ meta liên quan.
- [x] **Thêm `alt`** cho tất cả `<img>` trong `index.html` (đèn lồng, rồng/múa lân, banner sum vầy) — đã thêm mô tả tiếng Việt cho cả 4 ảnh.
- [x] **Sửa `z-index` phi lý** trong `custom.css` — đã được dọn lại thành hệ z-index hợp lý (9999–250000 theo từng lớp UI) khi làm lại giao diện settings/share panel.
- [x] **Sửa viewport meta** — đã thêm `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no`. Đã test trên iPhone 12 (Playwright): không còn tràn ngang trang.
- [x] **Responsive mobile** — tiêu đề `.year`/`.year2` (WELCOME...) giờ dùng `font-size: clamp(...)` co giãn liên tục theo `vw` thay vì breakpoint cố định → không còn rớt dòng ở mọi kích thước màn hình (đã test 430×932 — iPhone 14 Pro Max). Thêm `@media (max-width: 480px)` thu nhỏ `.centeredBox pre` (lời chúc), `.dragon`, `.tet_xum_vay`, `.den-long__group img` → hết chồng lấn giữa ảnh gia đình và dòng chữ chúc (verify bằng bounding box: cách nhau 124px, không overlap). *File: `custom.css`.*
- [x] **Gộp code trùng lặp** — `handleSongEnded` và `handleNextMusic` trong `index.html` gần như giống nhau 100%. Đã sửa `handleSongEnded` để chỉ gọi lại `handleNextMusic()` thay vì lặp lại toàn bộ logic (đồng thời khắc phục luôn lỗi phát 2 bài liên tiếp mỗi khi bài hát kết thúc).
- [x] **Tự host 3 script pháo hoa** (`fscreen.js`, `Stage.js`, `MyMath.js`) thay vì phụ thuộc một bucket S3 cá nhân bên ngoài — đã tải về và lưu tại `assets/js/vendor/`, cập nhật lại đường dẫn `<script>` trong `index.html` và `firework.html`.
- [x] **Tối ưu file nhạc** — đã chuyển toàn bộ 14 file từ 128–197kbps xuống 96kbps CBR (dùng ffmpeg/libmp3lame) và bỏ ảnh bìa album gắn kèm (không dùng tới vì trang chỉ phát nhạc nền qua `<audio>`, không hiển thị artwork). Tổng dung lượng `assets/audio/` giảm từ ~55MB xuống ~34MB (~38%), thời lượng từng bài giữ nguyên, chất lượng vẫn ổn cho nhạc nền.
- [x] **Thêm loading indicator** khi đang tải nhạc lần đầu (file nặng, có thể mất vài giây trên mạng chậm) — thêm badge tròn "Đang tải nhạc..." (spinner + text) cố định trên đầu trang, gắn vào sự kiện `loadstart`/`waiting` (hiện) và `playing`/`canplay`/`error` (ẩn) của thẻ `<audio>`. Tự động áp dụng cho mọi lượt tải nhạc (lần đầu, đổi bài, tự chuyển bài khi kết thúc). Đã test bằng Playwright (desktop + mobile 390×844): badge hiện đúng lúc, ẩn đúng lúc, không đè lên nút cài đặt/xin xăm/widget liên hệ. *File liên quan: `index.html`, `custom.css`.*

---

### Cách dùng file này
Tick `[x]` từng mục khi làm xong và test ok. Có thể làm theo đúng thứ tự ưu tiên ở trên, hoặc báo mình mục nào bạn muốn làm trước.
