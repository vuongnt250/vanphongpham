// Nghiep vu: xem_san_pham.js
const mo_hinh_san_pham = require('../../co_so_du_lieu/mo_hinh/san_pham');
const mo_hinh_danh_gia = require('../../co_so_du_lieu/mo_hinh/danh_gia');

function xem_chi_tiet_san_pham(id) {
  const sp = mo_hinh_san_pham.lay_theo_id(id);
  if (!sp) {
    throw new Error(`Khong tim thay san pham voi ma: ${id}`);
  }

  // Bo sung thong ke danh gia
  const thong_ke = mo_hinh_danh_gia.tinh_thong_ke(id);
  sp.thong_ke_danh_gia = thong_ke;

  return sp;
}

function xem_danh_sach_san_pham(bo_loc = {}) {
  return mo_hinh_san_pham.lay_danh_sach(bo_loc);
}

module.exports = {
  xem_chi_tiet_san_pham,
  xem_danh_sach_san_pham
};
