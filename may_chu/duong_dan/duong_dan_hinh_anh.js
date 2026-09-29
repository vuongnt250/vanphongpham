// Duong dan: duong_dan_hinh_anh.js
const express = require('express');
const router = express.Router();
const dieu_khien_hinh_anh = require('../dieu_khien/dieu_khien_hinh_anh');
const { kiem_tra_quyen_admin } = require('../trung_gian/xac_thuc');

// Lay chi tiet hinh anh
router.get('/:id', dieu_khien_hinh_anh.lay_chi_tiet);

// Cap nhat hinh anh
router.put('/:id', kiem_tra_quyen_admin, dieu_khien_hinh_anh.cap_nhat);

// Xoa hinh anh
router.delete('/:id', kiem_tra_quyen_admin, dieu_khien_hinh_anh.xoa);

module.exports = router;
