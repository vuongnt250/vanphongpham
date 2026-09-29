BÁO CÁO THỰC TẬP CƠ SỞ
XÂY DỰNG WEBSITE THƯƠNG MẠI ĐIỆN TỬ QUẢN LÝ SẢN PHẨM, GIỎ HÀNG VÀ HỖ TRỢ KHÁCH HÀNG SMARTDESK
BỔ SUNG CHỨC NĂNG CHATBOT VÀ QUẢN TRỊ VIÊN

HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG
KHOA CÔNG NGHỆ THÔNG TIN
Nhóm thực hiện: Nhóm 3
1. Nguyễn Tiến Vương - MSV: B23DVCN183 (Trưởng nhóm)
2. Vũ Thị Vân - MSV: B23DVCN179
3. Trần Việt Quang - MSV: B23DVCN127

---

1. Giới thiệu đề tài
Đề tài “Xây dựng Website Thương mại điện tử quản lý sản phẩm, giỏ hàng và hỗ trợ khách hàng SmartDesk” tập trung nghiên cứu và phát triển một website bán hàng trực tuyến nhằm phục vụ nhu cầu mua sắm văn phòng phẩm, dụng cụ học tập và thiết bị làm việc cho học sinh, sinh viên và nhân viên văn phòng.
Hệ thống được thiết kế với các chức năng cơ bản như hiển thị sản phẩm theo danh mục, lọc theo thương hiệu và khoảng giá, xem chi tiết sản phẩm, tìm kiếm sản phẩm, xem hình ảnh gallery, gửi đánh giá nhận xét và quản lý giỏ hàng.
Bên cạnh đó, để nâng cao trải nghiệm người dùng, nhóm đã xây dựng thêm:
- Chatbot hỗ trợ khách hàng: giúp người dùng tìm kiếm sản phẩm nhanh, trả lời các câu hỏi thường gặp về chính sách mua hàng, và có nút tạo ticket hỗ trợ để nhắn tin trực tiếp với quản trị viên.
- Trang Quản trị viên (Admin): giúp quản lý danh mục, sản phẩm, đơn hàng, người dùng, mã giảm giá, tồn kho và trả lời ticket hỗ trợ của khách hàng.
Dự án được xây dựng bằng ReactJS ở phía frontend, Node.js (Express) ở phía backend và cơ sở dữ liệu SQLite, mã nguồn được chia thành các thư mục rõ ràng, dễ chạy thử nghiệm và phát triển.

2. Mục tiêu của đề tài
Đề tài đặt ra các mục tiêu cụ thể như sau:
- Xây dựng một website bán hàng có giao diện thân thiện, dễ sử dụng cho người mua.
- Cho phép khách hàng tìm kiếm, lọc sản phẩm theo nhiều tiêu chí, xem chi tiết và thêm vào giỏ hàng.
- Thực hiện được chức năng đặt hàng, áp dụng mã giảm giá và chọn phương thức thanh toán.
- Quản lý dữ liệu sản phẩm, danh mục, đơn hàng, đánh giá và tồn kho trên hệ thống.
- Cung cấp chatbot hỗ trợ giải đáp thắc mắc và gửi yêu cầu hỗ trợ trực tiếp đến admin.
- Cung cấp giao diện quản trị cho admin để theo dõi đơn hàng, quản lý kho và chăm sóc khách hàng.
- Rèn luyện kỹ năng lập trình web full-stack, làm việc nhóm và kiểm thử website chạy trực tiếp trên môi trường localhost.

3. Đối tượng và phạm vi nghiên cứu
3.1 Đối tượng nghiên cứu
Đối tượng nghiên cứu của đề tài là website thương mại điện tử SmartDesk, phục vụ cho việc:
- Trưng bày và quản lý sản phẩm văn phòng phẩm, thiết bị học tập.
- Tìm kiếm, lọc và phân loại sản phẩm.
- Quản lý giỏ hàng và đặt hàng trực tuyến.
- Đánh giá sản phẩm và phản hồi của khách hàng.
- Trợ lý chatbot hỗ trợ khách hàng và tạo ticket liên hệ.
- Bảng điều khiển quản trị viên quản lý bán hàng.
3.2 Phạm vi nghiên cứu
Phạm vi của đề tài gồm các trang và chức năng chính:
- Trang chủ (hiển thị banner, danh mục, sản phẩm bán chạy, sản phẩm mới).
- Trang cửa hàng (danh sách sản phẩm, bộ lọc, sắp xếp, tìm kiếm).
- Trang chi tiết sản phẩm (thông tin, hình ảnh, chọn số lượng, đánh giá nhận xét).
- Giỏ hàng và Đặt hàng (thêm/xóa sản phẩm, nhập mã giảm giá, thông tin nhận hàng, thanh toán COD / chuyển khoản).
- Đăng nhập, đăng ký tài khoản người dùng.
- Chatbot hỗ trợ khách hàng và phòng chat ticket hỗ trợ với admin.
- Trang quản trị (Admin Dashboard) với các phân hệ quản lý sản phẩm, danh mục, đơn hàng, khách hàng, tồn kho, voucher và ticket CSKH.

