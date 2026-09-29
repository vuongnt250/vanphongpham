# KỊCH BẢN BÁO CÁO & TRÌNH DIỄN DEMO WEBSITE SMARTDESK (TUẦN 1)
**HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG - KHOA CÔNG NGHỆ THÔNG TIN**  
**Môn học:** Thực tập cơ sở  
**Nhóm thực hiện:** Nhóm 3  
**Đề tài:** Xây dựng Website Thương mại Điện tử Quản lý Sản phẩm, Giỏ hàng và Hỗ trợ Khách hàng SmartDesk (Tích hợp Trợ lý Robot 3D, Tìm kiếm Giọng nói, So sánh Sản phẩm và Quản trị viên)

---

## 👥 PHÂN CHIA VAI TRÒ THUYẾT TRÌNH TRONG NHÓM
1. **Nguyễn Tiến Vương (B23DVCN183 - Trưởng nhóm):** 
   - Giới thiệu nhóm, trình bày Đề xuất đề tài, Mục tiêu & Công nghệ lựa chọn.
   - Trực tiếp Demo phần Khách hàng: Trang chủ (Banner lá cờ), Cửa hàng, Tìm kiếm giọng nói, Danh sách yêu thích, Ma trận so sánh sản phẩm, Robot Mascot 3D.
2. **Vũ Thị Vân (B23DVCN179):** 
   - Báo cáo phần Nghiên cứu luồng Giỏ hàng, Đặt hàng, Cơ chế bảo mật JWT & CSDL quan hệ.
   - Demo luồng Khách mua hàng: Chi tiết sản phẩm, Đánh giá nhận xét, Thêm giỏ hàng, Áp voucher khuyến mãi, Điền thông tin và thanh toán chuyển khoản VietQR Napas 247.
3. **Trần Việt Quang (B23DVCN127):** 
   - Báo cáo phân hệ Quản trị viên (Admin Dashboard), Kênh Ticket CSKH và Chất lượng phần mềm (Vitest 158/158 tests, 22 kịch bản E2E).
   - Demo luồng Admin: Đăng nhập Admin, Dashboard thống kê, Thêm sản phẩm (tải ảnh Base64 từ máy tính), Sửa sản phẩm, Duyệt đơn hàng và Trả lời ticket hỗ trợ khách hàng.

---

# PHẦN 1: BÁO CÁO ĐỀ XUẤT ĐỀ TÀI & NGHIÊN CỨU TUẦN 1
*(Thời lượng ước tính: 3 - 5 phút)*

### 1.1. Lời mở đầu (Nguyễn Tiến Vương trình bày)
> *"Em xin kính chào cô và các bạn! Hôm nay, Nhóm 3 chúng em xin phép được báo cáo đề xuất đề tài Thực tập cơ sở: **Xây dựng Website Thương mại Điện tử SmartDesk chuyên cung cấp thiết bị học tập, văn phòng phẩm thông minh**.*  
> *Trong tuần đầu tiên vừa qua, nhóm chúng em đã tập trung nghiên cứu toàn diện từ nghiệp vụ bài toán, phân tích CSDL quan hệ, thiết kế API chuẩn RESTful cho đến việc hoàn thiện một bản sản phẩm thực tế (MVP) hoàn chỉnh để hôm nay trực tiếp báo cáo và xin các ý kiến đóng góp quý báu từ cô."*

