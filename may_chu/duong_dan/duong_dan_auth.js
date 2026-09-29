const express = require('express');
const router = express.Router();
const dieu_khien_auth = require('../dieu_khien/dieu_khien_auth');
const { yeu_cau_dang_nhap } = require('../trung_gian/xac_thuc');
const { gioi_han_auth } = require('../trung_gian/gioi_han_truy_cap');

router.post('/dang-ky', gioi_han_auth, dieu_khien_auth.dang_ky);
router.post('/dang-nhap', gioi_han_auth, dieu_khien_auth.dang_nhap);
router.get('/me', yeu_cau_dang_nhap, dieu_khien_auth.lay_thong_tin_hien_tai);
router.put('/cap-nhat', yeu_cau_dang_nhap, dieu_khien_auth.cap_nhat_ho_so);
router.post('/doi-mat-khau', yeu_cau_dang_nhap, dieu_khien_auth.doi_mat_khau);

module.exports = router;
