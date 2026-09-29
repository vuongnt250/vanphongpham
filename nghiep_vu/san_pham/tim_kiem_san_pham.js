// Nghiep vu: tim_kiem_san_pham.js
const mo_hinh_san_pham = require('../../co_so_du_lieu/mo_hinh/san_pham');

function tim_kiem_san_pham(tu_khoa, tuy_chon = {}) {
  if (!tu_khoa || tu_khoa.trim() === '') {
    return mo_hinh_san_pham.lay_danh_sach(tuy_chon);
  }

  const bo_loc = {
    ...tuy_chon,
    tu_khoa: tu_khoa.trim()
  };

  return mo_hinh_san_pham.lay_danh_sach(bo_loc);
}

module.exports = { tim_kiem_san_pham };
