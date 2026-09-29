const express = require('express');
const router = express.Router();
const dieu_khien_thanh_toan = require('../dieu_khien/dieu_khien_thanh_toan');
const dieu_khien_webhook = require('../dieu_khien/dieu_khien_webhook');
const { yeu_cau_dang_nhap } = require('../trung_gian/xac_thuc');

// Webhook cong thanh toan: xac thuc bang chu ky HMAC, khong dung JWT nguoi dung
router.post('/webhook', dieu_khien_webhook.xu_ly_webhook);

// Cac endpoint danh cho nguoi dung cu the yeu cau JWT dang nhap
router.use(yeu_cau_dang_nhap);

router.get('/:don_hang_id', dieu_khien_thanh_toan.lay_theo_don_hang);
router.post('/xac-nhan', dieu_khien_thanh_toan.xac_nhan_thanh_toan);

module.exports = router;
