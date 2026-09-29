// Dich vu: dich_vu_danh_gia.js
const { them_danh_gia } = require('../../nghiep_vu/danh_gia/them_danh_gia');
const { xem_danh_gia_san_pham, xem_chi_tiet_danh_gia } = require('../../nghiep_vu/danh_gia/xem_danh_gia');
const { tinh_diem_danh_gia } = require('../../nghiep_vu/danh_gia/tinh_diem_danh_gia');
const mo_hinh_danh_gia = require('../../co_so_du_lieu/mo_hinh/danh_gia');

const dich_vu_danh_gia = {
  lay_theo_san_pham(san_pham_id, tuy_chon) {
    return xem_danh_gia_san_pham(Number(san_pham_id), tuy_chon);
  },

  lay_chi_tiet(id) {
    return xem_chi_tiet_danh_gia(Number(id));
  },

  tao_moi(du_lieu) {
    return them_danh_gia(du_lieu);
  },

  cap_nhat(id, du_lieu) {
    const dg = mo_hinh_danh_gia.sua(Number(id), du_lieu);
    if (dg) {
      tinh_diem_danh_gia(dg.san_pham_id);
    }
    return dg;
  },

  xoa(id) {
    const dg = mo_hinh_danh_gia.lay_theo_id(Number(id));
    if (!dg) {
      throw new Error(`Khong tim thay danh gia voi ma: ${id}`);
    }
    const ket_qua = mo_hinh_danh_gia.xoa(Number(id));
    if (ket_qua) {
      tinh_diem_danh_gia(dg.san_pham_id);
    }
    return ket_qua;
  }
};

module.exports = dich_vu_danh_gia;
