# Hướng dẫn Demo VnComply (User Manual)

Tài liệu này hướng dẫn cách tương tác với giao diện người dùng (UI) để hoàn thành các kịch bản demo cho từng vai trò (Persona).

## 🚀 Khởi động hệ thống
Đảm bảo backend và frontend đang chạy local:
- Backend: `uvicorn main:app --reload` (tại `/backend`)
- Frontend: `npm run dev` (tại thư mục gốc)

---

## 🤵 1. Vai trò: Quản trị viên (Admin)
**Mục tiêu**: Giám sát hệ thống và quản lý quy trình quét.

1. **Giám sát tài nguyên**: Truy cập `/admin`. Quan sát biểu đồ D3.js hiển thị CPU/RAM theo thời gian thực.
2. **Quản lý quy trình (Engine)**: Truy cập `/admin/engine`. Thử bật/tắt Engine. Nhập một URL và nhấn "Run Test Scan" để xem log trực tiếp trong console.
3. **Quản lý luật pháp**: Truy cập `/admin/rules`. Thêm một luật mới (ví dụ: "Điều 11 - Nghị định 13") để cập nhật bộ quy tắc quét.
4. **Kiểm tra nhật ký**: Truy cập `/admin/logs`. Lọc các sự kiện theo mức độ Warn/Error để kiểm tra vết audit.

---

## 👩‍💻 2. Vai trò: Người dùng cá nhân (Individual)
**Mục tiêu**: Quét nhanh một website và tải báo cáo.

1. **Quét nhanh**: Truy cập `/user`. Nhập URL (ví dụ: `google.com`) và nhấn "Scan Now". Quan sát vòng tròn điểm số D3.js chạy từ 0 đến kết quả thực tế.
2. **Xem chi tiết**: Sau khi quét xong, kiểm tra các thẻ Findings (Phát hiện) để thấy vi phạm về Consent hoặc Tracker.
3. **Xuất báo cáo**: Nhấn nút "Download PDF" để tải xuống báo cáo tuân thủ có dấu xác nhận "Verified".
4. **Xem lịch sử**: Vào trang `/user/history` để xem lại danh sách các lần quét trước đó.

---

## 💼 3. Vai trò: Doanh nghiệp (Business)
**Mục tiêu**: Thực hiện đánh giá tác động dữ liệu (DPIA) và lên lịch quét.

1. **Lên lịch tự động**: Truy cập `/business/scans`. Nhấn "New Scan Job", chọn tần suất "Weekly" cho website của công ty.
2. **Thực hiện DPIA**: Truy cập `/business/dpia`. Điền thông qua 5 bước của trình dẫn hướng (Wizard) để hoàn thành bản đánh giá tác động bảo vệ dữ liệu cá nhân.
3. **Giám sát tuân thủ**: Xem Dashboard chính `/business` để theo dõi điểm số tổng quát của toàn tổ chức.

---

## ⚖️ 4. Vai trò: Kiểm toán viên / Luật sư (Auditor)
**Mục tiêu**: Quản lý nhiều khách hàng và đánh giá rủi ro đa chiều.

1. **Quản lý danh mục**: Truy cập `/auditor/clients`. Xem danh sách các công ty đang được quản lý.
2. **Phân tích Radar**: Chọn một khách hàng bất kỳ. Quan sát biểu đồ **Risk Radar Chart** để thấy rủi ro ở 5 khía cạnh (Privacy, Security, Consent, v.v.).
3. **So sánh rủi ro**: Chuyển đổi giữa các khách hàng để so sánh mức độ tuân thủ dựa trên biểu đồ Radar.

---

## ✨ Điểm nhấn kỹ thuật cho Demo
- **Giao diện Premium**: Sử dụng Glassmorphism (hiệu ứng kính mờ) và animations mượt mà từ Framer Motion.
- **Dữ liệu thực**: Toàn bộ Dashboard đã được kết nối với API backend thay vì dữ liệu mock.
- **Báo cáo chuyên nghiệp**: PDF được sinh ra tự động với cấu trúc ánh xạ trực tiếp sang các điều khoản của Nghị định 13.