4. Cấu trúc và mô tả hệ thống
4.1 Giao diện người dùng (Frontend)
Frontend được xây dựng bằng ReactJS kết hợp công cụ Vite để khởi chạy máy chủ phát triển nhanh chóng trên cổng 5173. Giao diện được nhóm tự viết CSS trong file styles.css theo phong cách hiện đại, gọn gàng và tương thích với nhiều kích thước màn hình. Các trang và thành phần chính gồm:
- Trang chủ (trang_chu.jsx): banner chào mừng, danh mục nổi bật, sản phẩm mới, sản phẩm bán chạy.
- Trang cửa hàng (trang_cua_hang.jsx): danh sách sản phẩm, bộ lọc theo danh mục, giá, thương hiệu và ô tìm kiếm.
- Trang chi tiết sản phẩm (trang_chi_tiet_san_pham.jsx): xem ảnh phóng to, thông tin giá, mô tả sản phẩm, tồn kho và đánh giá sao.
- Trang giỏ hàng & Đặt hàng (trang_gio_hang.jsx): cập nhật số lượng, áp mã voucher, điền địa chỉ giao hàng và đặt hàng.
- Trang đăng nhập, đăng ký (dang_nhap_dang_ky.jsx): xác thực tài khoản người dùng.
- Trang quản trị (admin_dashboard.jsx): giao diện dành riêng cho admin quản lý toàn bộ hệ thống (danh mục, sản phẩm, đơn hàng, kho, voucher, ticket CSKH).
- Trợ lý Robot Mascot 3D sống động (robot_tro_ly_3d.jsx): linh vật robot 3D tương tác với vòm đầu kén cao công nghệ, mắt LED đa cảm xúc (mặc định, vui vẻ, tức giận/cảnh báo kèm tia sét và rung lắc) và chu trình cử động tự động ngẫu nhiên (lơ lửng, nhún nhảy co chân, chạy bộ).
- Bóng chat hỗ trợ (bong_chat_ai.jsx): widget nổi ở góc màn hình gắn kèm linh vật robot 3D để chat với bot và gửi ticket cho admin.
- Danh sách yêu thích (modal_wishlist.jsx): bảng danh sách sản phẩm yêu thích (Wishlist) lưu trữ cá nhân hóa.
- Hệ thống so sánh sản phẩm trực quan (modal_so_sanh.jsx & thanh_so_sanh_noi.jsx): ma trận đối chiếu 2-3 sản phẩm cùng loại kèm thanh floating bar tiện lợi, cố định khung ảnh chuẩn 100x100px chống vỡ layout.
- Tiện ích tìm kiếm bằng giọng nói (tro_ly_giong_noi.js): tích hợp Web Speech API nhận diện giọng nói tiếng Việt tức thì.
4.2 Cơ sở dữ liệu
Hệ thống sử dụng SQLite để lưu trữ dữ liệu cục bộ gọn nhẹ vào file csdl.sqlite, dễ dàng sao chép và quản lý dữ liệu bằng phần mềm DB Browser for SQLite hoặc extension SQLite Viewer trong VS Code. Các bảng chính gồm:
- san_pham: lưu mã, tên, giá bán, giá gốc, số lượng tồn kho, thương hiệu, mô tả, ảnh chính, trạng thái kinh doanh.
- danh_muc: lưu các danh mục sản phẩm.
- hinh_anh_san_pham: lưu các hình ảnh chi tiết của sản phẩm.
- danh_gia: lưu số sao và nhận xét của khách hàng.
- nguoi_dung: lưu thông tin tài khoản, mật khẩu đã mã hóa và vai trò (admin, khách hàng).
- gio_hang và chi_tiet_gio_hang: lưu các món hàng khách đã thêm vào giỏ.
- don_hang và chi_tiet_don_hang: lưu thông tin đặt hàng, người nhận, tổng tiền và trạng thái đơn hàng.
- ma_giam_gia: lưu mã voucher khuyến mãi.
- nhat_ky_kho: lưu lịch sử nhập xuất hàng.
- ticket_ho_tro và tin_nhan_ticket: lưu các yêu cầu hỗ trợ và tin nhắn trao đổi giữa khách với admin.
4.3 Backend và API
Backend được viết bằng Node.js và Express.js, chạy trên cổng 5000, cung cấp các API theo chuẩn RESTful:
- API sản phẩm và danh mục: lấy danh sách, chi tiết, tìm kiếm và lọc sản phẩm.
- API giỏ hàng và đơn hàng: thêm món vào giỏ, tạo đơn đặt hàng, kiểm tra tồn kho.
- API đánh giá: gửi đánh giá và lấy danh sách nhận xét của sản phẩm.
- API người dùng: đăng ký, đăng nhập, cấp token xác thực JWT.
- API admin: thêm, sửa toàn diện (thông tin, giá, ảnh, tồn kho), xóa sản phẩm, quản lý danh mục, cập nhật trạng thái đơn hàng, xem thống kê.
- API chatbot và ticket: xử lý câu hỏi của bot, gửi và nhận tin nhắn hỗ trợ.
4.4 Chatbot và Trợ lý Robot Mascot 3D
Hệ thống hỗ trợ khách hàng được nâng cấp với trải nghiệm trực quan vượt bậc:
- Linh vật Robot 3D sống động: thiết kế thuần bằng CSS Transform/Perspective & SVG, đầu vòm kén cao, hiệu ứng mắt LED biến đổi linh hoạt (mắt xanh dịu mắt, mắt cười tít vui vẻ, mắt đỏ sắc lẹm tức giận kèm phóng điện) và hành động tự nhiên ngẫu nhiên (nhảy co chân, chạy bộ, lơ lửng).
- Trả lời nhanh các câu hỏi về sản phẩm, giá bán, phí giao hàng, chính sách đổi trả, bảo hành.
- Gợi ý sản phẩm phù hợp kèm thẻ xem nhanh và nút thêm vào giỏ hàng ngay trong khung chat.
- Hỗ trợ tạo ticket: khi khách hàng cần gặp nhân viên, có thể điền tiêu đề và nội dung để tạo ticket.
- Chat trực tiếp với admin: khách hàng có thể theo dõi danh sách các ticket của mình và nhắn tin trực tiếp với admin ngay trong khung chat.
4.5 Quản trị viên (Admin Dashboard)
Trang quản trị cho phép admin:
- Xem tổng quan các chỉ số: doanh thu thực tế, số lượng đơn hàng, số khách hàng, cảnh báo sản phẩm sắp hết hàng.
- Quản lý sản phẩm toàn diện: hiển thị cột hình ảnh trực quan trong danh sách, thêm mới sản phẩm hỗ trợ tải ảnh từ máy tính (FileReader Base64), nhập link URL hoặc chọn ảnh mẫu preset; hỗ trợ form chỉnh sửa sản phẩm có sẵn (cập nhật tên, giá bán, giá gốc, tồn kho, đơn vị, trạng thái, ảnh).
- Quản lý danh mục: thêm và sửa danh mục sản phẩm.
- Quản lý đơn hàng: xem chi tiết người mua, duyệt trạng thái đơn hàng (chờ xác nhận, đang xử lý, đang giao, đã giao, hủy đơn).
- Quản lý tồn kho: theo dõi lịch sử nhập hàng và điều chỉnh số lượng tồn.
- Quản lý mã giảm giá: tạo voucher khuyến mãi.
- Hỗ trợ khách hàng: tiếp nhận ticket của khách, trả lời tin nhắn và đổi trạng thái ticket.

