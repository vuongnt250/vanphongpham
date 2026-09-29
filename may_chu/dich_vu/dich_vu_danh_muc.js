// Dich vu: dich_vu_danh_muc.js
const { xem_tat_ca_danh_muc, xem_chi_tiet_danh_muc } = require('../../nghiep_vu/danh_muc/xem_danh_muc');
const { xem_san_pham_theo_danh_muc } = require('../../nghiep_vu/danh_muc/xem_san_pham_theo_danh_muc');
const mo_hinh_danh_muc = require('../../co_so_du_lieu/mo_hinh/danh_muc');

const dich_vu_danh_muc = {
  lay_tat_ca(tuy_chon) {
    return xem_tat_ca_danh_muc(tuy_chon);
  },

  lay_chi_tiet(id_hoac_duong_dan) {
    return xem_chi_tiet_danh_muc(id_hoac_duong_dan);
  },

  lay_san_pham_theo_danh_muc(danh_muc_id, tuy_chon) {
    return xem_san_pham_theo_danh_muc(Number(danh_muc_id), tuy_chon);
  },

  tao_moi(du_lieu) {
    return mo_hinh_danh_muc.them(du_lieu);
  },

  cap_nhat(id, du_lieu) {
    return mo_hinh_danh_muc.sua(Number(id), du_lieu);
  },

  xoa(id) {
    return mo_hinh_danh_muc.xoa(Number(id));
  }
};

module.exports = dich_vu_danh_muc;
