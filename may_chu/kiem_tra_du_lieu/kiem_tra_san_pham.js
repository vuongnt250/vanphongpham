// Validation middleware: kiem_tra_san_pham.js

function kiem_tra_du_lieu_them_san_pham(req, res, next) {
  const { ten_san_pham, danh_muc_id, gia, so_luong_ton } = req.body;
  const cac_loi = [];

  if (!ten_san_pham || String(ten_san_pham).trim() === '') {
    cac_loi.push('Ten san pham khong duoc de trong.');
  }

  if (!danh_muc_id || isNaN(Number(danh_muc_id))) {
    cac_loi.push('Danh muc san pham khong hop le.');
  }

  if (gia === undefined || isNaN(Number(gia)) || Number(gia) < 0) {
    cac_loi.push('Gia san pham phai la so khong am.');
  }

  if (so_luong_ton !== undefined && (isNaN(Number(so_luong_ton)) || Number(so_luong_ton) < 0)) {
    cac_loi.push('So luong ton phai la so khong am.');
  }

  if (cac_loi.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Du lieu san pham khong hop le.',
      errors: cac_loi
    });
  }

  next();
}

function kiem_tra_du_lieu_sua_san_pham(req, res, next) {
  const { ten_san_pham, danh_muc_id, gia, so_luong_ton } = req.body;
  const cac_loi = [];

  if (ten_san_pham !== undefined && String(ten_san_pham).trim() === '') {
    cac_loi.push('Ten san pham khong duoc de trong.');
  }

  if (danh_muc_id !== undefined && (isNaN(Number(danh_muc_id)) || Number(danh_muc_id) <= 0)) {
    cac_loi.push('Danh muc san pham khong hop le.');
  }

  if (gia !== undefined && (isNaN(Number(gia)) || Number(gia) < 0)) {
    cac_loi.push('Gia san pham phai la so khong am.');
  }

  if (so_luong_ton !== undefined && (isNaN(Number(so_luong_ton)) || Number(so_luong_ton) < 0)) {
    cac_loi.push('So luong ton phai la so khong am.');
  }

  if (cac_loi.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Du lieu cap nhat khong hop le.',
      errors: cac_loi
    });
  }

  next();
}

module.exports = {
  kiem_tra_du_lieu_them_san_pham,
  kiem_tra_du_lieu_sua_san_pham
};