5. Yêu cầu chức năng
5.1 Yêu cầu phía người dùng (Khách hàng)
- Xem danh sách sản phẩm, phân trang và tìm kiếm theo tên, giọng nói tiếng Việt.
- Lọc sản phẩm theo khoảng giá, danh mục và thương hiệu.
- Xem thông tin chi tiết sản phẩm, thư viện ảnh và đánh giá sao.
- Lưu trữ danh sách sản phẩm yêu thích (Wishlist) và mở xem nhanh.
- So sánh đối chiếu 2-3 sản phẩm trên thanh công cụ nổi (Floating bar) và ma trận so sánh cố định khung ảnh.
- Thêm sản phẩm vào giỏ hàng, tăng giảm số lượng, xóa sản phẩm.
- Nhập mã voucher giảm giá khi thanh toán.
- Đặt hàng với thông tin người nhận và chọn hình thức thanh toán (COD hoặc chuyển khoản ngân hàng qua mã VietQR).
- Đăng ký, đăng nhập tài khoản an toàn.
- Gửi đánh giá sao và nhận xét cho sản phẩm.
- Tương tác với trợ lý Robot 3D, trò chuyện với chatbot và gửi ticket yêu cầu hỗ trợ.
5.2 Yêu cầu phía quản trị viên (Admin)
- Đăng nhập tài khoản admin để vào trang quản trị bảo mật.
- Theo dõi thống kê doanh thu, đơn hàng, khách hàng và hàng tồn.
- Quản lý danh sách sản phẩm có hiển thị ảnh thu nhỏ, thêm mới sản phẩm với cơ chế upload ảnh file Base64 từ máy tính hoặc link URL hoặc ảnh mẫu có sẵn kèm xem trước trực tiếp.
- Chỉnh sửa linh hoạt thông tin sản phẩm đã có (tên, giá bán, giá gốc, tồn kho, đơn vị, ảnh đại diện, trạng thái).
- Xóa sản phẩm và cập nhật danh mục hàng hóa.
- Xem và chuyển trạng thái đơn hàng trực tiếp.
- Tạo và quản lý mã giảm giá.
- Quản lý tài khoản khách hàng.
- Trả lời tin nhắn hỗ trợ của khách hàng theo từng ticket.
5.3 Yêu cầu phi chức năng và kỹ thuật
- Giao diện hiển thị rõ ràng, mượt mà trên máy tính và điện thoại.
- Tốc độ tải trang nhanh, không bị tải lại toàn bộ trang khi lọc hay tìm kiếm.
- Khung ảnh sản phẩm trên toàn hệ thống (cửa hàng, chi tiết, bảng so sánh, admin) được cố định tỷ lệ, chống vỡ giao diện và có ảnh fallback tự động.
- Dữ liệu giỏ hàng, danh sách so sánh, yêu thích và ticket được duy trì nhất quán.
- Mật khẩu tài khoản được mã hóa an toàn bằng Bcrypt, không lưu văn bản thô.
- Đạt độ bao phủ kiểm thử cao, vượt qua toàn bộ 152 bài kiểm thử tự động với Vitest.

