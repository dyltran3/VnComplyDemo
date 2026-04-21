<div align="center">

# 🛡️ VnComply — Nền tảng Tuân thủ Pháp luật Dữ liệu

**Giải pháp tự động hóa kiểm tra tuân thủ Nghị định 13/2023/NĐ-CP cho Website tại Việt Nam**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![D3.js](https://img.shields.io/badge/D3.js-7.x-f9a03c?logo=d3.js)](https://d3js.org)
[![Playwright](https://img.shields.io/badge/Playwright-Browser_Automation-2ead33?logo=playwright)](https://playwright.dev)

</div>

---

## 📖 Giới thiệu
**VnComply** là một nền tảng LegalTech toàn diện giúp các tổ chức và cá nhân tự động hóa việc đánh giá mức độ tuân thủ pháp luật bảo vệ dữ liệu cá nhân (Vấn đề nóng hổi theo Nghị định 13/2023/NĐ-CP). Hệ thống kết hợp giữa Crawler tự động và Engine phân tích pháp lý để đưa ra các báo cáo chính xác theo thời gian thực.

### Các tính năng cốt lõi:
- 🔍 **Compliance Scanning**: Quét sâu Website để phát hiện lỗi Tracker, Consent banner thiếu, và Privacy Policy không hợp lệ.
- 📊 **Risk Radar Analysis**: Biểu đồ phân tích rủi ro đa chiều cho kiểm toán viên.
- 📝 **DPIA Wizard**: Trình hướng dẫn thực hiện đánh giá tác động dữ liệu 5 bước theo quy chuẩn.
- 📜 **Certified Reports**: Xuất báo cáo PDF có đóng dấu xác thực và fingerprint kỹ thuật số.
- 🖥️ **System Monitoring**: Dashboard giám sát tài nguyên hệ thống Admin real-time.

---

## 🛠️ Cấu trúc dự án
Dự án được xây dựng theo kiến trúc Modern Full-stack:
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, D3.js.
- **Backend**: FastAPI (Python 3.10+), SQLAlchemy.
- **Scanning Engine**: Playwright Browser Automation.
- **Reporting**: WeasyPrint (PDF Generation).

---

## 🚀 Hướng dẫn cài đặt (Clone & Run)

### 1. Yêu cầu hệ thống
- Node.js 18+
- Python 3.10+
- Trình duyệt Chrome/Chromium (cài qua Playwright)

### 2. Cài đặt Backend
```bash
cd backend
# Khởi tạo môi trường ảo (Khuyến nghị)
python -m venv venv
source venv/bin/activate  # Trên Windows: venv\Scripts\activate

# Cài đặt thư viện
pip install -r requirements.txt

# Cài đặt Playwright Browser
playwright install chromium
```

### 3. Cài đặt Frontend
```bash
# Quay lại thư mục gốc
cd ..
# Cài đặt dependencies
npm install --legacy-peer-deps
```

---

## ⚙️ Cấu hình (Environment Variables)

Khởi tạo file cấu hình:
```bash
cp .env.example .env.local
```

Nội dung `.env.local` tối thiểu:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🚦 Khởi chạy hệ thống

Hệ thống yêu cầu chạy song song cả Backend và Frontend:

**Terminal 1 (Backend):**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Kịch bản Demo (Manual)
Để có trải nghiệm tốt nhất cho bài trình diễn, vui lòng tham khảo tài liệu hướng dẫn tương tác chi tiết:
👉 **[Hướng dẫn tương tác UI & Kịch bản Demo](./docs/VnComply_Demo_Guide_VN.md)**

Cấu trúc kịch bản bao gồm 4 vai trò:
1. **Admin**: Giám sát log, cấu hình engine và luật pháp.
2. **User**: Quét nhanh URL, xem kết quả và tải PDF.
3. **Business**: Lên lịch quét định kỳ và thực hiện DPIA.
4. **Auditor**: Quản lý danh mục khách hàng và so sánh rủi ro Radar.

---

## ⚖️ Ánh xạ Use Case & Pháp lý
Chi tiết về cách các tính năng trong code ánh xạ sang Nghị định 13:
👉 **[Tham chiếu Use Case & Trạng thái triển khai](./docs/Use_Case_Reference_VN.md)**

---

<div align="center">

Built with ❤️ by **VnComply Team** · LegalTech Innovation for Vietnam

</div>
