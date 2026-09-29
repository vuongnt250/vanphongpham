// Duong dan: duong_dan_danh_muc.js
const express = require('express');
const router = express.Router();
const dieu_khien_danh_muc = require('../dieu_khien/dieu_khien_danh_muc');
const { kiem_tra_du_lieu_them_danh_muc, kiem_tra_du_lieu_sua_danh_muc } = require('../kiem_tra_du_lieu/kiem_tra_danh_muc');
const { kiem_tra_quyen_admin } = require('../trung_gian/xac_thuc');

// Lay tat ca danh muc
router.get('/', dieu_khien_danh_muc.lay_tat_ca);

// Lay chi tiet danh muc theo id hoac slug
router.get('/:id', dieu_khien_danh_muc.lay_chi_tiet);

// Lay san pham theo danh muc
router.get('/:id/san-pham', dieu_khien_danh_muc.lay_san_pham_theo_danh_muc);

// Tao danh muc moi (yeu cau quyen quan tri de TV3 tich hop)
router.post('/', kiem_tra_quyen_admin, kiem_tra_du_lieu_them_danh_muc, dieu_khien_danh_muc.tao_moi);

// Cap nhat danh muc
router.put('/:id', kiem_tra_quyen_admin, kiem_tra_du_lieu_sua_danh_muc, dieu_khien_danh_muc.cap_nhat);

// Xoa danh muc
router.delete('/:id', kiem_tra_quyen_admin, dieu_khien_danh_muc.xoa);

module.exports = router;
