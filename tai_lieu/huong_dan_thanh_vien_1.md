# HƯỚNG DẪN DÀNH CHO THÀNH VIÊN 1 (TV1 — SẢN PHẨM & MUA SẮM)

Tài liệu hướng dẫn phát triển, kiểm thử, tích hợp và bàn giao dành riêng cho **Thành viên 1** phụ trách module **Sản phẩm & Mua sắm** trong đồ án Thực tập cơ sở.

---

## 1. TỔNG QUAN CẤU TRÚC MÃ NGUỒN

```text
├── giao_dien/              # Frontend React (giao dien nguoi dung)
│   ├── trang/              # Cac trang: trang_chu, trang_cua_hang, trang_chi_tiet_san_pham
│   ├── thanh_phan/         # 12 components UI tai su dung
│   └── kiem_thu/           # 7 bo test component va page bang Vitest + RTL
├── may_chu/                # Backend HTTP API Express RESTful
│   ├── dieu_khien/         # Controllers tiep nhan request, tra ve response chuan
│   ├── duong_dan/          # Express Routers dinh tuyen API
│   ├── dich_vu/            # Services trung gian ket noi nghiep vu va may chu
│   ├── kiem_tra_du_lieu/   # Middlewares validation du lieu dau vao
│   ├── trung_gian/         # Middlewares xac thuc nguoi dung, phan quyen admin, bat loi
│   └── kiem_thu/           # 4 bo test API endpoints bang Supertest
├── co_so_du_lieu/          # Co so du lieu SQLite
│   ├── mo_hinh/            # Models thuc hien truy van parameterized query
│   ├── tao_bang/           # Tap tin DDL SQL khoi tao bang chuan snake_case
│   └── du_lieu_mau/        # Tap tin DML SQL nap du lieu mau
├── nghiep_vu/              # Tang nghiep vu thuan tuy doc lap framework
│   ├── san_pham/           # Logic them, sua, xoa, xem, tim kiem, loc, sap xep san pham
│   ├── danh_muc/           # Logic xem danh muc, loc san pham theo danh muc
│   ├── hinh_anh/           # Logic quan ly thu vien hinh anh
│   └── danh_gia/           # Logic gui danh gia, tinh diem trung binh tu dong
└── tai_lieu/               # 4 tai lieu ky thuat chi tiet
```

---

## 2. HƯỚNG DẪN CÀI ĐẶT & VẬN HÀNH

### 2.1. Cài đặt các gói phụ thuộc
Sử dụng Node.js (khuyến nghị phiên bản Node 18 trở lên):
```bash
npm install
```

### 2.2. Khởi tạo & nạp dữ liệu mẫu cho Database
Thực thi lệnh sau để tạo các bảng SQL và nạp 40 sản phẩm, 7 danh mục, hình ảnh và đánh giá mẫu:
```bash
npm run seed
```

### 2.3. Khởi chạy Backend Server
Máy chủ Express sẽ lắng nghe tại cổng `5000`:
```bash
npm run server
```
Kiểm tra sức khỏe hệ thống tại: `http://localhost:5000/api/trang-thai`

### 2.4. Khởi chạy Giao diện Frontend (Chế độ phát triển)
Khởi chạy Vite dev server:
```bash
npm run dev
```

### 2.5. Chạy toàn bộ bộ kiểm thử tự động (Unit & Integration Tests)
Chạy toàn bộ 11 file test (gồm 50 test cases cho cả Backend và Frontend):
```bash
npm test
```

### 2.6. Đóng gói mã nguồn cho môi trường Production
Build bundle tối ưu hóa ra thư mục `dist/`:
```bash
npm run build
```

---

## 3. CÁC NGUYÊN TẮC BẮT BUỘC KHI PHÁT TRIỂN TIẾP
1. **Quy tắc Bounded Context**:
   - Chỉ thao tác trên 4 bảng: `san_pham`, `danh_muc`, `hinh_anh_san_pham`, `danh_gia`.
   - Khi cần thông tin người dùng thực hiện đánh giá, lấy từ `req.user.id` do middleware xác thực cấp, không tạo bảng `users`.
2. **Quy tắc Naming Convention**:
   - Toàn bộ tên file, thư mục, hàm, biến, bảng, cột tự đặt phải tuân thủ chuẩn `snake_case` không dấu (ví dụ: `ten_san_pham`, `danh_muc_id`, `so_luong_ton`).
   - SQL comments chỉ sử dụng `-- comment`.
3. **Bảo mật**:
   - Sử dụng prepared statements để loại bỏ hoàn toàn nguy cơ SQL Injection.
   - Luôn kiểm tra tính hợp lệ dữ liệu (validation) tại middleware trước khi đẩy vào nghiệp vụ.