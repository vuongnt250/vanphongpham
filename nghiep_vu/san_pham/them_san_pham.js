// Nghiep vu: them_san_pham.js
const mo_hinh_san_pham = require('../../co_so_du_lieu/mo_hinh/san_pham');
const mo_hinh_danh_muc = require('../../co_so_du_lieu/mo_hinh/danh_muc');
const mo_hinh_hinh_anh = require('../../co_so_du_lieu/mo_hinh/hinh_anh_san_pham');

function them_san_pham(du_lieu) {
  if (!du_lieu.ten_san_pham || du_lieu.ten_san_pham.trim() === '') {
    throw new Error('Ten san pham khong duoc de trong.');
  }

  if (!du_lieu.danh_muc_id) {
    throw new Error('Danh muc san pham la bat buoc.');
  }

  const danh_muc = mo_hinh_danh_muc.lay_theo_id(du_lieu.danh_muc_id);
  if (!danh_muc) {
    throw new Error('Danh muc khong ton tai.');
  }

  if (du_lieu.gia === undefined || Number(du_lieu.gia) < 0) {
    throw new Error('Gia san pham phai lon hon hoac bang 0.');
  }

  if (du_lieu.so_luong_ton !== undefined && Number(du_lieu.so_luong_ton) < 0) {
    throw new Error('So luong ton phai lon hon hoac bang 0.');
  }

  const san_pham_moi = mo_hinh_san_pham.them({
    danh_muc_id: Number(du_lieu.danh_muc_id),
    nha_cung_cap_id: du_lieu.nha_cung_cap_id ? Number(du_lieu.nha_cung_cap_id) : null,
    ten_san_pham: du_lieu.ten_san_pham.trim(),
    gia: Number(du_lieu.gia),
    gia_goc: du_lieu.gia_goc ? Number(du_lieu.gia_goc) : Number(du_lieu.gia),
    so_luong_ton: du_lieu.so_luong_ton !== undefined ? Number(du_lieu.so_luong_ton) : 0,
    da_ban: du_lieu.da_ban !== undefined ? Number(du_lieu.da_ban) : 0,
    don_vi_tinh: du_lieu.don_vi_tinh || 'Cai',
    thuong_hieu: du_lieu.thuong_hieu || '',
    mo_ta: du_lieu.mo_ta || '',
    trang_thai: du_lieu.trang_thai || 'hoat_dong',
    noi_bat: du_lieu.noi_bat ? 1 : 0
  });

  const anh_dau_tien = du_lieu.duong_dan_anh || du_lieu.anh_chinh;
  if (anh_dau_tien) {
    mo_hinh_hinh_anh.them({
      san_pham_id: san_pham_moi.id,
      duong_dan_anh: anh_dau_tien,
      la_anh_chinh: 1
    });
  }

  return mo_hinh_san_pham.lay_theo_id(san_pham_moi.id);
}

module.exports = { them_san_pham };
