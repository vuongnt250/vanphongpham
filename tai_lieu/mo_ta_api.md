# TÀI LIỆU ĐẶC TẢ TOÀN BỘ 24 RESTFUL API (TV1 — SẢN PHẨM & MUA SẮM)

Dự án: **Hệ thống thương mại điện tử văn phòng phẩm SmartDesk**  
Module: **Thành viên 1 — Sản phẩm & Mua sắm (TV1)**  
Giao thức: **HTTP / RESTful JSON**  
Cổng dịch vụ mặc định: `5000` (hoặc cấu hình qua biến môi trường `PORT`)  
Tổng số endpoints thực tế: **24 endpoints**

---

## 1. QUY ƯỚC CHUNG

### 1.1. Định dạng Response chuẩn
- **Thành công (200 / 201)**:
```json
{
  "success": true,
  "message": "Thông báo nếu có",
  "data": { ... },
  "phan_trang": {
    "trang_hien_tai": 1,
    "gioi_han": 12,
    "tong_so_muc": 40,
    "tong_so_trang": 4
  }
}
```
- **Thất bại (400 / 401 / 403 / 404 / 500)**:
```json
{
  "success": false,
  "message": "Thông điệp lỗi chi tiết",
  "errors": ["Chi tiết lỗi 1", "Chi tiết lỗi 2"]
}
```

### 1.2. Xác thực (Authentication) & Phân quyền (Authorization)
- Header xác thực: `x-user-id: <id>` (hoặc `Authorization: Bearer <token>`).
- Quyền Admin: `x-user-role: admin`.
- Các API truy vấn (`GET`) là công khai (Public).
- API gửi đánh giá (`POST /api/san-pham/:id/danh-gia`) bắt buộc đăng nhập (HTTP 401 nếu thiếu).
- Các API tạo, sửa, xóa dữ liệu yêu cầu quyền Admin để TV3 tích hợp (HTTP 403 nếu thiếu quyền).

---

## 2. DANH SÁCH TOÀN BỘ 24 ENDPOINTS CHI TIẾT

### NHÓM 0: HỆ THỐNG (1 endpoint)
#### 01. `GET /api/trang-thai`
- **Mục đích**: Kiểm tra sức khỏe máy chủ (Health Check).
- **Authentication**: Không (Public).
- **Authorization**: Không.
- **Request params/body**: Không.
- **Response thành công**: `200 OK` `{ success: true, message: "May chu TV1 dang hoat dong binh thuong.", thoi_gian: "..." }`
- **Mã lỗi chính**: `500`.

---

### NHÓM 1: SẢN PHẨM & MUA SẮM (11 endpoints)

#### 02. `GET /api/san-pham/thuong-hieu`
- **Mục đích**: Lấy danh sách tất cả các thương hiệu duy nhất phục vụ bộ lọc.
- **Authentication**: Không.
- **Authorization**: Không.
- **Response thành công**: `200 OK` `{ success: true, data: ["Double A", "Deli", "Thien Long", "HP", "Minh Chau"] }`
- **Mã lỗi chính**: `500`.

#### 03. `GET /api/san-pham`
- **Mục đích**: Lấy danh sách sản phẩm có phân trang, tìm kiếm, lọc đa tiêu chí và sắp xếp.
- **Authentication**: Không.
- **Authorization**: Không.
- **Query Params**:
  - `tu_khoa` (string): Tìm kiếm tên, mô tả hoặc thương hiệu.
  - `danh_muc_id` (integer): Lọc theo danh mục.
  - `gia_tu` (number): Giá tối thiểu.
  - `gia_den` (number): Giá tối đa.
  - `thuong_hieu` (string): Lọc theo thương hiệu.
  - `noi_bat` (integer): 1 là sản phẩm nổi bật, 0 là thông thường.
  - `trang_thai` (string): Mặc định `hoat_dong`.
  - `sap_xep` (string): `moi_nhat`, `gia_tang`, `gia_giam`, `ban_chay`, `danh_gia_cao`.
  - `trang` (integer): Trang hiện tại (mặc định 1).
  - `gioi_han` (integer): Số mục mỗi trang (mặc định 12).
- **Response thành công**: `200 OK` `{ success: true, data: [...], phan_trang: { ... } }`
- **Mã lỗi chính**: `400`, `500`.