6. Kiến trúc công nghệ và tổ chức mã nguồn
Hệ thống được tổ chức theo mô hình rõ ràng:
- Frontend: ReactJS (React 18), Vite, CSS thuần (styles.css).
- Backend: Node.js, Express framework.
- Cơ sở dữ liệu: SQLite.
- Môi trường chạy thử nghiệm: Node server chạy cổng localhost:5000, Vite dev server chạy cổng localhost:5173.
- Công cụ kiểm thử tự động: Vitest (kiểm thử đơn vị và tích hợp toàn diện 152/152 test case).
- Công cụ kiểm tra API: Postman.
- Công cụ xem dữ liệu: SQLite Viewer / DB Browser for SQLite.
Cấu trúc các thư mục chính trong dự án:
- giao_dien/: chứa toàn bộ mã nguồn giao diện React.
  - giao_dien/trang/: các màn hình chính như trang_chu.jsx, trang_cua_hang.jsx, trang_chi_tiet_san_pham.jsx, trang_gio_hang.jsx, dang_nhap_dang_ky.jsx, admin_dashboard.jsx.
  - giao_dien/thanh_phan/: các thành phần tái sử dụng như the_san_pham.jsx, loc_san_pham.jsx, danh_gia_san_pham.jsx, bong_chat_ai.jsx, robot_tro_ly_3d.jsx, thanh_so_sanh_noi.jsx, modal_so_sanh.jsx, modal_wishlist.jsx, banner_la_vai.jsx, dau_trang.jsx, chan_trang.jsx.
  - giao_dien/dich_vu_api.js: file xử lý gọi API backend bằng fetch.
  - giao_dien/styles.css: file định dạng giao diện toàn bộ trang web.
- may_chu/: chứa mã nguồn backend server.
  - may_chu/app.js: khởi tạo server Express và cấu hình các tuyến đường.
  - may_chu/dieu_khien/: các file controller xử lý nghiệp vụ cho từng phân hệ (dieu_khien_san_pham.js, them_san_pham.js, sua_san_pham.js, dieu_khien_don_hang.js, dieu_khien_admin.js, dieu_khien_ai.js, dieu_khien_ticket.js).
  - may_chu/duong_dan/: định tuyến các API cho sản phẩm, đơn hàng, người dùng, ticket.
- co_so_du_lieu/: chứa cấu trúc bảng SQL, dữ liệu mẫu và các hàm truy vấn dữ liệu (mo_hinh/).

7. Thiết kế dữ liệu
Dữ liệu của hệ thống được tổ chức thành các bảng liên kết với nhau trong file csdl.sqlite:
- Bảng san_pham: id, ten_san_pham, danh_muc_id, gia, gia_goc, so_luong_ton, thuong_hieu, anh_chinh, mo_ta, da_ban.
- Bảng danh_muc: id, ten_danh_muc, bieu_tuong, mo_ta.
- Bảng hinh_anh_san_pham: id, san_pham_id, duong_dan_anh.
- Bảng danh_gia: id, san_pham_id, nguoi_dung_id, ten_nguoi_danh_gia, so_sao, nhan_xet, ngay_tao.
- Bảng nguoi_dung: id, ten_dang_nhap, mat_khau, ho_ten, email, so_dien_thoai, vai_tro.
- Bảng gio_hang và chi_tiet_gio_hang: quan hệ 1-n giữa giỏ hàng và các sản phẩm trong giỏ.
- Bảng don_hang và chi_tiet_don_hang: lưu thông tin đặt hàng, tổng tiền, địa chỉ giao và danh sách mặt hàng đã mua.
- Bảng ma_giam_gia: ma_voucher, loai_giam, gia_tri_giam, don_hang_toi_thieu.
- Bảng ticket_ho_tro và tin_nhan_ticket: lưu yêu cầu hỗ trợ và các tin nhắn chat qua lại giữa khách và admin.

