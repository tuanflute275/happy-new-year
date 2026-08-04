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

- [ ] **Hiệu ứng "Giao thừa"** — khi đếm ngược về 0: tự bắn pháo hoa finale (tận dụng `store` có sẵn trong `fireworks.js`) + hiện banner "Chúc mừng năm mới 2027". *File liên quan: `count_down.js`, `fireworks.js`, file mới `celebrate.js`.*
- [ ] **Nút "Chia sẻ" + "Tạo lời chúc riêng"** trong menu cài đặt — chia sẻ link hiện tại (Web Share API/copy link), hoặc nhập tên người nhận để tự sinh link `?to=Tên` rồi copy gửi đi. *Phối hợp trực tiếp với tính năng cá nhân hoá đã có.*
- [x] **Chế độ nhẹ (Lite mode)** — nút toggle "Lite Mode" trong menu cài đặt để bật/tắt pháo hoa nền + hoa đào rơi tức thì cho máy yếu/mobile, lưu lựa chọn qua `localStorage`. *File liên quan: `index.html`, `snowflake.js`, `fireworks.js`.*
- [ ] **QR code tự sinh** cho link lời chúc cá nhân hoá (thay vì ảnh `qr.png` tĩnh) — dễ in/gửi Zalo.


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

- [ ] **Responsive mobile** — chưa có `@media` breakpoint cho `.dragon`, `.tet_xum_vay`, `.den-long__group` (đang cố định px trong `style.css`) → ảnh có thể tràn/lấp trên màn hình nhỏ.
- [ ] **Sửa viewport meta** — hiện chỉ có `user-scalable=0`, thiếu `width=device-width, initial-scale=1`.
- [ ] **Sửa `z-index` phi lý** trong `custom.css` (`z-index: 99999999999999999999999`) → đổi về giá trị hợp lý (999–9999).
- [ ] **Gộp code trùng lặp** — `handleSongEnded` và `handleNextMusic` trong `index.html` gần như giống nhau 100%.
- [ ] **Sửa `<html lang="en">` → `lang="vi"`** (cả `index.html` và `firework.html`) — nội dung toàn tiếng Việt.
- [ ] **Thêm `alt`** cho tất cả `<img>` trong `index.html` (đèn lồng, rồng, banner...) — thiếu hoàn toàn hiện tại.
- [ ] **Tự host 3 script pháo hoa** (`fscreen.js`, `Stage.js`, `MyMath.js`) thay vì phụ thuộc một bucket S3 cá nhân bên ngoài — tránh single point of failure nếu bucket đó offline.
- [ ] **Sửa nội dung OG meta sai** — mô tả "Giáp Thìn 2027" trong `index.html` (dòng 11) là sai (Giáp Thìn là 2024), cần cập nhật đúng theo năm/con giáp hiện tại.
- [ ] **Tối ưu file nhạc** — các file mp3 hiện ~3–4MB/bài (tổng ~27MB), nên nén hoặc chuyển bitrate thấp hơn cho tải nhanh trên mobile.
- [ ] **Thêm loading indicator** khi đang tải nhạc lần đầu (file nặng, có thể mất vài giây trên mạng chậm).

---

### Cách dùng file này
Tick `[x]` từng mục khi làm xong và test ok. Có thể làm theo đúng thứ tự ưu tiên ở trên, hoặc báo mình mục nào bạn muốn làm trước.
