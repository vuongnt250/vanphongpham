// Nghiep vu: them_danh_gia.js
const mo_hinh_danh_gia = require('../../co_so_du_lieu/mo_hinh/danh_gia');
const mo_hinh_san_pham = require('../../co_so_du_lieu/mo_hinh/san_pham');
const { kiem_tra_tinh_hop_le_danh_gia } = require('./kiem_tra_danh_gia');
const { tinh_diem_danh_gia } = require('./tinh_diem_danh_gia');

function them_danh_gia(du_lieu) {
  // Kiem tra tinh hop le
  const kiem_tra = kiem_tra_tinh_hop_le_danh_gia(du_lieu);
  if (!kiem_tra.hop_le) {
    throw new Error(kiem_tra.cac_loi.join(' '));
  }

  // Kiem tra san pham ton tai
  const sp = mo_hinh_san_pham.lay_theo_id(du_lieu.san_pham_id);
  if (!sp) {
    throw new Error(`San pham khong ton tai voi ma: ${du_lieu.san_pham_id}`);
  }

  // Luu y bao mat: user_id duoc truyen tu session/token da xac thuc
  const danh_gia_moi = mo_hinh_danh_gia.them({
    san_pham_id: Number(du_lieu.san_pham_id),
    user_id: Number(du_lieu.user_id),
    don_hang_id: du_lieu.don_hang_id ? Number(du_lieu.don_hang_id) : null,
    so_sao: Number(du_lieu.so_sao),
    noi_dung: du_lieu.noi_dung.trim(),
    trang_thai: 'da_duyet'
  });

  // Tinh toan lai diem danh gia va tong so danh gia cua san pham
  const thong_ke_moi = tinh_diem_danh_gia(du_lieu.san_pham_id);

  return {
    danh_gia: danh_gia_moi,
    thong_ke: thong_ke_moi
  };
}

module.exports = { them_danh_gia };
