// Nghiep vu: sua_hinh_anh.js
const mo_hinh_hinh_anh = require('../../co_so_du_lieu/mo_hinh/hinh_anh_san_pham');

function sua_hinh_anh(id, du_lieu) {
  const hien_tai = mo_hinh_hinh_anh.lay_theo_id(id);
  if (!hien_tai) {
    throw new Error(`Khong tim thay hinh anh voi ma: ${id}`);
  }

  const cap_nhat = {};
  if (du_lieu.duong_dan_anh && du_lieu.duong_dan_anh.trim() !== '') {
    cap_nhat.duong_dan_anh = du_lieu.duong_dan_anh.trim();
  }
  if (du_lieu.la_anh_chinh !== undefined) {
    cap_nhat.la_anh_chinh = du_lieu.la_anh_chinh ? 1 : 0;
  }

  return mo_hinh_hinh_anh.sua(id, cap_nhat);
}

function dat_lam_anh_chinh(san_pham_id, hinh_anh_id) {
  const hien_tai = mo_hinh_hinh_anh.lay_theo_id(hinh_anh_id);
  if (!hien_tai || hien_tai.san_pham_id !== Number(san_pham_id)) {
    throw new Error('Hinh anh khong hop le hoac khong thuoc ve san pham nay.');
  }

  return mo_hinh_hinh_anh.dat_lam_anh_chinh(Number(san_pham_id), Number(hinh_anh_id));
}

module.exports = {
  sua_hinh_anh,
  dat_lam_anh_chinh
};
