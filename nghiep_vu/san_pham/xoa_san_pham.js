// Nghiep vu: xoa_san_pham.js
const mo_hinh_san_pham = require('../../co_so_du_lieu/mo_hinh/san_pham');

function xoa_san_pham(id) {
  const hien_tai = mo_hinh_san_pham.lay_theo_id(id);
  if (!hien_tai) {
    throw new Error(`Khong tim thay san pham voi ma: ${id}`);
  }

  return mo_hinh_san_pham.xoa(id);
}

module.exports = { xoa_san_pham };