#### 04. `GET /api/san-pham/:id`
- **Mục đích**: Lấy thông tin chi tiết một sản phẩm kèm danh sách ảnh và thống kê đánh giá.
- **Authentication**: Không.
- **Authorization**: Không.
- **Request Params**: `id` (integer) - Mã sản phẩm.
- **Response thành công**: `200 OK` `{ success: true, data: { id: 1, ten_san_pham: "...", hinh_anh: [...], thong_ke_danh_gia: { ... } } }`
- **Mã lỗi chính**: `404 Not Found` (nếu ID không tồn tại), `500`.

#### 05. `POST /api/san-pham`
- **Mục đích**: Thêm sản phẩm mới vào hệ thống (Dành cho Admin TV3 tích hợp).
- **Authentication**: Bắt buộc.
- **Authorization**: Yêu cầu quyền `admin` (`x-user-role: admin`).
- **Validation**: Tên sản phẩm không được rỗng, `danh_muc_id` hợp lệ, `gia >= 0`, `so_luong_ton >= 0`.
- **Request Body**:
```json
{
  "ten_san_pham": "Giấy in Double A A4 80gsm",
  "danh_muc_id": 1,
  "nha_cung_cap_id": 2,
  "gia": 85000,
  "gia_goc": 95000,
  "so_luong_ton": 150,
  "don_vi_tinh": "Ram",
  "thuong_hieu": "Double A",
  "mo_ta": "Giấy in cao cấp...",
  "noi_bat": 1
}
```
- **Response thành công**: `201 Created` `{ success: true, message: "Tao san pham thanh cong.", data: { ... } }`
- **Mã lỗi chính**: `400 Bad Request` (dữ liệu sai), `403 Forbidden` (thiếu quyền admin), `500`.

#### 06. `PUT /api/san-pham/:id`
- **Mục đích**: Cập nhật thông tin sản phẩm theo ID.
- **Authentication**: Bắt buộc.
- **Authorization**: Yêu cầu quyền `admin`.
- **Request Params**: `id` (integer).
- **Request Body**: Các trường cần cập nhật (`ten_san_pham`, `gia`, `so_luong_ton`, `mo_ta`, v.v.).
- **Response thành công**: `200 OK` `{ success: true, message: "Cap nhat san pham thanh cong.", data: { ... } }`
- **Mã lỗi chính**: `400`, `403`, `404 Not Found`, `500`.

#### 07. `DELETE /api/san-pham/:id`
- **Mục đích**: Xóa một sản phẩm khỏi hệ thống (tự động xóa liên đới ảnh và đánh giá).
- **Authentication**: Bắt buộc.
- **Authorization**: Yêu cầu quyền `admin`.
- **Request Params**: `id` (integer).
- **Response thành công**: `200 OK` `{ success: true, message: "Xoa san pham thanh cong." }`
- **Mã lỗi chính**: `403`, `404`, `500`.

#### 08. `GET /api/san-pham/:id/hinh-anh`
- **Mục đích**: Lấy danh sách hình ảnh của sản phẩm theo mã sản phẩm.
- **Authentication**: Không.
- **Authorization**: Không.
- **Request Params**: `id` (integer).
- **Response thành công**: `200 OK` `{ success: true, data: [{ id: 1, duong_dan_anh: "...", la_anh_chinh: 1 }, ...] }`
- **Mã lỗi chính**: `500`.

#### 09. `POST /api/san-pham/:id/hinh-anh`
- **Mục đích**: Thêm hình ảnh mới cho sản phẩm.
- **Authentication**: Bắt buộc.
- **Authorization**: Yêu cầu quyền `admin`.
- **Request Params**: `id` (integer) - Mã sản phẩm.
- **Request Body**: `{ "duong_dan_anh": "/images/...", "la_anh_chinh": 0 }`.
- **Response thành công**: `201 Created` `{ success: true, message: "Them hinh anh thanh cong.", data: { ... } }`
- **Mã lỗi chính**: `400`, `403`, `500`.