### 1.2. Tóm tắt Đề xuất đề tài & Lý do chọn đề tài
- **Bài toán thực tế:** Nhu cầu mua sắm thiết bị góc học tập, văn phòng phẩm công thái học (bàn ghế, đèn chống cận, phụ kiện setup, dụng cụ ghi chép) của học sinh, sinh viên và dân văn phòng ngày càng cao. Tuy nhiên, các website hiện nay thường thiếu tính năng hỗ trợ trực quan (như so sánh thông số, tìm kiếm nhanh bằng giọng nói hoặc trợ lý tương tác sinh động).
- **Mục tiêu đề tài:**
  - Xây dựng một nền tảng TMĐT hoàn chỉnh, chuẩn hóa quy trình mua sắm từ duyệt hàng, tìm kiếm, giỏ hàng, đặt hàng đến thanh toán.
  - Tích hợp các điểm nhấn công nghệ: **Tìm kiếm giọng nói tiếng Việt**, **Bảng so sánh đối chiếu sản phẩm**, **Danh sách yêu thích Wishlist**, và **Linh vật Trợ lý Robot Mascot 3D** tương tác biểu cảm.
  - Xây dựng hệ thống quản trị **Admin Dashboard** toàn diện giúp quản lý sản phẩm (hỗ trợ upload ảnh trực tiếp, chỉnh sửa thông tin), tồn kho, đơn hàng và hỗ trợ khách hàng đa kênh qua Ticket.
- **Đối tượng sử dụng:** Khách hàng (Học sinh, sinh viên, người đi làm) & Ban quản trị cửa hàng (Admin/Nhân viên vận hành).

### 1.3. Những gì nhóm đã tìm hiểu & nghiên cứu trong tuần 1
Trong tuần 1, nhóm đã hoàn thành nghiên cứu 4 khối kiến thức nền tảng:
1. **Kiến trúc Full-Stack hiện đại:** 
   - Frontend: Single Page Application (SPA) với ReactJS 18 + Vite, tối ưu hóa tốc độ tải trang, chia tách components module hóa rõ ràng.
   - Backend: Node.js kết hợp Express Framework xây dựng kiến trúc RESTful API, phân tách Controller - Model - Middleware chuẩn công nghiệp.
2. **Thiết kế Cơ sở Dữ liệu Quan hệ chuẩn hóa (3NF):** 
   - Sử dụng SQLite (gọn nhẹ, độc lập, không phụ thuộc cài đặt máy chủ phức tạp).
   - Thiết kế hệ thống 11 bảng quan hệ chặt chẽ: `san_pham`, `danh_muc`, `hinh_anh_san_pham`, `danh_gia`, `nguoi_dung`, `gio_hang`, `chi_tiet_gio_hang`, `don_hang`, `chi_tiet_don_hang`, `ma_giam_gia`, `ticket_ho_tro`, `tin_nhan_ticket`.
3. **Bảo mật và Kiểm soát quyền hạn (RBAC):**
   - Xác thực người dùng bằng JSON Web Token (JWT) Bearer Token, mã hóa mật khẩu một chiều với thuật toán `Bcrypt`.
   - Cơ chế bảo vệ API chống lỗ hổng phân quyền ngang (IDOR), kiểm tra số lượng tồn kho nguyên tử (Atomic Inventory Deduction).
4. **Công nghệ giao diện và tương tác tiên tiến:**
   - Web Speech API chuẩn trình duyệt hỗ trợ nhận diện giọng nói tiếng Việt tự nhiên (`vi-VN`).
   - Kỹ thuật tạo hình CSS 3D Transforms và SVG để phát triển Linh vật Robot Mascot 3D 60fps siêu nhẹ không cần tải thư viện 3D nặng.
   - FileReader API xử lý hình ảnh chuyển sang chuỗi Base64 Data URL giúp upload ảnh ngay trên máy tính mà không cần cấu hình cloud storage phức tạp.

### 1.4. Những gì nhóm đã làm được trong tuần 1 (Vượt tiến độ)
- **Hoàn thiện 100% chức năng Frontend và Backend cốt lõi:** Người dùng có thể thực hiện trọn vẹn vòng đời mua sắm từ xem sản phẩm, tìm kiếm giọng nói, so sánh, giỏ hàng, tạo đơn hàng đến thanh toán VietQR và chat hỗ trợ.
- **Chất lượng mã nguồn được kiểm chứng tuyệt đối:**
  - Đạt **158/158 bài kiểm thử tự động (Vitest) Passed 100%**.
  - Đạt **22/22 kịch bản E2E thực tế & chống tấn công bảo mật Passed 100%**.
  - **119/119 tệp nguồn** vượt qua kiểm tra cú pháp và quy tắc an toàn lint.

