// Validation middleware: kiem_tra_danh_muc.js

function kiem_tra_du_lieu_them_danh_muc(req, res, next) {
  const { ten_danh_muc, duong_dan_danh_muc } = req.body;
  const cac_loi = [];

  if (!ten_danh_muc || String(ten_danh_muc).trim() === '') {
    cac_loi.push('Ten danh muc khong duoc de trong.');
  }

  if (!duong_dan_danh_muc || String(duong_dan_danh_muc).trim() === '') {
    cac_loi.push('Duong dan (slug) danh muc khong duoc de trong.');
  }

  if (cac_loi.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Du lieu danh muc khong hop le.',
      errors: cac_loi
    });
  }

  next();
}

function kiem_tra_du_lieu_sua_danh_muc(req, res, next) {
  const { ten_danh_muc, duong_dan_danh_muc } = req.body;
  const cac_loi = [];

  if (ten_danh_muc !== undefined && String(ten_danh_muc).trim() === '') {
    cac_loi.push('Ten danh muc khong duoc de trong.');
  }

  if (duong_dan_danh_muc !== undefined && String(duong_dan_danh_muc).trim() === '') {
    cac_loi.push('Duong dan danh muc khong duoc de trong.');
  }

  if (cac_loi.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Du lieu cap nhat danh muc khong hop le.',
      errors: cac_loi
    });
  }

  next();
}

module.exports = {
  kiem_tra_du_lieu_them_danh_muc,
  kiem_tra_du_lieu_sua_danh_muc
};
