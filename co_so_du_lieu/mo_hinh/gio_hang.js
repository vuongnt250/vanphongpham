// Mo hinh Gio hang luu Database (TV2)
const { lay_ket_noi } = require('../ket_noi');

const gio_hang = {
  lay_hoac_tao_gio_hang(user_id) {
    const db = lay_ket_noi();
    let row = db.prepare('SELECT * FROM gio_hang WHERE user_id = ?').get(user_id);
    if (!row) {
      const res = db.prepare('INSERT INTO gio_hang (user_id) VALUES (?)').run(user_id);
      row = { id: res.lastInsertRowid, user_id };
    }
    return row;
  },

  lay_chi_tiet_gio_hang(user_id) {
    const db = lay_ket_noi();
    const cart = this.lay_hoac_tao_gio_hang(user_id);

    const items = db.prepare(`
      SELECT 
        ct.id as item_id,
        ct.san_pham_id,
        ct.so_luong,
        sp.ten_san_pham,
        sp.gia,
        sp.gia_goc,
        sp.so_luong_ton,
        sp.trang_thai as trang_thai_sp,
        ha.duong_dan_anh as anh_chinh
      FROM chi_tiet_gio_hang ct
      JOIN san_pham sp ON ct.san_pham_id = sp.id
      LEFT JOIN hinh_anh_san_pham ha ON sp.id = ha.san_pham_id AND ha.la_anh_chinh = 1
      WHERE ct.gio_hang_id = ?
      ORDER BY ct.id DESC
    `).all(cart.id);

    // Dinh dang item cho frontend
    const formatted = items.map(it => ({
      item_id: it.item_id,
      so_luong: it.so_luong,
      san_pham: {
        id: it.san_pham_id,
        ten_san_pham: it.ten_san_pham,
        gia: it.gia,
        gia_goc: it.gia_goc,
        so_luong_ton: it.so_luong_ton,
        anh_chinh: it.anh_chinh || '/images/products/product-1.jpg',
        con_hang: it.so_luong_ton >= it.so_luong && it.trang_thai_sp === 'hoat_dong'
      }
    }));

    const tam_tinh = formatted.reduce((tong, it) => tong + (it.san_pham.gia * it.so_luong), 0);
    const tong_so_luong = formatted.reduce((tong, it) => tong + it.so_luong, 0);

    return {
      gio_hang_id: cart.id,
      user_id,
      danh_sach: formatted,
      tam_tinh,
      tong_so_luong
    };
  },

  them_san_pham(user_id, san_pham_id, so_luong = 1) {
    const db = lay_ket_noi();
    const cart = this.lay_hoac_tao_gio_hang(user_id);

    // Kiem tra san pham va ton kho
    const sp = db.prepare('SELECT id, so_luong_ton, trang_thai FROM san_pham WHERE id = ?').get(san_pham_id);
    if (!sp) throw new Error('Không tìm thấy sản phẩm.');
    if (sp.trang_thai !== 'hoat_dong') throw new Error('Sản phẩm hiện không mở bán.');

    const currentItem = db.prepare('SELECT id, so_luong FROM chi_tiet_gio_hang WHERE gio_hang_id = ? AND san_pham_id = ?').get(cart.id, san_pham_id);
    const newQty = (currentItem ? currentItem.so_luong : 0) + Number(so_luong);

    if (newQty > sp.so_luong_ton) {
      throw new Error(`Số lượng yêu cầu vượt quá tồn kho hiện có (${sp.so_luong_ton}).`);
    }

    if (currentItem) {
      db.prepare('UPDATE chi_tiet_gio_hang SET so_luong = ? WHERE id = ?').run(newQty, currentItem.id);
    } else {
      db.prepare('INSERT INTO chi_tiet_gio_hang (gio_hang_id, san_pham_id, so_luong) VALUES (?, ?, ?)').run(cart.id, san_pham_id, newQty);
    }

    db.prepare('UPDATE gio_hang SET ngay_cap_nhat = CURRENT_TIMESTAMP WHERE id = ?').run(cart.id);
    return this.lay_chi_tiet_gio_hang(user_id);
  },

  sua_so_luong(user_id, san_pham_id, so_luong) {
    const db = lay_ket_noi();
    const cart = this.lay_hoac_tao_gio_hang(user_id);

    if (so_luong <= 0) {
      return this.xoa_san_pham(user_id, san_pham_id);
    }

    const sp = db.prepare('SELECT id, so_luong_ton FROM san_pham WHERE id = ?').get(san_pham_id);
    if (!sp) throw new Error('Không tìm thấy sản phẩm.');
    if (so_luong > sp.so_luong_ton) {
      throw new Error(`Số lượng yêu cầu (${so_luong}) vượt quá tồn kho hiện có (${sp.so_luong_ton}).`);
    }

    db.prepare('UPDATE chi_tiet_gio_hang SET so_luong = ? WHERE gio_hang_id = ? AND san_pham_id = ?').run(so_luong, cart.id, san_pham_id);
    db.prepare('UPDATE gio_hang SET ngay_cap_nhat = CURRENT_TIMESTAMP WHERE id = ?').run(cart.id);
    return this.lay_chi_tiet_gio_hang(user_id);
  },

  xoa_san_pham(user_id, san_pham_id) {
    const db = lay_ket_noi();
    const cart = this.lay_hoac_tao_gio_hang(user_id);
    db.prepare('DELETE FROM chi_tiet_gio_hang WHERE gio_hang_id = ? AND san_pham_id = ?').run(cart.id, san_pham_id);
    db.prepare('UPDATE gio_hang SET ngay_cap_nhat = CURRENT_TIMESTAMP WHERE id = ?').run(cart.id);
    return this.lay_chi_tiet_gio_hang(user_id);
  },

  xoa_sach_gio(user_id) {
    const db = lay_ket_noi();
    const cart = this.lay_hoac_tao_gio_hang(user_id);
    db.prepare('DELETE FROM chi_tiet_gio_hang WHERE gio_hang_id = ?').run(cart.id);
    db.prepare('UPDATE gio_hang SET ngay_cap_nhat = CURRENT_TIMESTAMP WHERE id = ?').run(cart.id);
    return this.lay_chi_tiet_gio_hang(user_id);
  }
};

module.exports = gio_hang;