8. Mô tả các trang chính của website
8.1 Trang chủ (trang_chu.jsx)
- Hiển thị banner đón chào có hiệu ứng lá vải trang trí ở hai bên trang web.
- Hiển thị thanh danh mục nổi bật để khách bấm lọc nhanh.
- Hiển thị các khối sản phẩm mới về và sản phẩm bán chạy.
- Khối thông tin cam kết (chính hãng, đổi trả, giao hàng nhanh).
8.2 Trang cửa hàng (trang_cua_hang.jsx)
- Hiển thị danh sách toàn bộ sản phẩm dạng lưới thẻ.
- Bộ lọc bên trái: lọc theo danh mục, khoảng giá, thương hiệu.
- Sắp xếp sản phẩm theo giá tăng/giảm, bán chạy, mới nhất.
- Ô tìm kiếm sản phẩm theo từ khóa trực tiếp.
8.3 Trang chi tiết sản phẩm (trang_chi_tiet_san_pham.jsx)
- Xem ảnh sản phẩm lớn và các ảnh phụ trong thư viện ảnh.
- Xem giá bán, giá gốc, số lượng còn trong kho và mô tả chi tiết.
- Chọn số lượng và bấm nút "Thêm vào giỏ hàng" hoặc "Mua ngay".
- Xem danh sách đánh giá nhận xét và gửi nhận xét mới.
8.4 Giỏ hàng và Thanh toán (trang_gio_hang.jsx)
- Bảng danh sách các sản phẩm đang có trong giỏ hàng.
- Nút tăng/giảm số lượng và nút xóa sản phẩm.
- Ô nhập mã voucher giảm giá.
- Form nhập thông tin nhận hàng (họ tên, số điện thoại, địa chỉ).
- Chọn phương thức thanh toán (COD hoặc chuyển khoản ngân hàng qua mã VietQR).
- Bấm đặt hàng và nhận thông báo tạo đơn thành công kèm mã đơn hàng.
8.5 Chatbot hỗ trợ và Linh vật Trợ lý Robot 3D (bong_chat_ai.jsx & robot_tro_ly_3d.jsx)
- Tích hợp linh vật Robot Mascot 3D sống động ngự trên bóng chat ở góc phải màn hình, mang lại cảm giác thân thiện và công nghệ cao.
- Robot 3D được thiết kế hoàn toàn bằng CSS 3D transform và vector SVG, đảm bảo kích thước nhẹ và hiệu năng mượt mà 60fps.
- Đầu vòm kén cao công nghệ được uốn cong tỷ lệ chuẩn thẩm mỹ, kết hợp hiệu ứng đổ bóng đa tầng và viền phát sáng cyan tinh tế.
- Mắt LED điện tử đa sắc thái cảm xúc:
  + Trạng thái bình thường: đôi mắt LED xanh ngọc viên nhộng phát sáng nhẹ nhàng.
  + Trạng thái vui vẻ: đôi mắt cong hình trăng khuyết cười tít mắt tỏa sáng rạng rỡ khi tương tác hoặc tìm kiếm thành công.
  + Trạng thái tức giận / cảnh báo: vát xéo góc nhọn sắc nét, chuyển sang sắc đỏ cảnh báo (red LED alert) đi kèm hiệu ứng phóng tia sét năng lượng và rung lắc cơ thể (shake vibration).
- Chu trình hành động tự động ngẫu nhiên (Autonomous Behavior Cycle): Robot tự động luân phiên giữa 3 hành động: lơ lửng bồng bềnh (idle), nhún mình bật nhảy và co gập chân lên không trung (nhay_nhay), và nghiêng người chạy bộ guồng chân nhịp nhàng (chay_bo).
- Hỗ trợ giải đáp thắc mắc về sản phẩm, cách đặt hàng, chính sách đổi trả, bảo hành, hóa đơn VAT.
- Tự động gợi ý thẻ sản phẩm trực quan có thể bấm xem chi tiết hoặc thêm giỏ hàng ngay trong đoạn chat.
- Nút "Chat Admin": cho phép người dùng tạo ticket để gửi câu hỏi trực tiếp cho quản trị viên và theo dõi danh sách các ticket phản hồi của mình.
8.6 Trang Quản trị viên (admin_dashboard.jsx)
- Tab Tổng quan: theo dõi các số liệu thống kê doanh thu, đơn hàng, khách hàng, biểu đồ và danh sách sản phẩm bán chạy, sản phẩm sắp hết hàng.
- Tab Sản phẩm (Quản lý Sản phẩm toàn diện):
  + Bảng danh sách sản phẩm trực quan: hiển thị thêm cột ảnh đại diện (avatar thumbnail), tên sản phẩm, danh mục, giá bán lẻ, giá gốc, tồn kho và nhãn trạng thái (Đang bán / Tạm dừng).
  + Cơ chế thêm sản phẩm với 3 phương thức tải ảnh linh hoạt:
    * Tải tệp trực tiếp từ máy tính (File Picker): sử dụng FileReader API chuyển đổi file ảnh sang mã Base64 Data URL, lưu trữ an toàn trong cơ sở dữ liệu mà không cần máy chủ lưu ảnh phụ trợ.
    * Nhập đường link URL ảnh trực tiếp từ internet.
    * Kho ảnh mẫu có sẵn (1-click preset) phân theo danh mục (bút, vở, balo, đèn học, phụ kiện).
    * Khung xem trước ảnh trực tiếp (Live Image Preview) ngay khi chọn tệp hoặc nhập link.
  + Chức năng Chỉnh sửa sản phẩm có sẵn: Modal cập nhật linh hoạt thông tin sản phẩm (tên, danh mục, thương hiệu, giá bán, giá gốc khuyến mãi, số lượng tồn kho, đơn vị tính, trạng thái kinh doanh, mô tả và thay đổi ảnh đại diện mới).
  + Nút xóa sản phẩm với hộp thoại xác nhận an toàn.
- Tab Danh mục: quản lý các danh mục hàng hóa, thêm và sửa thông tin danh mục.
- Tab Đơn hàng: xem thông tin chi tiết người mua, các mặt hàng trong đơn, và cập nhật trạng thái đơn (chờ xác nhận, đang xử lý, đang giao, đã giao, hủy đơn).
- Tab Tồn kho: theo dõi lịch sử nhập/xuất kho và điều chỉnh lượng tồn.
- Tab Voucher: tạo và quản lý mã giảm giá, mức giảm và giá trị đơn hàng áp dụng tối thiểu.
- Tab Hỗ trợ khách hàng: xem danh sách ticket cần xử lý, mở khung chat để nhắn tin trả lời trực tiếp cho khách hàng theo thời gian thực.