#### 10. `PUT /api/san-pham/:san_pham_id/hinh-anh/:hinh_anh_id/anh-chinh`
- **Mục đích**: Đặt một hình ảnh làm ảnh đại diện chính của sản phẩm.
- **Authentication**: Bắt buộc.
- **Authorization**: Yêu cầu quyền `admin`.
- **Request Params**: `san_pham_id` (integer), `hinh_anh_id` (integer).
- **Response thành công**: `200 OK` `{ success: true, message: "Dat anh chinh thanh cong.", data: { ... } }`
- **Mã lỗi chính**: `400`, `403`, `404`, `500`.

#### 11. `GET /api/san-pham/:id/danh-gia`
- **Mục đích**: Lấy danh sách đánh giá và bảng tổng hợp thống kê số sao của một sản phẩm.
- **Authentication**: Không.
- **Authorization**: Không.
- **Request Params**: `id` (integer) - Mã sản phẩm.
- **Response thành công**: `200 OK` `{ success: true, data: [...], thong_ke: { diem_trung_binh: 4.8, tong_so_danh_gia: 80, chi_tiet_sao: { ... } } }`
- **Mã lỗi chính**: `500`.

#### 12. `POST /api/san-pham/:id/danh-gia`
- **Mục đích**: Gửi đánh giá mới cho sản phẩm từ khách hàng đã đăng nhập.
- **Authentication**: Bắt buộc (lấy `user_id` từ `req.user.id`).
- **Authorization**: Khách hàng đã đăng nhập.
- **Validation**: `so_sao` phải là số nguyên từ 1 đến 5, `noi_dung` tối thiểu 3 ký tự.
- **Request Params**: `id` (integer) - Mã sản phẩm.
- **Request Body**:
```json
{
  "so_sao": 5,
  "noi_dung": "Giấy in rất đẹp, trắng mịn và không bị kẹt giấy.",
  "don_hang_id": 1001
}
```
- **Bảo mật**: Server bỏ qua `body.user_id` nếu cố tình gửi; chỉ gán `user_id` từ `req.user.id`.
- **Response thành công**: `201 Created` `{ success: true, message: "Gui danh gia thanh cong.", data: { ... }, thong_ke: { ... } }`
- **Mã lỗi chính**: `400 Bad Request` (sai số sao/nội dung), `401 Unauthorized` (chưa đăng nhập), `500`.

---

### NHÓM 2: DANH MỤC SẢN PHẨM (6 endpoints)

#### 13. `GET /api/danh-muc`
- **Mục đích**: Lấy danh sách toàn bộ danh mục sản phẩm.
- **Authentication**: Không.
- **Authorization**: Không.
- **Query Params**: `trang_thai` (string - `hoat_dong`, `tam_khoa`).
- **Response thành công**: `200 OK` `{ success: true, data: [{ id: 1, ten_danh_muc: "...", duong_dan_danh_muc: "..." }, ...] }`
- **Mã lỗi chính**: `500`.

#### 14. `GET /api/danh-muc/:id`
- **Mục đích**: Lấy chi tiết một danh mục theo ID hoặc theo slug (`duong_dan_danh_muc`).
- **Authentication**: Không.
- **Authorization**: Không.
- **Request Params**: `id` (integer hoặc string).
- **Response thành công**: `200 OK` `{ success: true, data: { id: 1, ten_danh_muc: "...", ... } }`
- **Mã lỗi chính**: `404 Not Found`, `500`.

#### 15. `GET /api/danh-muc/:id/san-pham`
- **Mục đích**: Lấy danh sách sản phẩm thuộc một danh mục cụ thể.
- **Authentication**: Không.
- **Authorization**: Không.
- **Request Params**: `id` (integer) - Mã danh mục.
- **Query Params**: `gia_tu`, `gia_den`, `thuong_hieu`, `sap_xep`, `trang`, `gioi_han`.
- **Response thành công**: `200 OK` `{ success: true, danh_muc: { ... }, data: [...], phan_trang: { ... } }`
- **Mã lỗi chính**: `404 Not Found`, `500`.

