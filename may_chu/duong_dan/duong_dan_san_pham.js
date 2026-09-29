// Duong dan: duong_dan_san_pham.js
const express = require('express');
const router = express.Router();
const dieu_khien_san_pham = require('../dieu_khien/dieu_khien_san_pham');
const dieu_khien_hinh_anh = require('../dieu_khien/dieu_khien_hinh_anh');
const dieu_khien_danh_gia = require('../dieu_khien/dieu_khien_danh_gia');
const { kiem_tra_du_lieu_them_san_pham, kiem_tra_du_lieu_sua_san_pham } = require('../kiem_tra_du_lieu/kiem_tra_san_pham');
const { kiem_tra_du_lieu_danh_gia } = require('../kiem_tra_du_lieu/kiem_tra_danh_gia');
const { yeu_cau_dang_nhap, kiem_tra_quyen_admin } = require('../trung_gian/xac_thuc');

// Lay danh sach thuong hieu
router.get('/thuong-hieu', dieu_khien_san_pham.lay_thuong_hieu);

// Lay danh sach san pham
router.get('/', dieu_khien_san_pham.lay_danh_sach);

// Lay chi tiet mot san pham
router.get('/:id', dieu_khien_san_pham.lay_chi_tiet);

// Tao san pham moi (yeu cau quyen quan tri de TV3 tich hop)
router.post('/', kiem_tra_quyen_admin, kiem_tra_du_lieu_them_san_pham, dieu_khien_san_pham.tao_moi);

// Cap nhat san pham
router.put('/:id', kiem_tra_quyen_admin, kiem_tra_du_lieu_sua_san_pham, dieu_khien_san_pham.cap_nhat);

// Xoa san pham
router.delete('/:id', kiem_tra_quyen_admin, dieu_khien_san_pham.xoa);

// Route con: Hinh anh cua san pham
router.get('/:id/hinh-anh', dieu_khien_hinh_anh.lay_theo_san_pham);
router.post('/:id/hinh-anh', kiem_tra_quyen_admin, dieu_khien_hinh_anh.tao_moi);
router.put('/:san_pham_id/hinh-anh/:hinh_anh_id/anh-chinh', kiem_tra_quyen_admin, dieu_khien_hinh_anh.dat_anh_chinh);

// Route con: Danh gia cua san pham
router.get('/:id/danh-gia', dieu_khien_danh_gia.lay_theo_san_pham);
router.post('/:id/danh-gia', yeu_cau_dang_nhap, kiem_tra_du_lieu_danh_gia, dieu_khien_danh_gia.tao_moi);

module.exports = router;
