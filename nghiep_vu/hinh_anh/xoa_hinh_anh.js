// Nghiep vu: xoa_hinh_anh.js
const mo_hinh_hinh_anh = require('../../co_so_du_lieu/mo_hinh/hinh_anh_san_pham');

function xoa_hinh_anh(id) {
  const hien_tai = mo_hinh_hinh_anh.lay_theo_id(id);
  if (!hien_tai) {
    throw new Error(`Khong tim thay hinh anh voi ma: ${id}`);
  }

  return mo_hinh_hinh_anh.xoa(id);
}

module.exports = { xoa_hinh_anh };