8.7 Các tính năng nâng cao trải nghiệm mua sắm (Đặc thù do Thành viên 1 phát triển)
Nhằm tạo điểm nhấn công nghệ và nâng cao trải nghiệm người dùng vượt trội so với các website đồ án thông thường, Thành viên 1 đã nghiên cứu và phát triển 4 tính năng tiện ích nổi bật:
1. Tìm kiếm bằng giọng nói tiếng Việt (Voice Search):
   - Ứng dụng Web Speech API chuẩn trình duyệt (webkitSpeechRecognition) để chuyển đổi giọng nói người dùng thành văn bản theo mã ngôn ngữ tiếng Việt (vi-VN).
   - Tích hợp nút micro ngay trên thanh tìm kiếm của Header và bộ lọc Cửa hàng. Khi người dùng bấm nói (ví dụ: "Bút bi Thiên Long", "Giấy Double A"), hệ thống tự nhận diện và thực hiện tìm kiếm tức thì.
2. Danh sách sản phẩm yêu thích (Wishlist):
   - Cho phép người mua bấm biểu tượng trái tim trên từng thẻ sản phẩm để lưu lại danh sách mặt hàng yêu thích quan tâm.
   - Nút Yêu thích trên Header hiển thị số lượng badge trực quan; khi bấm vào sẽ mở Modal xem nhanh danh sách, cho phép thêm trực tiếp vào giỏ hàng hoặc xóa khỏi danh sách.
3. Hệ thống so sánh sản phẩm trực quan (Product Compare Matrix):
   - Cho phép chọn tối đa 3 sản phẩm cùng lúc để so sánh thông số kỹ thuật, giá bán, giá gốc, mức chiết khấu, thương hiệu và trạng thái còn hàng.
   - Thanh tiện ích nổi thông minh (Floating Compare Bar): ghim cố định ở đáy màn hình với hiệu ứng chuyển động mượt mà, hiển thị thumbnail các sản phẩm đã chọn, slot còn trống, nút "Xóa tất cả" và nút "So sánh ngay".
   - Bảng ma trận so sánh chi tiết (ModalSoSanh): thiết kế dạng bảng đối chiếu trực diện, đóng khung ảnh chuẩn tỷ lệ 100x100px chống méo vỡ giao diện, tích hợp cơ chế onError tự động nạp ảnh dự phòng an toàn, hiển thị huy hiệu giảm giá (discount badge) và nút "Thêm vào giỏ" tức thì.
4. Trợ lý Mascot Robot 3D tương tác sống động (Interactive 3D Mascot Robot):
   - Tích hợp linh vật 3D biểu tượng của SmartDesk với kỹ thuật dựng hình CSS 3D và SVG độc đáo.
   - Thiết kế vòm đầu kén cao công nghệ, ánh sáng neon hiện đại.
   - Hệ thống mắt LED 3 cảm xúc (bình thường, vui vẻ cười tít mắt, tức giận cảnh báo với mắt đỏ rực và phóng điện).
   - Hành vi tự động luân phiên phong phú: nhún nhảy co chân tinh nghịch, chạy bộ tập thể dục và lơ lửng thư thái.

9. Phân tích ưu điểm của hệ thống
- Giao diện thân thiện, hiện đại, phối màu nhẹ nhàng, dễ sử dụng cho học sinh, sinh viên và người mua hàng.
- Đầy đủ các luồng nghiệp vụ kinh doanh hoàn chỉnh từ xem hàng, lọc sản phẩm, giỏ hàng, đặt hàng đến quản lý bán hàng.
- Nổi bật với các tính năng công nghệ hiện đại vượt trội: Linh vật Robot Trợ lý 3D sống động với cử động và biểu cảm phong phú, Tìm kiếm bằng giọng nói tiếng Việt, Danh sách yêu thích (Wishlist), Bảng so sánh sản phẩm đối chiếu trực quan với thanh floating bar.
- Hệ thống quản trị Admin mạnh mẽ: hỗ trợ xem trước ảnh thời gian thực, tải ảnh trực tiếp từ máy tính dạng Base64, và form chỉnh sửa thông tin sản phẩm hoàn chỉnh.
- Có tính năng chatbot tiện lợi giúp giải đáp thắc mắc nhanh và có kênh ticket liên hệ trực tiếp với admin.
- Mã nguồn được phân chia thành các component và controller rõ ràng, dễ đọc, dễ hiểu.
- Chất lượng phần mềm được bảo đảm tuyệt đối với bộ kiểm thử tự động toàn diện (Vitest) đạt 158/158 test case thành công 100%, kết hợp kiểm thử API bằng Postman và kiểm tra trên trình duyệt thực tế.

