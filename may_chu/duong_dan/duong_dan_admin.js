// Router Admin & Quan ly kinh doanh (TV3)
const express = require('express');
const router = express.Router();
const dieu_khien_admin = require('../dieu_khien/dieu_khien_admin');
const { yeu_cau_dang_nhap, kiem_tra_quyen_admin } = require('../trung_gian/xac_thuc');

// Tat ca cac route admin deu can dang nhap va co quyen admin
router.use(yeu_cau_dang_nhap, kiem_tra_quyen_admin);

// Thong ke Dashboard
router.get('/thong-ke', dieu_khien_admin.lay_thong_ke);

// Quan ly don hang
router.get('/don-hang', dieu_khien_admin.lay_tat_ca_don_hang);
router.put('/don-hang/:id/trang-thai', dieu_khien_admin.cap_nhat_trang_thai_don_hang);

// Quan ly khach hang
router.get('/khach-hang', dieu_khien_admin.lay_danh_sach_khach_hang);
router.put('/khach-hang/:id/trang-thai', dieu_khien_admin.doi_trang_thai_khach_hang);

// Quan ly ton kho & nhat ky kho
router.get('/kho', dieu_khien_admin.lay_nhat_ky_kho);
router.get('/nhat-ky-kho', dieu_khien_admin.lay_nhat_ky_kho);
router.post('/kho/dieu-chinh', dieu_khien_admin.dieu_chinh_ton_kho);

// Quan ly nha cung cap
router.get('/nha-cung-cap', dieu_khien_admin.lay_nha_cung_cap);
router.post('/nha-cung-cap', dieu_khien_admin.them_nha_cung_cap);
router.put('/nha-cung-cap/:id', dieu_khien_admin.sua_nha_cung_cap);
router.delete('/nha-cung-cap/:id', dieu_khien_admin.xoa_nha_cung_cap);

// Quan ly banner
router.get('/banner', dieu_khien_admin.lay_banner);
router.post('/banner', dieu_khien_admin.them_banner);
router.put('/banner/:id', dieu_khien_admin.sua_banner);
router.delete('/banner/:id', dieu_khien_admin.xoa_banner);

// Cai dat he thong
router.get('/cai-dat', dieu_khien_admin.lay_cai_dat);
router.put('/cai-dat', dieu_khien_admin.cap_nhat_cai_dat);

// Quan ly Ticket ho tro khach hang
router.get('/ticket', dieu_khien_admin.lay_danh_sach_ticket);
router.get('/ticket/:id', dieu_khien_admin.lay_chi_tiet_ticket);
router.post('/ticket/:id/tra-loi', dieu_khien_admin.admin_tra_loi_ticket);
router.put('/ticket/:id/trang-thai', dieu_khien_admin.admin_cap_nhat_trang_thai_ticket);
router.delete('/ticket/:id', dieu_khien_admin.admin_xoa_ticket);

module.exports = router;
