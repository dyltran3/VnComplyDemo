<div align="center">

# 🛡️ VNComply

**Nền tảng kiểm tra tuân thủ bảo vệ dữ liệu cá nhân tự động cho Website Việt Nam**

> Phân tích website, phát hiện vi phạm Nghị định 13/2023/NĐ-CP và cung cấp báo cáo pháp lý chi tiết theo thời gian thực.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-ff0055?logo=framer)](https://www.framer.com/motion)
[![D3.js](https://img.shields.io/badge/D3.js-7.x-f9a03c?logo=d3.js)](https://d3js.org)

</div>

---

## 📖 Giới thiệu dự án

**VNComply** là hệ thống phân tích tuân thủ pháp luật bảo vệ dữ liệu cá nhân tự động, được thiết kế đặc biệt cho môi trường pháp lý Việt Nam. Hệ thống tự động quét và phân tích website để phát hiện các vi phạm liên quan đến:

- 🍪 **Cookie Consent** — Phát hiện tracking cookie thiếu sự đồng ý người dùng
- 📋 **Chính sách Bảo mật** — Kiểm tra sự hiện diện và đầy đủ của Privacy Policy
- 🔒 **Mã hóa dữ liệu** — Phân tích HTTPS và bảo mật truyền tải dữ liệu
- 📡 **Bên thứ ba** — Liệt kê các tracker/script của bên thứ 3 chạy trên website
- ⚖️ **Ánh xạ pháp lý** — Mỗi vi phạm được liên kết trực tiếp tới điều khoản cụ thể của **Nghị định 13/2023/NĐ-CP**

### 4 Phân hệ người dùng

| Portal | Đường dẫn | Mô tả |
|--------|-----------|-------|
| 🔴 **System Admin** | `/admin` | Quản lý hệ thống, Engine quét, quy tắc pháp lý, kiểm soát tài khoản |
| 🟢 **Individual User** | `/user` | Quét URL nhanh, xem kết quả, tải báo cáo PDF |
| 🔵 **Law Firm & Auditor** | `/auditor` | Quản lý danh mục khách hàng, đánh giá rủi ro, xuất báo cáo pháp lý |
| 🟦 **Business Enterprise** | `/business` | Lên lịch quét tự động, DPIA wizard, cấu hình chính sách tổ chức |

---

## 🖥️ Demo & Screenshots

Sau khi chạy ứng dụng, truy cập `http://localhost:3000` — bạn sẽ được chuyển hướng tự động về trang đăng nhập.

### Tài khoản demo

| Role | Tài khoản | Mật khẩu | Chuyển đến |
|------|-----------|----------|-----------|
| Admin | `AdMin@Polic` | `adminCanChanges` | `/admin` |
| User | `User01@testmail` | `user01Permit` | `/user` |
| Auditor | `Auditor@testmail` | `auditorPermit` | `/auditor` |
| Business | `Business@testmail` | `businessPermit` | `/business` |

---

## ⚙️ Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo máy bạn đã cài đặt:

| Công cụ | Phiên bản tối thiểu | Kiểm tra |
|---------|---------------------|----------|
| **Node.js** | 18.x trở lên (LTS) | `node --version` |
| **npm** | 9.x trở lên | `npm --version` |
| **Git** | Bất kỳ phiên bản nào | `git --version` |

> 💡 **Khuyến nghị:** Cài Node.js LTS tại [nodejs.org](https://nodejs.org). Phiên bản LTS bao gồm npm đi kèm.

---

## 🚀 Hướng dẫn cài đặt từ đầu

### Bước 1 — Clone repository

```bash
git clone https://github.com/dyltran3/VnComplyDemo.git
cd VnComplyDemo
```

### Bước 2 — Cài đặt dependencies

> ⚠️ **Quan trọng:** Dự án này cần dùng flag `--legacy-peer-deps` do xung đột phiên bản giữa `eslint@8` và `eslint-config-next@16`. Đây là vấn đề đã biết và **không ảnh hưởng đến chức năng**.

```bash
npm install --legacy-peer-deps
```

Lệnh này sẽ tự động cài toàn bộ thư viện được liệt kê trong `package.json`:

| Thư viện | Phiên bản | Mục đích |
|----------|-----------|----------|
| `next` | ^14.2 | Framework React full-stack (App Router) |
| `react` + `react-dom` | ^18 | Thư viện UI cốt lõi |
| `typescript` | ^5 | Kiểm tra kiểu tĩnh |
| `tailwindcss` | ^3.4 | Utility-first CSS framework |
| `framer-motion` | ^12 | Animation và transitions |
| `d3` | ^7.9 | Biểu đồ SVG (system metrics, compliance ring) |
| `lucide-react` | ^1.7 | Bộ icon SVG |
| `@supabase/supabase-js` | ^2 | Client kết nối Supabase (cho backend thực) |
| `clsx` + `tailwind-merge` | latest | Utility gộp class Tailwind |
| `@tailwindcss/forms` | ^0.5 | Plugin style cho form elements |

### Bước 3 — Cấu hình biến môi trường

```bash
# Sao chép file mẫu
cp .env.example .env.local
```

Mở file `.env.local` và điền thông tin:

```env
# Supabase (chỉ cần nếu kết nối backend thực - có thể bỏ qua khi chạy UI demo)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> 💡 **Chạy UI demo không cần backend:** Nếu bạn chỉ muốn xem giao diện với dữ liệu mock, **bỏ qua bước này** — ứng dụng vẫn chạy bình thường.

### Bước 4 — Chạy ứng dụng

```bash
npm run dev
```

Mở trình duyệt và truy cập: **[http://localhost:3000](http://localhost:3000)**

Bạn sẽ thấy màn hình đăng nhập. Dùng một trong các tài khoản demo ở bảng trên để đăng nhập.

---

## 📁 Cấu trúc thư mục

```
VnComplyDemo/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout (tối giản, không có global sidebar)
│   │   ├── page.tsx                  # Trang chủ — redirect theo role
│   │   ├── login/
│   │   │   └── page.tsx              # Trang đăng nhập với RBAC
│   │   ├── admin/                    # 🔴 System Admin Portal
│   │   │   ├── layout.tsx            #   Sidebar + AuthGuard (role=Admin)
│   │   │   ├── page.tsx              #   Dashboard monitoring + D3 charts
│   │   │   ├── rules/page.tsx        #   Quản lý quy tắc pháp lý
│   │   │   ├── engine/page.tsx       #   Điều khiển Scan Engine + console
│   │   │   ├── access/page.tsx       #   Quản lý tài khoản người dùng
│   │   │   ├── logs/page.tsx         #   Audit logs có bộ lọc
│   │   │   └── settings/page.tsx     #   Cấu hình hệ thống
│   │   ├── user/                     # 🟢 Individual User Portal
│   │   │   ├── layout.tsx            #   Sidebar + AuthGuard (role=User)
│   │   │   ├── page.tsx              #   Quick Scan + D3 score ring
│   │   │   ├── history/page.tsx      #   Lịch sử quét
│   │   │   └── reports/page.tsx      #   Tải báo cáo PDF
│   │   ├── auditor/                  # 🔵 Law Firm & Auditor Portal
│   │   │   ├── layout.tsx            #   Sidebar + AuthGuard (role=Auditor)
│   │   │   ├── page.tsx              #   Portfolio overview
│   │   │   ├── clients/page.tsx      #   Danh mục khách hàng chi tiết
│   │   │   └── reports/page.tsx      #   Kho báo cáo pháp lý
│   │   ├── business/                 # 🟦 Business Enterprise Portal
│   │   │   ├── layout.tsx            #   Sidebar + AuthGuard (role=Business)
│   │   │   ├── page.tsx              #   Corporate dashboard
│   │   │   ├── scans/page.tsx        #   Quản lý lịch quét tự động
│   │   │   ├── dpia/page.tsx         #   DPIA 5-step wizard
│   │   │   └── policies/page.tsx     #   Chính sách & webhook integrations
│   │   └── results/[id]/page.tsx     # Trang kết quả quét động
│   ├── components/
│   │   ├── AuthGuard.tsx             # 🔒 Route protection component
│   │   ├── charts/
│   │   │   └── D3SystemMetrics.tsx   # Biểu đồ D3 SVG real-time
│   │   ├── Header.tsx                # Legacy global header
│   │   └── Sidebar.tsx               # Legacy global sidebar
│   └── lib/
│       └── api.ts                    # HTTP client cho backend API
├── .env.example                      # Template biến môi trường
├── .gitignore                        # Ẩn AI tooling, secrets, backend
├── tailwind.config.ts                # Theme màu sắc + font tùy chỉnh
├── next.config.mjs                   # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies
```

---

## 🔧 Các lệnh hữu ích

```bash
# Chạy môi trường development (hot-reload)
npm run dev

# Build sản phẩm tối ưu cho production
npm run build

# Chạy bản build production
npm start

# Kiểm tra linting
npm run lint
```

---

## 🛠️ Troubleshooting — Xử lý lỗi thường gặp

### ❌ Lỗi: `npm install` thất bại với ERESOLVE

**Nguyên nhân:** Xung đột `eslint-config-next@16` yêu cầu `eslint>=9` nhưng dự án dùng `eslint@8`.

**Giải pháp:**
```bash
npm install --legacy-peer-deps
```

---

### ❌ Lỗi: Cannot find module 'd3'

**Nguyên nhân:** D3 chưa được cài đặt thành công.

**Giải pháp:**
```bash
npm install d3 --legacy-peer-deps
npm install -D @types/d3 --legacy-peer-deps
```

---

### ❌ Lỗi: Event handlers cannot be passed to Client Component props

**Nguyên nhân:** File layout đang là Server Component nhưng chứa `onClick` handler.

**Giải pháp:** Thêm `"use client";` lên đầu file layout.tsx liên quan.

---

### ❌ Lỗi: Module 'X' has no exported member 'useState'

**Nguyên nhân:** `useState` bị import nhầm từ thư viện khác thay vì `react`.

**Giải pháp:** Kiểm tra và sửa import:
```tsx
// ❌ Sai
import { useState } from "framer-motion";

// ✅ Đúng
import { useState } from "react";
```

---

### ❌ Đăng nhập không thành công dù đúng tài khoản

**Nguyên nhân:** Có thể dính khoảng trắng khi copy/paste tài khoản. Code đã có `.trim()` nhưng kiểm tra lại kỹ.

**Giải pháp:** Gõ tay tài khoản thay vì dán từ clipboard.

---

## 🎨 Stack công nghệ chi tiết

### Frontend Framework
- **Next.js 14** với App Router — Cấu trúc file-based routing, Server/Client Components
- **TypeScript 5** — Kiểm tra kiểu tĩnh toàn bộ codebase

### Styling
- **Tailwind CSS 3** — Utility classes, dark mode, custom color tokens
- **Framer Motion 12** — Page transitions, modal animations, micro-interactions

### Data Visualization
- **D3.js 7** — SVG line charts (CPU/RAM metrics), Arc ring charts (compliance score)

### Icons & UI
- **Lucide React** — 1000+ icon SVG consistent style

### Auth (Frontend Mock)
- **localStorage** — Lưu `userRole` session phía client
- **AuthGuard component** — Higher-order component bảo vệ route

### Backend-ready (optional)
- **Supabase JS** — Client SDK cho PostgreSQL database và Auth

---

## 🔐 Kiến trúc Authentication

```
User truy cập URL bất kỳ
        ↓
  AuthGuard.tsx kiểm tra
  localStorage["userRole"]
        ↓
  ┌─────────────────────┐
  │ Chưa đăng nhập?     │ → Redirect về /login
  │ Đăng nhập nhầm role?│ → Xóa session, về /login
  │ Đúng role?          │ → Render portal tương ứng
  └─────────────────────┘
        ↓ /login
  Nhập credentials
        ↓
  So sánh với mock users
        ↓
  localStorage.setItem("userRole", role)
        ↓
  router.push(portal_path)
```

---

## 🗺️ Roadmap (Các tính năng kế hoạch)

- [ ] Kết nối backend API thực (thay thế mock data)
- [ ] Tích hợp Supabase Auth cho đăng nhập thực tế
- [ ] Crawler engine thực quét website
- [ ] Export PDF thực sự (sử dụng puppeteer/jsPDF)
- [ ] Webhook thực gửi alert tới Slack/Teams
- [ ] Responsive mobile cho User Portal

---

## 📄 Giấy phép

MIT License — Xem file [LICENSE](./LICENSE) để biết chi tiết.

---

<div align="center">

Được xây dựng với ❤️ bởi nhóm **VNComply** · [Báo lỗi](https://github.com/dyltran3/VnComplyDemo/issues)

</div>
