# TÀI LIỆU MÔ TẢ CHỨC NĂNG (TV1 — SẢN PHẨM & MUA SẮM)

Dự án: **Hệ thống thương mại điện tử văn phòng phẩm SmartDesk**  
Module: **Thành viên 1 — Sản phẩm & Mua sắm (TV1)**  
Kiến trúc: **Modular Monolith**

---

## 1. TỔNG QUAN PHẠM VI TRÁCH NHIỆM CỦA THÀNH VIÊN 1

Theo phân chia ranh giới kiến trúc Modular Monolith của dự án:
- **TV1 (Sản phẩm & mua sắm)**: Quản lý toàn bộ danh mục sản phẩm, sản phẩm văn phòng phẩm, hình ảnh sản phẩm, và đánh giá/bình luận sản phẩm.
- **TV2 (Tài khoản, giỏ hàng & đơn hàng)**: Quản lý người dùng (`users`), địa chỉ (`addresses`), giỏ hàng (`carts`, `cart_items`), đơn hàng (`orders`, `order_items`), thanh toán (`payments`). TV1 **chỉ tham chiếu `user_id`** khi thực hiện đánh giá, tuyệt đối không tạo bảng hay quản lý bảng users.
- **TV3 (Admin & quản lý kinh doanh)**: Quản lý nhà cung cấp (`suppliers`), mã giảm giá (`coupons`), banner tiếp thị (`banners`), cấu hình hệ thống (`settings`), báo cáo doanh thu (`dashboard`), quản lý tồn kho nâng cao. TV1 cung cấp các API chuẩn RESTful để TV3 có thể quản trị sản phẩm thông qua xác thực phân quyền.

---

## 2. DANH SÁCH CÁC CHỨC NĂNG CHÍNH

### 2.1. Quản lý Danh mục Sản phẩm (`danh_muc`)
1. **Xem danh sách danh mục**:
   - Hiển thị danh mục đa cấp hoặc phẳng theo trạng thái hoạt động.
   - Hỗ trợ xem số lượng sản phẩm thuộc từng danh mục.
2. **Xem chi tiết danh mục**:
   - Truy vấn thông tin danh mục bằng ID hoặc đường dẫn thân thiện (slug).
3. **Lấy sản phẩm theo danh mục**:
   - Truy xuất danh sách sản phẩm thuộc một danh mục cụ thể, hỗ trợ kết hợp lọc giá, thương hiệu, sắp xếp và phân trang.
4. **Thêm, sửa, xóa danh mục**:
   - Cung cấp API có kiểm tra quyền quản trị (`admin`) để TV3 tích hợp quản lý.
   - Ràng buộc an toàn: Không cho phép xóa danh mục nếu đang có sản phẩm thuộc về danh mục đó.

### 2.2. Quản lý Sản phẩm (`san_pham`)
1. **Hiển thị danh sách sản phẩm**:
   - Hiển thị lưới sản phẩm với đầy đủ ảnh đại diện, tên, danh mục, thương hiệu, giá bán, giá gốc, tỷ lệ giảm giá, số sao đánh giá, số lượng đã bán, tình trạng còn hàng / hết hàng.
   - Xử lý mượt mà trạng thái đang tải (skeleton), danh sách rỗng, và lỗi kết nối.
2. **Tìm kiếm sản phẩm**:
   - Tìm kiếm thời gian thực theo từ khóa khớp tên sản phẩm, thương hiệu hoặc mô tả.
   - Hỗ trợ xóa nhanh từ khóa tìm kiếm.
3. **Lọc sản phẩm đa tiêu chí**:
   - Lọc theo danh mục đã chọn.
   - Lọc theo các khoảng giá gợi ý sẵn (Dưới 50k, 50k-100k, 100k-200k, Trên 200k) hoặc khoảng giá tự nhập tùy ý.
   - Lọc theo thương hiệu nổi tiếng (Thiên Long, Double A, Deli, HP, Minh Châu...).
   - Lọc theo sản phẩm nổi bật (`noi_bat = 1`).
4. **Sắp xếp sản phẩm**:
   - Mới nhất (mặc định theo ID giảm dần).
   - Giá: Thấp đến Cao.
   - Giá: Cao đến Thap.
   - Bán chạy nhất.
   - Đánh giá cao nhất.
5. **Phân trang sản phẩm**:
   - Phân trang linh hoạt theo kích thước trang (`gioi_han`), chuyển trang trước/sau, hiển thị tổng số trang và tổng số mục.
6. **Xem chi tiết sản phẩm**:
   - Hiển thị chi tiết thông số: đơn vị tính (Ram, Cây, Cuộn...), số lượng tồn kho thực tế, mô tả chi tiết sản phẩm.
   - Trình điều khiển số lượng mua và nút "Thêm vào giỏ hàng" (sẵn sàng tích hợp sang TV2).
   - Xử lý thông báo khi ID sản phẩm không tồn tại (404).

### 2.3. Quản lý Thư viện Hình ảnh Sản phẩm (`hinh_anh_san_pham`)
1. **Thư viện ảnh chi tiết**:
   - Hiển thị ảnh lớn trung tâm chất lượng cao.
   - Danh sách thumbnails bên dưới cho phép click chuyển ảnh xem nhanh.
   - Fallback tự động hiển thị SVG placeholder an toàn khi URL ảnh bị hỏng hoặc lỗi mạng.
2. **Quản trị hình ảnh**:
   - Thêm ảnh mới cho sản phẩm.
   - Đặt một hình ảnh làm ảnh chính (`la_anh_chinh = 1`), tự động cập nhật các ảnh khác về 0.
   - Xóa ảnh sản phẩm.

### 2.4. Hệ thống Đánh giá & Bình luận Sản phẩm (`danh_gia`)
1. **Xem thống kê đánh giá**:
   - Hiển thị điểm số trung bình (tính theo thang 5 sao).
   - Tổng số lượt đánh giá.
   - Biểu đồ phân bổ tỷ lệ phần trăm các mức sao từ 1 đến 5 sao.
2. **Xem danh sách bình luận**:
   - Danh sách nhận xét từ khách hàng gồm tên định danh, số sao, nội dung bình luận, ngày đăng.
   - Hỗ trợ trạng thái trống khi sản phẩm chưa có đánh giá nào.
3. **Gửi đánh giá mới**:
   - Chọn mức sao tương tác (1 - 5 sao).
   - Nhập nội dung nhận xét chi tiết (yêu cầu tối thiểu 3 ký tự).
   - **Bảo mật bắt buộc**: `user_id` được trích xuất trực tiếp từ phiên đăng nhập / token đã xác thực, không tin cậy `user_id` từ client body.
   - Tự động tính toán lại điểm trung bình và số lượt đánh giá của sản phẩm ngay khi lưu thành công.