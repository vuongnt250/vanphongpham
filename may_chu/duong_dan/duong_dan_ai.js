// Router Tro ly AI SmartDesk
const express = require('express');
const router = express.Router();
const dieu_khien_ai = require('../dieu_khien/dieu_khien_ai');

// POST /api/ai-chat
router.post('/', dieu_khien_ai.xu_ly_chat);

module.exports = router;