#### 16. `POST /api/danh-muc`
- **Mục đích**: Thêm danh mục mới.
- **Authentication**: Bắt buộc.
- **Authorization**: Yêu cầu quyền `admin`.
- **Validation**: `ten_danh_muc` và `duong_dan_danh_muc` không được để trống.
- **Request Body**:
```json
{
  "ten_danh_muc": "Bìa & Hồ sơ lưu trữ",
  "duong_dan_danh_muc": "bia-ho-so-luu-tru",
  "mo_ta": "Các loại bìa lưu trữ...",
  "trang_thai": "hoat_dong"
}
```
- **Response thành công**: `201 Created` `{ success: true, message: "Tao danh muc thanh cong.", data: { ... } }`
- **Mã lỗi chính**: `400`, `403`, `500`.

#### 17. `PUT /api/danh-muc/:id`
- **Mục đích**: Cập nhật thông tin danh mục.
- **Authentication**: Bắt buộc.
- **Authorization**: Yêu cầu quyền `admin`.
- **Request Params**: `id` (integer).
- **Request Body**: Các trường cập nhật.
- **Response thành công**: `200 OK` `{ success: true, message: "Cap nhat danh muc thanh cong.", data: { ... } }`
- **Mã lỗi chính**: `400`, `403`, `404`, `500`.

#### 18. `DELETE /api/danh-muc/:id`
- **Mục đích**: Xóa danh mục sản phẩm.
- **Authentication**: Bắt buộc.
- **Authorization**: Yêu cầu quyền `admin`.
- **Ràng buộc an toàn**: Chặn xóa và trả về lỗi 400 nếu danh mục này đang chứa sản phẩm.
- **Request Params**: `id` (integer).
- **Response thành công**: `200 OK` `{ success: true, message: "Xoa danh muc thanh cong." }`
- **Mã lỗi chính**: `400 Bad Request` (còn sản phẩm), `403`, `404`, `500`.

---

### NHÓM 3: QUẢN LÝ HÌNH ẢNH TRỰC TIẾP (3 endpoints)

#### 19. `GET /api/hinh-anh/:id`
- **Mục đích**: Lấy chi tiết thông tin một hình ảnh theo ID.
- **Authentication**: Không.
- **Authorization**: Không.
- **Request Params**: `id` (integer).
- **Response thành công**: `200 OK` `{ success: true, data: { id: 1, san_pham_id: 1, duong_dan_anh: "...", la_anh_chinh: 1 } }`
- **Mã lỗi chính**: `404`, `500`.

#### 20. `PUT /api/hinh-anh/:id`
- **Mục đích**: Cập nhật đường dẫn ảnh hoặc cờ ảnh chính theo ID.
- **Authentication**: Bắt buộc.
- **Authorization**: Yêu cầu quyền `admin`.
- **Request Params**: `id` (integer).
- **Request Body**: `{ "duong_dan_anh": "...", "la_anh_chinh": 1 }`.
- **Response thành công**: `200 OK` `{ success: true, message: "Cap nhat hinh anh thanh cong.", data: { ... } }`
- **Mã lỗi chính**: `400`, `403`, `404`, `500`.

#### 21. `DELETE /api/hinh-anh/:id`
- **Mục đích**: Xóa một hình ảnh theo ID.
- **Authentication**: Bắt buộc.
- **Authorization**: Yêu cầu quyền `admin`.
- **Request Params**: `id` (integer).
- **Response thành công**: `200 OK` `{ success: true, message: "Xoa hinh anh thanh cong." }`
- **Mã lỗi chính**: `403`, `404`, `500`.

---

### NHÓM 4: QUẢN LÝ ĐÁNH GIÁ TRỰC TIẾP (3 endpoints)

#### 22. `GET /api/danh-gia/:id`
- **Mục đích**: Lấy chi tiết thông tin một đánh giá theo ID.
- **Authentication**: Không.
- **Authorization**: Không.
- **Request Params**: `id` (integer).
- **Response thành công**: `200 OK` `{ success: true, data: { id: 1, san_pham_id: 1, user_id: 2, so_sao: 5, noi_dung: "...", ... } }`
- **Mã lỗi chính**: `404`, `500`.

#### 23. `PUT /api/danh-gia/:id`
- **Mục đích**: Quản trị viên cập nhật trạng thái hoặc kiểm duyệt đánh giá.
- **Authentication**: Bắt buộc.
- **Authorization**: Yêu cầu quyền `admin`.
- **Request Params**: `id` (integer).
- **Request Body**: `{ "trang_thai": "da_duyet" }` hoặc `{ "so_sao": 4, "noi_dung": "..." }`.
- **Response thành công**: `200 OK` `{ success: true, message: "Cap nhat danh gia thanh cong.", data: { ... } }`
- **Mã lỗi chính**: `400`, `403`, `404`, `500`.