---

# PHẦN 2: KỊCH BẢN TRÌNH DIỄN DEMO LIVE FULL WEB
*(Mở trình duyệt truy cập: `http://localhost:5173/`, Backend chạy tại cổng `5000`)*

```
Tài khoản Admin kiểm thử:  admin     /  123456
Tài khoản Khách hàng:      (đăng ký mới hoặc bấm đăng nhập)
```

---

## 🎬 MÀN 1: TRANG CHỦ & CÁC TÍNH NĂNG TƯƠNG TÁC ĐẶC BIỆT
*(Người trình bày: **Nguyễn Tiến Vương**)*

- **Hành động 1:** Mở trang chủ `http://localhost:5173/`.
  - **Lời thoại:** *"Thưa cô, đây là giao diện Trang chủ của SmartDesk. Nhóm thiết kế theo phong cách hiện đại, thanh lịch với 2 dải banner cờ vải truyền thống tạo điểm nhấn thương hiệu. Trang chủ tích hợp thanh điều hướng thông minh, danh mục ngành hàng nổi bật và danh sách sản phẩm mới về, bán chạy."*
- **Hành động 2:** Thao tác nút **Tìm kiếm bằng giọng nói** trên thanh Header.
  - **Bấm vào biểu tượng Micro 🎙️** và nói rõ: *"Bút bi"* hoặc *"Giấy Double A"*.
  - **Lời thoại:** *"Điểm đặc biệt đầu tiên là nhóm đã tích hợp Web Speech API. Người dùng chỉ cần bấm micro và nói bằng tiếng Việt, hệ thống tự động nhận diện từ khóa và chuyển ngay đến kết quả tìm kiếm mà không cần gõ bàn phím."*
- **Hành động 3:** Thao tác lưu **Danh sách yêu thích (Wishlist)**.
  - Bấm nút hình trái tim ❤️ trên 2 sản phẩm bất kỳ.
  - Bấm vào biểu tượng **Yêu thích** trên Header (hiển thị badge đỏ `2`).
  - **Lời thoại:** *"Khách hàng có thể lưu lại những món đồ mình quan tâm vào Wishlist. Khi bấm vào danh sách, khách hàng có thể xem nhanh giá, tình trạng tồn kho hoặc chuyển ngay vào giỏ hàng."*
- **Hành động 4:** Thao tác **So sánh sản phẩm (Compare Matrix)**.
  - Bấm nút **"So sánh"** trên 2 - 3 sản phẩm khác nhau (ví dụ: Bút bi Thiên Long và Bút gel Pilot).
  - Chỉ vào thanh công cụ nổi **Floating Compare Bar** ở góc dưới màn hình.
  - Bấm **"So sánh ngay"** để mở modal `ModalSoSanh`.
  - **Lời thoại:** *"Đây là tính năng độc đáo giúp khách hàng đối chiếu chi tiết 2 đến 3 sản phẩm cùng loại: từ hình ảnh, giá gốc, giá khuyến mãi, thương hiệu cho đến tình trạng tồn kho. Nhóm đã cố định khung hình chuẩn 100x100px chống méo vỡ giao diện và có cơ chế ảnh dự phòng an toàn."*
- **Hành động 5:** Giới thiệu **Linh vật Trợ lý Robot Mascot 3D & Chatbot**.
  - Chỉ vào Robot 3D đang chuyển động ở góc phải màn hình.
  - **Lời thoại:** *"Ở góc phải màn hình là Robot Mascot 3D đại diện cho SmartDesk, được dựng hoàn toàn bằng CSS 3D và SVG. Robot có chu trình cử động tự nhiên: lơ lửng, nhún nhảy co chân và chạy bộ, cùng mắt LED đổi cảm xúc. Khi bấm vào, khung Chatbot AI sẽ mở ra giúp trả lời chính sách, gợi ý sản phẩm và có nút Tạo ticket để chat trực tiếp với Admin."*

