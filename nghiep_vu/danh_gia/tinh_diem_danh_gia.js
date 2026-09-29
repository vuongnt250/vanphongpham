// Nghiep vu: tinh_diem_danh_gia.js
const mo_hinh_danh_gia = require('../../co_so_du_lieu/mo_hinh/danh_gia');
const mo_hinh_san_pham = require('../../co_so_du_lieu/mo_hinh/san_pham');

function tinh_diem_danh_gia(san_pham_id) {
  const thong_ke = mo_hinh_danh_gia.tinh_thong_ke(san_pham_id);
  
  // Cap nhat nguoc lai bang san_pham
  mo_hinh_san_pham.cap_nhat_danh_gia(
    san_pham_id,
    thong_ke.diem_trung_binh,
    thong_ke.tong_so_danh_gia
  );

  return thong_ke;
}

module.exports = { tinh_diem_danh_gia };
