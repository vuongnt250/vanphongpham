# SMARTDESK — MODULE THÀNH VIÊN 1 (SẢN PHẨM & MUA SẮM)

Dự án Đồ án Thực tập Cơ sở: **Hệ thống Quản lý Bán hàng Văn phòng phẩm Trực tuyến SmartDesk**  
Kiến trúc: **Modular Monolith**  
Phụ trách module: **Thành viên 1 (TV1 — Sản phẩm & Mua sắm)**

---

## 1. GIỚI THIỆU CHUNG

Module **Thành viên 1** chịu trách nhiệm xây dựng toàn bộ hệ thống trưng bày, tìm kiếm, lọc, xem chi tiết và đánh giá sản phẩm văn phòng phẩm, bao gồm:
- Cơ sở dữ liệu quan hệ lưu trữ Danh mục, Sản phẩm, Hình ảnh và Đánh giá.
- Tầng nghiệp vụ xử lý logic độc lập không phụ thuộc framework.
- Tầng Backend API RESTful chuẩn mực với đầy đủ validation, xác thực, phân quyền Admin cho TV3 tích hợp, và xử lý lỗi tập trung.
- Tầng Frontend React SPA hiện đại, responsive, thẩm mỹ cao với đầy đủ trạng thái loading, error, empty state, và xử lý ảnh fallback an toàn.
- Bộ kiểm thử tự động 100% với 50 test cases đạt chuẩn (Unit tests, Component tests, API integration tests).

---

## 2. CẤU TRÚC THƯ MỤC CHUẨN

```text
├── giao_dien/              # Frontend React (Giao diện người dùng)
│   ├── trang/              # trang_chu, trang_cua_hang, trang_chi_tiet_san_pham
│   ├── thanh_phan/         # 12 components tái sử dụng
│   └── kiem_thu/           # 7 file test UI (React Testing Library + Vitest)
├── may_chu/                # Backend API Express RESTful
│   ├── dieu_khien/         # 4 controllers (san_pham, danh_muc, hinh_anh, danh_gia)
│   ├── duong_dan/          # 4 routers định tuyến API
│   ├── dich_vu/            # 4 services kết nối nghiệp vụ
│   ├── kiem_tra_du_lieu/   # 3 middlewares validation dữ liệu
│   ├── trung_gian/         # Middlewares xác thực, phân quyền Admin, xử lý lỗi
│   └── kiem_thu/           # 4 file test API tích hợp (Supertest)
├── co_so_du_lieu/          # Cơ sở dữ liệu SQLite
│   ├── mo_hinh/            # 4 models truy vấn dữ liệu chuẩn parameterized
│   ├── tao_bang/           # 4 file SQL DDL định nghĩa bảng snake_case
│   └── du_lieu_mau/        # 2 file SQL DML nạp dữ liệu mẫu
├── nghiep_vu/              # Tầng nghiệp vụ thuần túy độc lập
│   ├── san_pham/           # 7 chức năng nghiệp vụ sản phẩm
│   ├── danh_muc/           # 2 chức năng nghiệp vụ danh mục
│   ├── hinh_anh/           # 3 chức năng nghiệp vụ hình ảnh
│   └── danh_gia/           # 4 chức năng nghiệp vụ đánh giá & tính điểm
├── tai_lieu/               # Bộ tài liệu kỹ thuật hoàn chỉnh
│   ├── mo_ta_chuc_nang.md
│   ├── mo_ta_api.md
│   ├── so_do_co_so_du_lieu.md
│   └── huong_dan_thanh_vien_1.md
└── package.json
```

---

## 3. LỆNH THỰC THI CHÍNH

- **Cài đặt thư viện**: `npm install`
- **Khởi tạo & Nạp CSDL**: `npm run seed`
- **Chạy Backend Server**: `npm run server` (Cổng 5000)
- **Chạy Frontend (Dev)**: `npm run dev`
- **Chạy toàn bộ 50 Tests**: `npm test`
- **Kiểm tra Lint**: `npm run lint`
- **Đóng gói Production**: `npm run build`