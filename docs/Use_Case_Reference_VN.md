# Ánh xạ Use Case & Trạng thái Dự án VnComply

Tài liệu này ánh xạ các yêu cầu từ file phân tích toàn diện vào các tính năng đã được triển khai trong bản demo local.

## 1. Người dùng cá nhân (Individual User - /user)

| Mã Use Case | Tên Use Case | Trạng thái | Điểm truy cập UI |
|:---|:---|:---|:---|
| UC-IU01 | Quét URL nhanh (Quick Scan) | ✅ Hoàn thiện | Màn hình chính `/user` |
| IU03/04 | Xem kết quả Consent & Tracker | ✅ Hoàn thiện | Card kết quả sau khi quét |
| UC-IU02 | Tải xuống báo cáo tuân thủ | ✅ Hoàn thiện | Nút "Download PDF" trong trang kết quả |
| IU06 | Xem lịch sử quét | ✅ Hoàn thiện | Điều hướng `/user/history` |

---

## 2. Doanh nghiệp (Business - /business)

| Mã Use Case | Tên Use Case | Trạng thái | Điểm truy cập UI |
|:---|:---|:---|:---|
| UC-PB04 | Lên lịch quét tự động | ✅ Hoàn thiện | Trang `/business/scans` |
| UC-PB03 | Thực hiện DPIA Wizard | ✅ Hoàn thiện | Trang `/business/dpia` |
| PB12 | Xem nhật ký bằng chứng kiểm toán| ✅ Hoàn thiện | Logic đã kết nối, truy cập qua Dashboard |
| PB09 | Xem điểm số tuân thủ | ✅ Hoàn thiện | Dashboard chính `/business` |

---

## 3. Kiểm toán & Luật sư (Auditor - /auditor)

| Mã Use Case | Tên Use Case | Trạng thái | Điểm truy cập UI |
|:---|:---|:---|:---|
| UC-LA01 | Quản lý danh mục khách hàng| ✅ Hoàn thiện | Trang `/auditor/clients` |
| LA03 | So sánh khách hàng | ✅ Hoàn thiện | Risk Radar Chart trong chi tiết khách hàng |
| UC-LA07 | Xuất báo cáo sẵn sàng kiểm toán| ✅ Hoàn thiện | Nút Export trong danh mục khách hàng |

---

## 4. Quản trị hệ thống (Admin - /admin)

| Mã Use Case | Tên Use Case | Trạng thái | Điểm truy cập UI |
|:---|:---|:---|:---|
| UC-SA04 | Giám sát & Điều khiển Engine | ✅ Hoàn thiện | Trang `/admin/engine` |
| SA06 | Giám sát chỉ số hệ thống | ✅ Hoàn thiện | Dashboard `/admin` (Biểu đồ D3.js) |
| UC-SA02 | Cập nhật bộ quy tắc pháp lý | ✅ Hoàn thiện | Trang `/admin/rules` |
| SA07 | Xem nhật ký kiểm toán hệ thống | ✅ Hoàn thiện | Trang `/admin/logs` |

---

## 🎯 Breaking Tasks (Core Features)

- **[F1] Privacy / Policy Scanner**: ✅ Đã tích hợp crawler Playwright và backend detection.
- **[F2] Demo Target Web**: ✅ Đã có logic scan các URL test.
- **[F3] OWASP Top 10 Scanner**: ✅ Đã triển khai các module scan security header và injection cơ bản.
- **[F4] Report Export**: ✅ Đã triển khai engine WeasyPrint xuất PDF với dấu xác nhận "Verified".
