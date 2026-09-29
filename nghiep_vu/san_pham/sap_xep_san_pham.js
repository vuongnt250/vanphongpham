// Nghiep vu: sap_xep_san_pham.js
const mo_hinh_san_pham = require('../../co_so_du_lieu/mo_hinh/san_pham');

const CAC_KIEU_SAP_XEP = [
  'moi_nhat',
  'gia_tang',
  'gia_giam',
  'ban_chay',
  'danh_gia_cao'
];

function sap_xep_san_pham(kieu_sap_xep, tuy_chon = {}) {
  const kieu = CAC_KIEU_SAP_XEP.includes(kieu_sap_xep) ? kieu_sap_xep : 'moi_nhat';
  return mo_hinh_san_pham.lay_danh_sach({
    ...tuy_chon,
    sap_xep: kieu
  });
}

module.exports = {
  sap_xep_san_pham,
  CAC_KIEU_SAP_XEP
};
