// Dich vu: dich_vu_san_pham.js
const { xem_chi_tiet_san_pham, xem_danh_sach_san_pham } = require('../../nghiep_vu/san_pham/xem_san_pham');
const { them_san_pham } = require('../../nghiep_vu/san_pham/them_san_pham');
const { sua_san_pham } = require('../../nghiep_vu/san_pham/sua_san_pham');
const { xoa_san_pham } = require('../../nghiep_vu/san_pham/xoa_san_pham');
const { tim_kiem_san_pham } = require('../../nghiep_vu/san_pham/tim_kiem_san_pham');
const { loc_san_pham } = require('../../nghiep_vu/san_pham/loc_san_pham');
const { sap_xep_san_pham } = require('../../nghiep_vu/san_pham/sap_xep_san_pham');
const mo_hinh_san_pham = require('../../co_so_du_lieu/mo_hinh/san_pham');

const dich_vu_san_pham = {
  lay_danh_sach(bo_loc) {
    if (bo_loc.tu_khoa) {
      return tim_kiem_san_pham(bo_loc.tu_khoa, bo_loc);
    }
    return loc_san_pham(bo_loc);
  },

  lay_chi_tiet(id) {
    return xem_chi_tiet_san_pham(Number(id));
  },

  tao_moi(du_lieu) {
    return them_san_pham(du_lieu);
  },

  cap_nhat(id, du_lieu) {
    return sua_san_pham(Number(id), du_lieu);
  },

  xoa(id) {
    return xoa_san_pham(Number(id));
  },

  lay_danh_sach_thuong_hieu() {
    return mo_hinh_san_pham.lay_danh_sach_thuong_hieu();
  }
};

module.exports = dich_vu_san_pham;