---

## 🎬 MÀN 2: CHI TIẾT SẢN PHẨM, GIỎ HÀNG & THANH TOÁN VIETQR
*(Người trình bày: **Vũ Thị Vân**)*

- **Hành động 1:** Bấm vào một sản phẩm để vào **Trang chi tiết sản phẩm**.
  - Lướt xem ảnh phóng to, thông tin giá, mô tả, tồn kho.
  - Lướt xuống mục Đánh giá nhận xét & form gửi số sao (1-5 sao).
  - **Lời thoại:** *"Tại trang chi tiết, khách hàng có thể xem đầy đủ thông tin, phóng to hình ảnh và xem các phản hồi chân thực từ những người mua trước. Điểm đánh giá trung bình được tính toán tự động từ CSDL."*
- **Hành động 2:** Chọn số lượng là `2` và bấm **"Thêm vào giỏ hàng"**.
  - Bấm vào biểu tượng Giỏ hàng trên thanh Header để chuyển đến `trang_gio_hang.jsx`.
  - **Lời thoại:** *"Dữ liệu giỏ hàng được đồng bộ mượt mà. Khách hàng có thể tăng giảm số lượng, xóa từng món hoặc làm trống giỏ hàng. Tổng tiền hàng được tính toán chính xác theo thời gian thực."*
- **Hành động 3:** Thử nghiệm **Mã giảm giá (Voucher)**.
  - Nhập mã voucher: `WELCOME10` và bấm Áp dụng.
  - Chỉ vào dòng Chiết khấu giảm 10% được trừ trực tiếp vào tổng thanh toán.
  - **Lời thoại:** *"Hệ thống hỗ trợ áp dụng mã giảm giá được cấu hình từ bảng `ma_giam_gia` với điều kiện giá trị đơn hàng tối thiểu chặt chẽ."*
- **Hành động 4:** Điền thông tin đặt hàng & chọn phương thức **Chuyển khoản VietQR**.
  - Điền Họ tên: *"Vũ Thị Vân"*, Số điện thoại: *"0987654321"*, Địa chỉ: *"Hà Đông, Hà Nội"*.
  - Chọn hình thức: **Chuyển khoản ngân hàng (VietQR)**.
  - Bấm **"Xác nhận đặt hàng"**.
  - **Lời thoại:** *"Khi chọn chuyển khoản, hệ thống hiển thị mã VietQR chuẩn Napas 247 kèm tên tài khoản, ngân hàng và nội dung chuyển khoản tự động gắn mã đơn hàng. Đơn hàng được tạo thành công với mã định danh duy nhất và số lượng tồn kho trong CSDL SQLite được trừ tự động ngay lập tức."*

---

## 🎬 MÀN 3: PHÂN HỆ QUẢN TRỊ VIÊN (ADMIN DASHBOARD) & KIỂM THỬ
*(Người trình bày: **Trần Việt Quang**)*

- **Hành động 1:** Đăng nhập vào trang Quản trị.
  - Bấm vào Đăng nhập trên Header -> Nhập tài khoản: `admin`, mật khẩu: `123456`.
  - Chuyển vào trang `Admin Dashboard`.
  - **Lời thoại:** *"Em xin phép trình bày phân hệ Quản trị viên của SmartDesk. Hệ thống được bảo vệ bằng cơ chế phân quyền RBAC (Role-Based Access Control) nghiêm ngặt."*
- **Hành động 2:** Trình bày **Tab Tổng quan (KPIs)**.
  - Chỉ vào các thẻ số liệu: Doanh thu thực tế, Tổng đơn hàng, Số khách hàng, và Cảnh báo hàng tồn kho.
  - **Lời thoại:** *"Tại đây, quản trị viên có cái nhìn toàn cảnh về tình hình kinh doanh, biểu đồ tăng trưởng và danh sách sản phẩm bán chạy nhất."*