10. Hạn chế và hướng phát triển
10.1 Hạn chế hiện tại
- Phần thanh toán trực tuyến hiện tại dừng ở mức quét mã VietQR và thanh toán COD, chưa kết nối trực tiếp với cổng thanh toán tự động (như VNPay hoặc MoMo Sandbox qua Webhook).
- Chatbot hiện hoạt động dựa trên kịch bản từ khóa và dữ liệu sản phẩm có sẵn, chưa gọi API trực tiếp từ các mô hình AI lớn như OpenAI hay Gemini do hạn chế về chi phí và tài khoản API.
- Chưa có ứng dụng riêng trên điện thoại di động (mới chỉ hỗ trợ giao diện web responsive).
- Chưa có tính năng gửi email xác nhận đơn hàng tự động đến hòm thư của khách hàng.
10.2 Hướng phát triển
- Tích hợp thêm cổng thanh toán trực tuyến tự động như VNPay hoặc cổng thanh toán nội địa.
- Nâng cấp chatbot thông minh hơn bằng cách kết nối API Gemini / OpenAI để hỗ trợ tư vấn tự nhiên hơn.
- Bổ sung chức năng gửi email thông báo đơn hàng và hóa đơn điện tử cho khách hàng.
- Phát triển thêm phiên bản ứng dụng di động cho khách hàng.

11. Kết quả kiểm thử và Kết luận
11.1 Kết quả kiểm thử hệ thống
Nhóm đã triển khai kiểm thử nghiêm ngặt trên nhiều tầng:
- Kiểm thử tự động (Automated Testing với Vitest): Viết và thực thi 158 bài kiểm thử tự động cho toàn bộ các controller, model cơ sở dữ liệu, dịch vụ API và các component giao diện React (bao gồm cả modal wishlist, giỏ hàng, robot 3D, admin). Kết quả: 158/158 test case đều vượt qua (100% Passed) trong thời gian dưới 2 giây, không có bất kỳ lỗi suy thoái (regression) nào.
- Kiểm thử API (Postman): Kiểm thử đầy đủ các endpoint RESTful cho xác thực người dùng, sản phẩm, giỏ hàng, đơn hàng, mã giảm giá, ticket và quản trị viên. Tất cả đều trả về mã trạng thái HTTP chuẩn (200, 201, 400, 401, 404).
- Kiểm thử chức năng người dùng (Manual UI Testing): Kiểm thử trực tiếp trên trình duyệt Chrome và Edge (localhost:5173 và localhost:5000), đảm bảo hoạt động mượt mà của Robot 3D, tìm kiếm giọng nói, ma trận so sánh, danh sách yêu thích, upload ảnh Base64 và đặt hàng.
11.2 Kết luận
Qua quá trình thực hiện đề tài “Xây dựng Website Thương mại điện tử SmartDesk”, nhóm đã hoàn thành được một website bán hàng văn phòng phẩm toàn diện, hiện đại, đáp ứng xuất sắc các yêu cầu của môn học Thực tập cơ sở.
Hệ thống không chỉ có các chức năng xem và mua hàng thông thường mà còn được bổ sung trợ lý linh vật robot 3D sinh động, chatbot tư vấn, tìm kiếm giọng nói, lưu danh sách yêu thích, bảng so sánh sản phẩm chuẩn kích thước ảnh, hệ thống ticket hỗ trợ trực tiếp và trang quản trị đầy đủ các phân hệ quản lý sản phẩm, đơn hàng, tồn kho kèm upload ảnh và chỉnh sửa linh hoạt.
Quá trình chạy thử nghiệm trên môi trường localhost cùng với việc kiểm tra API bằng Postman và kiểm thử tự động với Vitest giúp các thành viên trong nhóm nâng cao năng lực lập trình full-stack, nắm vững kiến trúc ứng dụng web và quy trình phát triển phần mềm chuyên nghiệp.

---

BẢNG PHÂN CÔNG CÔNG VIỆC CỦA TỪNG THÀNH VIÊN

1. Bảng phân công tổng quát:
- Nguyễn Tiến Vương - B23DVCN183 (Trưởng nhóm):
  + Chức năng: Sản phẩm, Cửa hàng, Tìm kiếm giọng nói, Yêu thích, Hệ thống So sánh & Linh vật Robot Trợ lý 3D
  + Phụ trách kĩ thuật: Quản lý danh mục, tìm kiếm lọc sản phẩm, tích hợp Web Speech API tìm kiếm giọng nói, chức năng Wishlist, xây dựng thanh tiện ích nổi và modal ma trận so sánh sản phẩm, thiết kế linh vật Robot Mascot 3D động với 3 biểu cảm LED và chu trình hành động ngẫu nhiên (nhảy co chân, chạy bộ, lơ lửng), logic Chatbot CSKH, đánh giá sản phẩm.
  + Công cụ chung: VS Code, ReactJS, Node.js, Express, SQLite, Postman, Web Speech API, CSS 3D Transforms & SVG.
- Vũ Thị Vân - B23DVCN179:
  + Chức năng: Tài khoản, Giỏ hàng, Đặt hàng & Khách hàng
  + Phụ trách kĩ thuật: Đăng nhập/đăng ký với JWT và Bcrypt, quản lý giỏ hàng, tính toán đơn hàng, áp mã giảm giá và quy trình đặt hàng thanh toán COD / VietQR.
  + Công cụ chung: VS Code, ReactJS, Node.js, Express, SQLite, JWT, Bcrypt, Postman.
