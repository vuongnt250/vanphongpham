// Duong dan: duong_dan_danh_gia.js
const express = require('express');
const router = express.Router();
const dieu_khien_danh_gia = require('../dieu_khien/dieu_khien_danh_gia');
const { kiem_tra_quyen_admin } = require('../trung_gian/xac_thuc');

// Lay chi tiet danh gia
router.get('/:id', dieu_khien_danh_gia.lay_chi_tiet);

// Cap nhat danh gia (quan tri vien hoac kiem duyet vien)
router.put('/:id', kiem_tra_quyen_admin, dieu_khien_danh_gia.cap_nhat);

// Xoa danh gia
router.delete('/:id', kiem_tra_quyen_admin, dieu_khien_danh_gia.xoa);

module.exports = router;