- **Hành động 3:** Demo tính năng **Thêm mới sản phẩm có tải ảnh trực tiếp từ máy tính (File Picker)**.
  - Chuyển sang tab **"Sản phẩm"** -> Bấm nút **"+ Thêm sản phẩm mới"**.
  - Điền tên: *"Bút ký cao cấp SmartDesk Pro"*, Giá: `150000`, Tồn kho: `50`.
  - Chọn tùy chọn tải ảnh: **"Tải ảnh từ máy tính"** -> Bấm chọn một file ảnh trên máy.
  - Khung **Xem trước ảnh (Preview)** lập tức hiển thị ảnh sắc nét.
  - Bấm **"Lưu sản phẩm"**.
  - **Lời thoại:** *"Để giải quyết bất tiện khi thêm sản phẩm mà không có ảnh, nhóm đã tích hợp FileReader API chuyển đổi file ảnh từ máy tính thành mã Base64 lưu trực tiếp vào CSDL. Sản phẩm vừa tạo lập tức xuất hiện trong danh sách kèm ảnh đại diện thumbnail rõ ràng."*
- **Hành động 4:** Demo tính năng **Chỉnh sửa sản phẩm có sẵn**.
  - Bấm nút **"Sửa"** tại sản phẩm vừa tạo.
  - Thay đổi giá bán hoặc tên sản phẩm -> Bấm **"Cập nhật"**.
  - **Lời thoại:** *"Admin có thể linh hoạt cập nhật giá bán, số lượng tồn kho hoặc đổi ảnh sản phẩm mà không cần can thiệp vào cơ sở dữ liệu."*
- **Hành động 5:** Demo **Quản lý Đơn hàng & Chăm sóc khách hàng (Ticket CSKH)**.
  - Chuyển sang tab **"Đơn hàng"**: Thấy đơn hàng vừa được bạn Vân đặt ở Màn 2. Bấm chuyển trạng thái từ *"Chờ xác nhận"* sang *"Đang xử lý"*.
  - Chuyển sang tab **"Hỗ trợ khách hàng"**: Xem danh sách các yêu cầu trợ giúp và mở hộp chat để trả lời khách hàng.
- **Hành động 6:** Báo cáo về **Chất lượng mã nguồn & Kiểm thử tự động (Vitest)**.
  - Trình chiếu kết quả kiểm thử: **24 test suites, 158 tests passed 100%** và **22 kịch bản bảo mật E2E**.
  - **Lời thoại:** *"Toàn bộ hệ thống từ tầng dữ liệu, API controller đến các component React đều được nhóm viết bộ kiểm thử tự động với Vitest và script kiểm tra bảo mật (chống IDOR, kiểm soát số lượng tồn kho nguyên tử, xác thực JWT). Điều này giúp hệ thống đạt độ tin cậy tuyệt đối ngay từ tuần đầu tiên."*

---

# PHẦN 3: KẾT LUẬN & KẾ HOẠCH TUẦN TIẾP THEO
*(Nguyễn Tiến Vương tổng kết)*

> *"Thưa cô, chỉ trong tuần 1, nhóm 3 đã biến ý tưởng đề tài thành một sản phẩm thực tế hoạt động trơn tru 100%.  
> Kế hoạch trong các tuần tiếp theo của nhóm bao gồm:  
> 1. Tiếp thu và hoàn thiện các góp ý của cô trong buổi báo cáo hôm nay.  
> 2. Nâng cấp Chatbot thông minh hơn bằng cách tích hợp trực tiếp API Gemini / OpenAI.  
> 3. Tích hợp cổng thanh toán trực tuyến tự động (VNPay / MoMo Sandbox).  
> 4. Bổ sung tính năng gửi email xác nhận đơn hàng tự động và hoàn thiện báo cáo bản Word/PDF hoàn chỉnh.  
>  
> Chúng em xin chân thành cảm ơn cô và rất mong nhận được những nhận xét, định hướng quý báu từ cô ạ!"*

---