#### 24. `DELETE /api/danh-gia/:id`
- **Mục đích**: Xóa một đánh giá vi phạm chính sách (tự động tính lại điểm trung bình cho sản phẩm).
- **Authentication**: Bắt buộc.
- **Authorization**: Yêu cầu quyền `admin`.
- **Request Params**: `id` (integer).
- **Response thành công**: `200 OK` `{ success: true, message: "Xoa danh gia thanh cong." }`
- **Mã lỗi chính**: `403`, `404`, `500`.

---

## 3. BẢNG TỔNG HỢP ĐỐI CHIẾU SOURCE ROUTES VS DOCUMENTATION

| STT | Phương thức | Đường dẫn API | Router file | Authentication | Authorization |
| :---: | :---: | :--- | :--- | :---: | :---: |
| 1 | GET | `/api/trang-thai` | `may_chu/app.js` | Không | Không |
| 2 | GET | `/api/san-pham/thuong-hieu` | `duong_dan_san_pham.js` | Không | Không |
| 3 | GET | `/api/san-pham` | `duong_dan_san_pham.js` | Không | Không |
| 4 | GET | `/api/san-pham/:id` | `duong_dan_san_pham.js` | Không | Không |
| 5 | POST | `/api/san-pham` | `duong_dan_san_pham.js` | Bắt buộc | Admin |
| 6 | PUT | `/api/san-pham/:id` | `duong_dan_san_pham.js` | Bắt buộc | Admin |
| 7 | DELETE | `/api/san-pham/:id` | `duong_dan_san_pham.js` | Bắt buộc | Admin |
| 8 | GET | `/api/san-pham/:id/hinh-anh` | `duong_dan_san_pham.js` | Không | Không |
| 9 | POST | `/api/san-pham/:id/hinh-anh` | `duong_dan_san_pham.js` | Bắt buộc | Admin |
| 10 | PUT | `/api/san-pham/:sp_id/hinh-anh/:ha_id/anh-chinh` | `duong_dan_san_pham.js` | Bắt buộc | Admin |
| 11 | GET | `/api/san-pham/:id/danh-gia` | `duong_dan_san_pham.js` | Không | Không |
| 12 | POST | `/api/san-pham/:id/danh-gia` | `duong_dan_san_pham.js` | Bắt buộc | Đăng nhập |
| 13 | GET | `/api/danh-muc` | `duong_dan_danh_muc.js` | Không | Không |
| 14 | GET | `/api/danh-muc/:id` | `duong_dan_danh_muc.js` | Không | Không |
| 15 | GET | `/api/danh-muc/:id/san-pham` | `duong_dan_danh_muc.js` | Không | Không |
| 16 | POST | `/api/danh-muc` | `duong_dan_danh_muc.js` | Bắt buộc | Admin |
| 17 | PUT | `/api/danh-muc/:id` | `duong_dan_danh_muc.js` | Bắt buộc | Admin |
| 18 | DELETE | `/api/danh-muc/:id` | `duong_dan_danh_muc.js` | Bắt buộc | Admin |
| 19 | GET | `/api/hinh-anh/:id` | `duong_dan_hinh_anh.js` | Không | Không |
| 20 | PUT | `/api/hinh-anh/:id` | `duong_dan_hinh_anh.js` | Bắt buộc | Admin |
| 21 | DELETE | `/api/hinh-anh/:id` | `duong_dan_hinh_anh.js` | Bắt buộc | Admin |
| 22 | GET | `/api/danh-gia/:id` | `duong_dan_danh_gia.js` | Không | Không |
| 23 | PUT | `/api/danh-gia/:id` | `duong_dan_danh_gia.js` | Bắt buộc | Admin |
| 24 | DELETE | `/api/danh-gia/:id` | `duong_dan_danh_gia.js` | Bắt buộc | Admin |

**XÁC NHẬN ĐỒNG BỘ TUYỆT ĐỐI**:
- **Source routes = 24**
- **Documentation routes = 24**