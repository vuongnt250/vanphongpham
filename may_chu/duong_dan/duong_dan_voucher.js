// Router Voucher (TV3 + TV2)
const express = require('express');
const router = express.Router();
const dieu_khien_voucher = require('../dieu_khien/dieu_khien_voucher');
const { yeu_cau_dang_nhap, kiem_tra_quyen_admin } = require('../trung_gian/xac_thuc');

// Public kiem tra ma giam gia
router.post('/kiem-tra', dieu_khien_voucher.kiem_tra);

// Lay danh sach voucher dang hoat dong
router.get('/', dieu_khien_voucher.lay_danh_sach);

// Admin CRUD voucher
router.post('/', yeu_cau_dang_nhap, kiem_tra_quyen_admin, dieu_khien_voucher.them);
router.put('/:id', yeu_cau_dang_nhap, kiem_tra_quyen_admin, dieu_khien_voucher.sua);
router.delete('/:id', yeu_cau_dang_nhap, kiem_tra_quyen_admin, dieu_khien_voucher.xoa);

module.exports = router;
