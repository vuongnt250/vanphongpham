const express = require('express');
const router = express.Router();
const dieu_khien_don_hang = require('../dieu_khien/dieu_khien_don_hang');
const { yeu_cau_dang_nhap } = require('../trung_gian/xac_thuc');
const { gioi_han_tao_don } = require('../trung_gian/gioi_han_truy_cap');

router.use(yeu_cau_dang_nhap);

router.post('/', gioi_han_tao_don, dieu_khien_don_hang.tao_don_hang);
router.get('/cua-toi', dieu_khien_don_hang.lay_don_hang_cua_toi);
router.get('/:id', dieu_khien_don_hang.lay_chi_tiet);
router.post('/:id/huy', dieu_khien_don_hang.huy_don_hang);

module.exports = router;
