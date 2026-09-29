// Nghiep vu: xem_danh_muc.js
const mo_hinh_danh_muc = require('../../co_so_du_lieu/mo_hinh/danh_muc');

function xem_tat_ca_danh_muc(tuy_chon = {}) {
  return mo_hinh_danh_muc.lay_tat_ca(tuy_chon);
}

function xem_chi_tiet_danh_muc(dinh_danh) {
  let dm = null;
  if (!isNaN(dinh_danh)) {
    dm = mo_hinh_danh_muc.lay_theo_id(Number(dinh_danh));
  }
  if (!dm) {
    dm = mo_hinh_danh_muc.lay_theo_duong_dan(String(dinh_danh));
  }
  if (!dm) {
    throw new Error(`Khong tim thay danh muc: ${dinh_danh}`);
  }
  return dm;
}

module.exports = {
  xem_tat_ca_danh_muc,
  xem_chi_tiet_danh_muc
};
