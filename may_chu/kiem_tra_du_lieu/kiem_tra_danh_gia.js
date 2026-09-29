// Validation middleware: kiem_tra_danh_gia.js

function kiem_tra_du_lieu_danh_gia(req, res, next) {
  const { so_sao, noi_dung } = req.body;
  const cac_loi = [];

  const sao = Number(so_sao);
  if (isNaN(sao) || sao < 1 || sao > 5 || !Number.isInteger(sao)) {
    cac_loi.push('So sao danh gia phai la so nguyen tu 1 den 5.');
  }

  if (!noi_dung || String(noi_dung).trim().length < 3) {
    cac_loi.push('Noi dung danh gia phai co it nhat 3 ky tu.');
  }

  if (cac_loi.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Du lieu danh gia khong hop le.',
      errors: cac_loi
    });
  }

  next();
}

module.exports = { kiem_tra_du_lieu_danh_gia };
