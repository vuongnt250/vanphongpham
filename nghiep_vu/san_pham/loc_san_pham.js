// Nghiep vu: loc_san_pham.js
const mo_hinh_san_pham = require('../../co_so_du_lieu/mo_hinh/san_pham');

function loc_san_pham(tieu_chi = {}) {
  const bo_loc = {};

  if (tieu_chi.danh_muc_id) {
    bo_loc.danh_muc_id = Number(tieu_chi.danh_muc_id);
  }

  if (tieu_chi.gia_tu !== undefined && tieu_chi.gia_tu !== '') {
    const min = Number(tieu_chi.gia_tu);
    if (min >= 0) bo_loc.gia_tu = min;
  }

  if (tieu_chi.gia_den !== undefined && tieu_chi.gia_den !== '') {
    const max = Number(tieu_chi.gia_den);
    if (max >= 0) bo_loc.gia_den = max;
  }

  if (tieu_chi.thuong_hieu) {
    bo_loc.thuong_hieu = tieu_chi.thuong_hieu;
  }

  if (tieu_chi.trang_thai) {
    bo_loc.trang_thai = tieu_chi.trang_thai;
  }

  if (tieu_chi.noi_bat !== undefined && tieu_chi.noi_bat !== '') {
    bo_loc.noi_bat = Number(tieu_chi.noi_bat);
  }

  if (tieu_chi.sap_xep) {
    bo_loc.sap_xep = tieu_chi.sap_xep;
  }

  if (tieu_chi.trang) {
    bo_loc.trang = Number(tieu_chi.trang);
  }

  if (tieu_chi.gioi_han) {
    bo_loc.gioi_han = Number(tieu_chi.gioi_han);
  }

  return mo_hinh_san_pham.lay_danh_sach(bo_loc);
}

module.exports = { loc_san_pham };
