// Router Banner cong khai cho nguoi dung (TV1 & TV3)
const express = require('express');
const router = express.Router();
const banner = require('../../co_so_du_lieu/mo_hinh/banner');

router.get('/', (req, res, next) => {
  try {
    const list = banner.lay_hoat_dong();
    res.status(200).json({
      success: true,
      du_lieu: list
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
