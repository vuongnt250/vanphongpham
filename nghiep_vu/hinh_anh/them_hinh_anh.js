// Nghiep vu: them_hinh_anh.js
const mo_hinh_hinh_anh = require('../../co_so_du_lieu/mo_hinh/hinh_anh_san_pham');
const mo_hinh_san_pham = require('../../co_so_du_lieu/mo_hinh/san_pham');

function them_hinh_anh(du_lieu) {
  if (!du_lieu.san_pham_id) {
    throw new Error('Ma san pham la bat buoc.');
  }

  const sp = mo_hinh_san_pham.lay_theo_id(du_lieu.san_pham_id);
  if (!sp) {
    throw new Error(`San pham khong ton tai voi ma: ${du_lieu.san_pham_id}`);
  }

  if (!du_lieu.duong_dan_anh || du_lieu.duong_dan_anh.trim() === '') {
    throw new Error('Duong dan hinh anh khong duoc de trong.');
  }

  return mo_hinh_hinh_anh.them({
    san_pham_id: Number(du_lieu.san_pham_id),
    duong_dan_anh: du_lieu.duong_dan_anh.trim(),
    la_anh_chinh: du_lieu.la_anh_chinh ? 1 : 0
  });
}

module.exports = { them_hinh_anh };
