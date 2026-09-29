// Dich vu: dich_vu_hinh_anh.js
const { them_hinh_anh } = require('../../nghiep_vu/hinh_anh/them_hinh_anh');
const { sua_hinh_anh, dat_lam_anh_chinh } = require('../../nghiep_vu/hinh_anh/sua_hinh_anh');
const { xoa_hinh_anh } = require('../../nghiep_vu/hinh_anh/xoa_hinh_anh');
const mo_hinh_hinh_anh = require('../../co_so_du_lieu/mo_hinh/hinh_anh_san_pham');

const dich_vu_hinh_anh = {
  lay_theo_san_pham(san_pham_id) {
    return mo_hinh_hinh_anh.lay_theo_san_pham_id(Number(san_pham_id));
  },

  lay_chi_tiet(id) {
    return mo_hinh_hinh_anh.lay_theo_id(Number(id));
  },

  tao_moi(du_lieu) {
    return them_hinh_anh(du_lieu);
  },

  cap_nhat(id, du_lieu) {
    return sua_hinh_anh(Number(id), du_lieu);
  },

  dat_anh_chinh(san_pham_id, hinh_anh_id) {
    return dat_lam_anh_chinh(Number(san_pham_id), Number(hinh_anh_id));
  },

  xoa(id) {
    return xoa_hinh_anh(Number(id));
  }
};

module.exports = dich_vu_hinh_anh;