- Trần Việt Quang - B23DVCN127:
  + Chức năng: Admin Dashboard, Quản lý Sản phẩm (Upload ảnh & Sửa sản phẩm), Tồn kho & Kiểm thử tự động Vitest
  + Phụ trách kĩ thuật: Xây dựng giao diện Admin Dashboard, cột hình ảnh trực quan trong danh sách sản phẩm, cơ chế tải ảnh từ máy tính bằng FileReader Base64 và xem trước ảnh trực tiếp, modal chỉnh sửa sản phẩm có sẵn, duyệt đơn hàng, theo dõi tồn kho, thống kê doanh thu; xây dựng và thực thi bộ kiểm thử tự động toàn diện 158 bài test với Vitest.
  + Công cụ chung: VS Code, ReactJS, Node.js, Express, SQLite, Vitest, Postman, DB Browser for SQLite.

2. Bảng phân công chi tiết theo tệp tin mã nguồn:
- Thành viên 1 — Nguyễn Tiến Vương:
  + Module: Sản phẩm, Cửa hàng, Tìm kiếm bằng giọng nói, Wishlist, Hệ thống So sánh & Linh vật Trợ lý Robot 3D
  + Công cụ & Thư viện sử dụng: VS Code, ReactJS, CSS thuần (styles.css), Node.js, Express, SQLite, Web Speech API, CSS 3D & SVG.
  + Frontend: trang_chu.jsx, trang_cua_hang.jsx, trang_chi_tiet_san_pham.jsx, the_san_pham.jsx, loc_san_pham.jsx, tim_kiem_san_pham.jsx, modal_wishlist.jsx, modal_so_sanh.jsx, thanh_so_sanh_noi.jsx, tro_ly_giong_noi.js, robot_tro_ly_3d.jsx, bong_chat_ai.jsx, banner_la_vai.jsx, danh_gia_san_pham.jsx.
  + Backend / API: dieu_khien_san_pham.js, dieu_khien_danh_muc.js, dieu_khien_danh_gia.js, dieu_khien_ai.js, dieu_khien_ticket.js.
  + Database: san_pham, danh_muc, hinh_anh_san_pham, danh_gia, ticket_ho_tro, tin_nhan_ticket.
  + Kiểm thử: kiểm tra thủ công các luồng tìm kiếm giọng nói, wishlist, so sánh sản phẩm, cử động robot 3D, chatbot và gửi ticket trên localhost:5173.
- Thành viên 2 — Vũ Thị Vân:
  + Module: Tài khoản, Giỏ hàng, Đặt hàng & Thanh toán
  + Công cụ & Thư viện sử dụng: VS Code, ReactJS, CSS thuần, Node.js, Express, jsonwebtoken, bcryptjs, Postman.
  + Frontend: dang_nhap_dang_ky.jsx, trang_gio_hang.jsx (giao diện giỏ hàng và form đặt hàng).
  + Backend / API: dieu_khien_xac_thuc.js, dieu_khien_gio_hang.js, dieu_khien_don_hang.js, trung_gian_xac_thuc.js.
  + Database: nguoi_dung, dia_chi, gio_hang, chi_tiet_gio_hang, don_hang, chi_tiet_don_hang, ma_giam_gia.
  + Kiểm thử: kiểm tra các luồng đăng nhập, đăng ký, tính toán giỏ hàng, áp mã giảm giá và đặt hàng trên trình duyệt.
- Thành viên 3 — Trần Việt Quang:
  + Module: Admin Dashboard, Quản lý Sản phẩm (Ảnh Base64 & Sửa sản phẩm), Tồn kho, Thống kê & Bộ kiểm thử tự động Vitest
  + Công cụ & Thư viện sử dụng: VS Code, ReactJS, CSS thuần, Node.js, Express, Postman, SQLite Viewer, Vitest.
  + Frontend: admin_dashboard.jsx, quan_ly_ho_tro_khach_hang.jsx.
  + Backend / API: dieu_khien_admin.js, them_san_pham.js, sua_san_pham.js, các API quản lý đơn, tồn kho, thống kê doanh thu.
  + Database: nhat_ky_kho, nha_cung_cap, banner, cai_dat.
  + Kiểm thử: thiết kế bộ kiểm thử tự động 158 test case với Vitest; kiểm tra các màn hình Admin, upload file ảnh Base64, chỉnh sửa sản phẩm, duyệt đơn, trả lời ticket hỗ trợ; kiểm tra các endpoint API backend bằng Postman và kiểm tra dữ liệu lưu vào file csdl.sqlite.

3. Bảng tổng hợp công cụ dự án SmartDesk:
- Môi trường phát triển (IDE): Visual Studio Code (VS Code).
- Giao diện (Frontend): ReactJS 18, Vite, CSS thuần (styles.css) chạy trên localhost:5173.
- Máy chủ (Backend): Node.js, Express.js, JWT, Bcrypt chạy trên localhost:5000.
- Cơ sở dữ liệu: SQLite (csdl.sqlite).
- Quản lý mã nguồn: Git.
- Kiểm thử và kiểm tra dữ liệu: Vitest (kiểm thử tự động 158/158 tests), Trình duyệt web (Google Chrome, Microsoft Edge), Postman (kiểm thử API), DB Browser for SQLite / SQLite Viewer (xem dữ liệu bảng).

