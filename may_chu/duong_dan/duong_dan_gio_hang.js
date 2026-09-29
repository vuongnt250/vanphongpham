// Router Gio hang (TV2)
const express = require('express');
const router = express.Router();
const dieu_khien_gio_hang = require('../dieu_khien/dieu_khien_gio_hang');
const { yeu_cau_dang_nhap } = require('../trung_gian/xac_thuc');

router.use(yeu_cau_dang_nhap);

router.get('/', dieu_khien_gio_hang.lay_gio_hang);
router.post('/them', dieu_khien_gio_hang.them_vao_gio);
router.put('/sua', dieu_khien_gio_hang.sua_so_luong);
router.put('/cap-nhat', dieu_khien_gio_hang.sua_so_luong);
router.delete('/xoa/:san_pham_id', dieu_khien_gio_hang.xoa_san_pham);
router.delete('/xoa-het', dieu_khien_gio_hang.xoa_tat_ca);

module.exports = router;
