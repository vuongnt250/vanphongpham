// May chu ung dung Express tong the (TV1 + TV2 + TV3)
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const tao_cau_hinh_cors = require('./trung_gian/cau_hinh_cors');
const { gioi_han_toan_cuc } = require('./trung_gian/gioi_han_truy_cap');
const { xac_thuc_nguoi_dung } = require('./trung_gian/xac_thuc');
const { xu_ly_loi_chung, xu_ly_duong_dan_khong_ton_tai } = require('./trung_gian/xu_ly_loi');

// Routers cua ca 3 thanh vien
const duong_dan_san_pham = require('./duong_dan/duong_dan_san_pham');
const duong_dan_danh_muc = require('./duong_dan/duong_dan_danh_muc');
const duong_dan_hinh_anh = require('./duong_dan/duong_dan_hinh_anh');
const duong_dan_danh_gia = require('./duong_dan/duong_dan_danh_gia');

// TV2: Auth, Dia chi, Gio hang, Don hang, Thanh toan
const duong_dan_auth = require('./duong_dan/duong_dan_auth');
const duong_dan_dia_chi = require('./duong_dan/duong_dan_dia_chi');
const duong_dan_gio_hang = require('./duong_dan/duong_dan_gio_hang');
const duong_dan_voucher = require('./duong_dan/duong_dan_voucher');
const duong_dan_don_hang = require('./duong_dan/duong_dan_don_hang');
const duong_dan_thanh_toan = require('./duong_dan/duong_dan_thanh_toan');

// TV3: Admin CMS & Public Banner
const duong_dan_admin = require('./duong_dan/duong_dan_admin');
const duong_dan_banner = require('./duong_dan/duong_dan_banner');

// Tro ly AI SmartDesk & Ticket Ho tro
const duong_dan_ai = require('./duong_dan/duong_dan_ai');
const duong_dan_ticket = require('./duong_dan/duong_dan_ticket');

const app = express();

// Middlewares co ban
app.use(tao_cau_hinh_cors());
app.use('/api', gioi_han_toan_cuc);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware xac thuc toan cuc (doc token/session va gan vao req.user)
app.use(xac_thuc_nguoi_dung);

// Phuc vu file tinh (hinh anh san pham & banners)
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Dang ky cac API endpoints:
// TV1: San pham, danh muc, hinh anh, danh gia
app.use('/api/san-pham', duong_dan_san_pham);
app.use('/api/danh-muc', duong_dan_danh_muc);
app.use('/api/hinh-anh', duong_dan_hinh_anh);
app.use('/api/danh-gia', duong_dan_danh_gia);

// TV2: Auth, Dia chi, Gio hang, Don hang, Thanh toan
app.use('/api/auth', duong_dan_auth);
app.use('/api/dia-chi', duong_dan_dia_chi);
app.use('/api/gio-hang', duong_dan_gio_hang);
app.use('/api/voucher', duong_dan_voucher);
app.use('/api/don-hang', duong_dan_don_hang);
app.use('/api/thanh-toan', duong_dan_thanh_toan);

// TV3: Admin & Banner
app.use('/api/admin', duong_dan_admin);
app.use('/api/banner', duong_dan_banner);

// Tro ly AI & Ticket
app.use('/api/ai-chat', duong_dan_ai);
app.use('/api/ticket', duong_dan_ticket);

// Kiem tra trang thai may chu
app.get('/api/trang-thai', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Máy chủ SmartDesk (Full 3 Thành viên) đang hoạt động bình thường.',
    thoi_gian: new Date().toISOString()
  });
});

// Xu ly route khong ton tai
app.use(xu_ly_duong_dan_khong_ton_tai);

// Xu ly loi tap trung
app.use(xu_ly_loi_chung);

const CONG_KET_NOI = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(CONG_KET_NOI, () => {
    console.log(`May chu SmartDesk dang chay tai cong ${CONG_KET_NOI}`);
  });
}

module.exports = app;
