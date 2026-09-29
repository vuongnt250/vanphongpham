// Nghiep vu: xem_san_pham_theo_danh_muc.js
const mo_hinh_danh_muc = require('../../co_so_du_lieu/mo_hinh/danh_muc');
const mo_hinh_san_pham = require('../../co_so_du_lieu/mo_hinh/san_pham');

function xem_san_pham_theo_danh_muc(danh_muc_id, tuy_chon = {}) {
  const dm = mo_hinh_danh_muc.lay_theo_id(danh_muc_id);
  if (!dm) {
    throw new Error(`Danh muc khong ton tai voi ma: ${danh_muc_id}`);
  }

  const ket_qua = mo_hinh_san_pham.lay_danh_sach({
    ...tuy_chon,
    danh_muc_id
  });

  return {
    danh_muc: dm,
    ...ket_qua
  };
}

module.exports = { xem_san_pham_theo_danh_muc };