# 🎯 BỘ CÂU HỎI PHẢN BIỆN THƯỜNG GẶP CỦA GIẢNG VIÊN & GỢI Ý TRẢ LỜI

### ❓ Câu 1: "Mới tuần 1 sao các em đã làm được nhiều như thế này? Có phải dùng template có sẵn không?"
- **Trả lời:** *"Dạ thưa cô, toàn bộ mã nguồn của nhóm được xây dựng từ đầu (scratch) bằng ReactJS kết hợp Vite và Node.js Express. Nhóm đã tự viết CSS thuần trong file `styles.css` chứ không dùng các UI kit có sẵn như Ant Design hay Bootstrap để hiểu sâu về kiến trúc web. Nhóm đã phân công rõ ràng cho 3 thành viên: bạn Vương phụ trách phân hệ Cửa hàng & Voice Search, bạn Vân làm Giỏ hàng & Đặt hàng, bạn Quang làm Admin & Kiểm thử tự động. Nhóm cũng đã viết 158 bài unit test tự động bằng Vitest để chứng minh từng hàm và component đều do nhóm tự phát triển và kiểm soát 100% ạ."*

### ❓ Câu 2: "Tại sao nhóm lại dùng SQLite mà không dùng MySQL hay SQL Server?"
- **Trả lời:** *"Dạ thưa cô, SQLite là một hệ quản trị CSDL quan hệ chuẩn SQL (hỗ trợ đầy đủ khóa ngoại, Transaction, ACID). Với quy mô đồ án Thực tập cơ sở, SQLite lưu toàn bộ dữ liệu vào một file `csdl.sqlite` gọn nhẹ, giúp toàn bộ các thành viên trong nhóm có thể đồng bộ code qua Git và chạy ngay trên localhost mà không cần mất công cài đặt hoặc cấu hình dịch vụ máy chủ CSDL phức tạp. Đồng thời, cấu trúc bảng đã được nhóm chuẩn hóa ở dạng chuẩn 3NF, nên nếu muốn chuyển đổi sang PostgreSQL hay MySQL trên môi trường production thì chỉ cần thay đổi connection string của ORM/Driver là xong ạ."*

### ❓ Câu 3: "Hình ảnh sản phẩm các em lưu trữ thế nào khi người dùng tải ảnh từ máy tính lên?"
- **Trả lời:** *"Dạ thưa cô, ở phân hệ Admin, nhóm hỗ trợ 3 cách đưa ảnh: nhập URL, chọn ảnh preset và tải file từ máy tính. Khi chọn file từ máy, nhóm sử dụng FileReader API của trình duyệt để đọc và mã hóa file ảnh thành chuỗi Base64 Data URL. Dữ liệu này được gửi qua API và lưu trữ trực tiếp vào trường `anh_chinh` trong CSDL. Cách làm này giúp website chạy hoàn toàn độc lập cục bộ, không cần phải thiết lập máy chủ lưu trữ file (như Cloudinary hay AWS S3) mà vẫn hiển thị ảnh ngay lập tức và xem trước trực quan ạ."*

### ❓ Câu 4: "Nếu 2 khách hàng cùng đặt một sản phẩm mà trong kho chỉ còn 1 cái thì xử lý thế nào?"
- **Trả lời:** *"Dạ thưa cô, trong Controller xử lý đặt hàng (`dieu_khien_don_hang.js`), nhóm đã áp dụng cơ chế Database Transaction kèm kiểm tra số lượng tồn kho nguyên tử (Atomic Check). Khi nhận request, hệ thống sẽ kiểm tra `so_luong_ton >= so_luong_mua`. Nếu hợp lệ, hệ thống mới tiến hành trừ tồn kho và ghi nhận đơn hàng trong cùng một Transaction. Nếu tồn kho không đủ, hệ thống sẽ lập tức trả về lỗi HTTP 400 và Rollback toàn bộ dữ liệu, đảm bảo không bao giờ xảy ra tình trạng bán vượt quá tồn kho ạ."*
