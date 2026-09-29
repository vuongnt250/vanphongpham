// Nghiep vu: sua_san_pham.js
const mo_hinh_san_pham = require('../../co_so_du_lieu/mo_hinh/san_pham');
const mo_hinh_danh_muc = require('../../co_so_du_lieu/mo_hinh/danh_muc');
const mo_hinh_hinh_anh = require('../../co_so_du_lieu/mo_hinh/hinh_anh_san_pham');

function sua_san_pham(id, du_lieu) {
  const hien_tai = mo_hinh_san_pham.lay_theo_id(id);
  if (!hien_tai) {
    throw new Error(`Khong tim thay san pham voi ma: ${id}`);
  }

  if (du_lieu.ten_san_pham !== undefined && du_lieu.ten_san_pham.trim() === '') {
    throw new Error('Ten san pham khong duoc de trong.');
  }

  if (du_lieu.danh_muc_id !== undefined) {
    const danh_muc = mo_hinh_danh_muc.lay_theo_id(du_lieu.danh_muc_id);
    if (!danh_muc) {
      throw new Error('Danh muc khong ton tai.');
    }
  }

  if (du_lieu.gia !== undefined && Number(du_lieu.gia) < 0) {
    throw new Error('Gia san pham phai lon hon hoac bang 0.');
  }

  if (du_lieu.so_luong_ton !== undefined && Number(du_lieu.so_luong_ton) < 0) {
    throw new Error('So luong ton phai lon hon hoac bang 0.');
  }

  const cap_nhat = { ...du_lieu };
  if (cap_nhat.ten_san_pham) cap_nhat.ten_san_pham = cap_nhat.ten_san_pham.trim();
  if (cap_nhat.gia !== undefined) cap_nhat.gia = Number(cap_nhat.gia);
  if (cap_nhat.gia_goc !== undefined) cap_nhat.gia_goc = Number(cap_nhat.gia_goc);
  if (cap_nhat.so_luong_ton !== undefined) cap_nhat.so_luong_ton = Number(cap_nhat.so_luong_ton);
  if (cap_nhat.noi_bat !== undefined) cap_nhat.noi_bat = cap_nhat.noi_bat ? 1 : 0;

  // Xu ly hinh anh neu co truyen vao
  const anhMoi = du_lieu.duong_dan_anh || du_lieu.anh_chinh;
  if (anhMoi && typeof anhMoi === 'string' && anhMoi.trim()) {
    const dsAnh = mo_hinh_hinh_anh.lay_theo_san_pham_id(id);
    const anhChinh = dsAnh.find(a => a.la_anh_chinh === 1);
    if (anhChinh) {
      mo_hinh_hinh_anh.sua(anhChinh.id, { duong_dan_anh: anhMoi.trim() });
    } else {
      mo_hinh_hinh_anh.them({ san_pham_id: id, duong_dan_anh: anhMoi.trim(), la_anh_chinh: 1 });
    }
  }

  return mo_hinh_san_pham.sua(id, cap_nhat);
}

module.exports = { sua_san_pham };
