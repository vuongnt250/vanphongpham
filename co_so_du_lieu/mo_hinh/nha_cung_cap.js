// Mo hinh Nha cung cap (TV3)
const { lay_ket_noi } = require('../ket_noi');

const nha_cung_cap = {
  lay_tat_ca(tuy_chon = {}) {
    const db = lay_ket_noi();
    let sql = 'SELECT * FROM nha_cung_cap WHERE 1=1';
    const params = [];

    if (tuy_chon.trang_thai) {
      sql += ' AND trang_thai = ?';
      params.push(tuy_chon.trang_thai);
    }
    if (tuy_chon.tu_khoa) {
      sql += ' AND (ten_nha_cung_cap LIKE ? OR email LIKE ? OR so_dien_thoai LIKE ?)';
      const k = `%${tuy_chon.tu_khoa}%`;
      params.push(k, k, k);
    }
    sql += ' ORDER BY id ASC';
    return db.prepare(sql).all(...params);
  },

  lay_theo_id(id) {
    const db = lay_ket_noi();
    return db.prepare('SELECT * FROM nha_cung_cap WHERE id = ?').get(id);
  },

  them({ ten_nha_cung_cap, so_dien_thoai = '', email = '', dia_chi = '', trang_thai = 'hoat_dong' }) {
    const db = lay_ket_noi();
    const stmt = db.prepare(`
      INSERT INTO nha_cung_cap (ten_nha_cung_cap, so_dien_thoai, email, dia_chi, trang_thai)
      VALUES (?, ?, ?, ?, ?)
    `);
    const res = stmt.run(ten_nha_cung_cap, so_dien_thoai, email, dia_chi, trang_thai);
    return this.lay_theo_id(res.lastInsertRowid);
  },

  sua(id, du_lieu) {
    const db = lay_ket_noi();
    const allowed = ['ten_nha_cung_cap', 'so_dien_thoai', 'email', 'dia_chi', 'trang_thai'];
    const keys = Object.keys(du_lieu).filter(k => allowed.includes(k));
    if (keys.length === 0) return this.lay_theo_id(id);

    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => du_lieu[k]);
    values.push(id);

    db.prepare(`UPDATE nha_cung_cap SET ${setClause} WHERE id = ?`).run(...values);
    return this.lay_theo_id(id);
  },

  xoa(id) {
    const db = lay_ket_noi();
    // Kiem tra co san pham lien ket khong
    const count = db.prepare('SELECT COUNT(*) as tong FROM san_pham WHERE nha_cung_cap_id = ?').get(id).tong;
    if (count > 0) {
      throw new Error('Không thể xóa nhà cung cấp đang có sản phẩm liên kết.');
    }
    const res = db.prepare('DELETE FROM nha_cung_cap WHERE id = ?').run(id);
    return res.changes > 0;
  }
};

module.exports = nha_cung_cap;
