// Nghiep vu: xem_danh_gia.js
const mo_hinh_danh_gia = require('../../co_so_du_lieu/mo_hinh/danh_gia');
const mo_hinh_san_pham = require('../../co_so_du_lieu/mo_hinh/san_pham');

function xem_danh_gia_san_pham(san_pham_id, tuy_chon = {}) {
  const sp = mo_hinh_san_pham.lay_theo_id(san_pham_id);
  if (!sp) {
    throw new Error(`San pham khong ton tai voi ma: ${san_pham_id}`);
  }

  const danh_sach = mo_hinh_danh_gia.lay_theo_san_pham_id(san_pham_id, tuy_chon);
  const thong_ke = mo_hinh_danh_gia.tinh_thong_ke(san_pham_id);

  return {
    san_pham_id,
    thong_ke,
    danh_sach
  };
}

function xem_chi_tiet_danh_gia(id) {
  const dg = mo_hinh_danh_gia.lay_theo_id(id);
  if (!dg) {
    throw new Error(`Khong tim thay danh gia voi ma: ${id}`);
  }
  return dg;
}

module.exports = {
  xem_danh_gia_san_pham,
  xem_chi_tiet_danh_gia
};
