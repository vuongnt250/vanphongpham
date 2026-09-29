# SƠ ĐỒ CƠ SỞ DỮ LIỆU & ĐẶC TẢ BẢNG (DATABASE DESIGN)

Dự án: **SmartDesk — Văn phòng phẩm**  
Module: **Thành viên 1 — Sản phẩm & Mua sắm (TV1)**  
Hệ quản trị CSDL: **SQLite / SQL chuẩn**  
Quy ước đặt tên: **snake_case tiếng Việt không dấu**

---

## 1. SƠ ĐỒ QUAN HỆ THỰC THỂ (ERD)

```text
  +--------------------------------+
  |           danh_muc             |
  +--------------------------------+
  | PK  id                         |
  |     ten_danh_muc               |
  |     duong_dan_danh_muc (UNIQUE)|
  |     mo_ta                      |
  |     trang_thai                 |
  +--------------------------------+
                  | 1
                  |
                  | n
  +--------------------------------+         +-------------------------------+
  |            san_pham            | 1     n |       hinh_anh_san_pham       |
  +--------------------------------+---------+-------------------------------+
  | PK  id                         |         | PK  id                        |
  | FK  danh_muc_id                |         | FK  san_pham_id               |
  | FK  nha_cung_cap_id (TV3 ref)  |         |     duong_dan_anh             |
  |     ten_san_pham               |         |     la_anh_chinh              |
  |     gia                        |         +-------------------------------+
  |     gia_goc                    |
  |     so_luong_ton               |
  |     da_ban                     |
  |     don_vi_tinh                |
  |     thuong_hieu                |
  |     mo_ta                      |
  |     diem_danh_gia              |
  |     so_luong_danh_gia          |
  |     trang_thai                 |
  |     noi_bat                    |
  |     ngay_tao                   |
  +--------------------------------+
                  | 1
                  |
                  | n
  +--------------------------------+
  |            danh_gia            |
  +--------------------------------+
  | PK  id                         |
  | FK  san_pham_id                |
  | FK  user_id (TV2 reference)    |  <-- Luu y: TV1 chi tham chieu user_id,
  | FK  don_hang_id (TV2 reference)|      khong tao lai bang users
  |     so_sao (CHECK 1..5)        |
  |     noi_dung                   |
  |     trang_thai                 |
  |     ngay_tao                   |
  +--------------------------------+
```

---

## 2. CHI TIẾT CÁC BẢNG DỮ LIỆU CỦA TV1

### 2.1. Bảng `danh_muc` (Danh mục sản phẩm)
| Tên cột | Kiểu dữ liệu | Nullable | Ràng buộc / Mặc định | Mô tả |
| :--- | :--- | :---: | :--- | :--- |
| `id` | INTEGER | NO | PRIMARY KEY AUTOINCREMENT | Mã định danh danh mục |
| `ten_danh_muc` | VARCHAR(255) | NO | | Tên hiển thị của danh mục |
| `duong_dan_danh_muc` | VARCHAR(255) | NO | UNIQUE | Đường dẫn thân thiện (slug) |
| `mo_ta` | TEXT | YES | | Mô tả chi tiết danh mục |
| `trang_thai` | VARCHAR(50) | YES | DEFAULT 'hoat_dong' | Trạng thái (`hoat_dong`, `tam_khoa`) |

- **Chỉ mục (Indexes)**:
  - `idx_danh_muc_duong_dan` trên `(duong_dan_danh_muc)`
  - `idx_danh_muc_trang_thai` trên `(trang_thai)`

---

