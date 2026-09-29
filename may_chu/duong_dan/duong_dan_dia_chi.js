// Router Dia chi giao hang (TV2)
const express = require('express');
const router = express.Router();
const dieu_khien_dia_chi = require('../dieu_khien/dieu_khien_dia_chi');
const { yeu_cau_dang_nhap } = require('../trung_gian/xac_thuc');

router.use(yeu_cau_dang_nhap);

router.get('/', dieu_khien_dia_chi.lay_danh_sach);
router.post('/', dieu_khien_dia_chi.them);
router.put('/:id', dieu_khien_dia_chi.sua);
router.put('/:id/mac-dinh', dieu_khien_dia_chi.dat_mac_dinh);
router.delete('/:id', dieu_khien_dia_chi.xoa);

module.exports = router;
