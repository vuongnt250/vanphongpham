// Router Ticket ho tro khach hang (SmartDesk)
const express = require('express');
const router = express.Router();
const dieu_khien_ticket = require('../dieu_khien/dieu_khien_ticket');

// GET /api/ticket - Lay danh sach ticket cua khach hang
router.get('/', dieu_khien_ticket.lay_danh_sach_ticket_khach);

// POST /api/ticket - Tao ticket moi
router.post('/', dieu_khien_ticket.tao_ticket);

// GET /api/ticket/:ma_ticket - Tra cuu thong tin & tin nhan ticket
router.get('/:ma_ticket', dieu_khien_ticket.tra_cuu_ticket);

// POST /api/ticket/:id/tin-nhan - Khach hang gui tin nhan bo sung
router.post('/:id/tin-nhan', dieu_khien_ticket.gui_tin_nhan_khach);

module.exports = router;