### 2.2. Bảng `san_pham` (Sản phẩm văn phòng phẩm)
| Tên cột | Kiểu dữ liệu | Nullable | Ràng buộc / Mặc định | Mô tả |
| :--- | :--- | :---: | :--- | :--- |
| `id` | INTEGER | NO | PRIMARY KEY AUTOINCREMENT | Mã định danh sản phẩm |
| `danh_muc_id` | INTEGER | NO | REFERENCES danh_muc(id) | Khóa ngoại tới bảng danh mục |
| `nha_cung_cap_id` | INTEGER | YES | Tham chiếu TV3 | Mã nhà cung cấp (TV3) |
| `ten_san_pham` | VARCHAR(255) | NO | | Tên sản phẩm |
| `gia` | DECIMAL(12,2) | NO | CHECK (gia >= 0) | Giá bán hiện tại |
| `gia_goc` | DECIMAL(12,2) | YES | CHECK (gia_goc >= 0) | Giá niêm yết ban đầu |
| `so_luong_ton` | INTEGER | YES | DEFAULT 0, CHECK (>= 0) | Số lượng còn trong kho |
| `da_ban` | INTEGER | YES | DEFAULT 0, CHECK (>= 0) | Số lượng đã bán ra |
| `don_vi_tinh` | VARCHAR(50) | YES | Mặc định 'Cai' | Đơn vị (Ram, Cuộn, Cây, Hộp) |
| `thuong_hieu` | VARCHAR(100) | YES | | Thương hiệu (Thiên Long, Double A...) |
| `mo_ta` | TEXT | YES | | Thông tin chi tiết sản phẩm |
| `diem_danh_gia` | DECIMAL(3,2) | YES | DEFAULT 0, CHECK (0..5) | Điểm đánh giá trung bình |
| `so_luong_danh_gia`| INTEGER | YES | DEFAULT 0, CHECK (>= 0) | Tổng số lượt đánh giá |
| `trang_thai` | VARCHAR(50) | YES | DEFAULT 'hoat_dong' | `hoat_dong`, `ngung_kinh_doanh` |
| `noi_bat` | INTEGER | YES | DEFAULT 0 | 1 nếu là sản phẩm nổi bật |
| `ngay_tao` | DATETIME | YES | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo sản phẩm |

- **Chỉ mục (Indexes)**:
  - `idx_san_pham_danh_muc_id` trên `(danh_muc_id)`
  - `idx_san_pham_gia` trên `(gia)`
  - `idx_san_pham_thuong_hieu` trên `(thuong_hieu)`
  - `idx_san_pham_noi_bat` trên `(noi_bat)`
  - `idx_san_pham_trang_thai` trên `(trang_thai)`

---

### 2.3. Bảng `hinh_anh_san_pham` (Hình ảnh chi tiết sản phẩm)
| Tên cột | Kiểu dữ liệu | Nullable | Ràng buộc / Mặc định | Mô tả |
| :--- | :--- | :---: | :--- | :--- |
| `id` | INTEGER | NO | PRIMARY KEY AUTOINCREMENT | Mã định danh hình ảnh |
| `san_pham_id` | INTEGER | NO | REFERENCES san_pham(id) ON DELETE CASCADE | Khóa ngoại tới sản phẩm |
| `duong_dan_anh` | VARCHAR(500) | NO | | URL hoặc đường dẫn ảnh |
| `la_anh_chinh` | INTEGER | YES | DEFAULT 0 | 1 là ảnh đại diện chính |

- **Chỉ mục (Indexes)**:
  - `idx_hinh_anh_san_pham_id` trên `(san_pham_id)`

---

### 2.4. Bảng `danh_gia` (Đánh giá & Bình luận sản phẩm)
| Tên cột | Kiểu dữ liệu | Nullable | Ràng buộc / Mặc định | Mô tả |
| :--- | :--- | :---: | :--- | :--- |
| `id` | INTEGER | NO | PRIMARY KEY AUTOINCREMENT | Mã định danh đánh giá |
| `san_pham_id` | INTEGER | NO | REFERENCES san_pham(id) ON DELETE CASCADE | Khóa ngoại tới sản phẩm |
| `user_id` | INTEGER | NO | Tham chiếu TV2 | ID người dùng thực hiện đánh giá |
| `don_hang_id` | INTEGER | YES | Tham chiếu TV2 | Đơn hàng đã mua (nếu có) |
| `so_sao` | INTEGER | NO | CHECK (so_sao BETWEEN 1 AND 5) | Điểm sao đánh giá |
| `noi_dung` | TEXT | NO | | Lời nhận xét, bình luận |
| `trang_thai` | VARCHAR(50) | YES | DEFAULT 'da_duyet' | Trạng thái hiển thị |
| `ngay_tao` | DATETIME | YES | DEFAULT CURRENT_TIMESTAMP | Thời gian gửi đánh giá |

- **Chỉ mục (Indexes)**:
  - `idx_danh_gia_san_pham_id` trên `(san_pham_id)`
  - `idx_danh_gia_user_id` trên `(user_id)`
  - `idx_danh_gia_trang_thai` trên `(trang_thai)`

---

## 3. NGUYÊN TẮC RANH GIỚI KIẾN TRÚC MODULAR MONOLITH
- TV1 **không sở hữu** bảng `users`, `carts`, `orders` (thuộc TV2) và `suppliers`, `coupons` (thuộc TV3).
- Bảng `danh_gia` tham chiếu `user_id` để kết nối logic với người dùng khi hệ thống hoàn thiện tích hợp Monolith.