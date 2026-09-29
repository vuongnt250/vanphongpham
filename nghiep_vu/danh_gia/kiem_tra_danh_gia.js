// Nghiep vu: kiem_tra_danh_gia.js

function kiem_tra_tinh_hop_le_danh_gia(du_lieu) {
  const cac_loi = [];

  if (!du_lieu.san_pham_id) {
    cac_loi.push('Ma san pham la bat buoc.');
  }

  if (!du_lieu.user_id) {
    cac_loi.push('Nguoi dung phai dang nhap de thuc hien danh gia (user_id bi thieu).');
  }

  const so_sao = Number(du_lieu.so_sao);
  if (isNaN(so_sao) || so_sao < 1 || so_sao > 5 || !Number.isInteger(so_sao)) {
    cac_loi.push('So sao danh gia phai la so nguyen tu 1 den 5.');
  }

  if (!du_lieu.noi_dung || du_lieu.noi_dung.trim().length < 3) {
    cac_loi.push('Noi dung danh gia phai co it nhat 3 ky tu.');
  }

  return {
    hop_le: cac_loi.length === 0,
    cac_loi
  };
}

module.exports = { kiem_tra_tinh_hop_le_danh_gia };
