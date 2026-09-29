// Mo hinh Danh muc san pham (TV1)
const { lay_ket_noi } = require('../ket_noi');

const danh_muc = {
  lay_tat_ca(tuy_chon = {}) {
    const db = lay_ket_noi();
    let sql = 'SELECT * FROM danh_muc WHERE 1=1';
    const params = [];
    if (tuy_chon.trang_thai) {
      sql += ' AND trang_thai = ?';
      params.push(tuy_chon.trang_thai);
    }
    sql += ' ORDER BY id ASC';
    return db.prepare(sql).all(...params);
  },

  lay_theo_id(id) {
    const db = lay_ket_noi();
    return db.prepare('SELECT * FROM danh_muc WHERE id = ?').get(id);
  },

  lay_theo_duong_dan(duong_dan_danh_muc) {
    const db = lay_ket_noi();
    return db.prepare('SELECT * FROM danh_muc WHERE duong_dan_danh_muc = ?').get(duong_dan_danh_muc);
  },

  them({ ten_danh_muc, duong_dan_danh_muc, mo_ta = '', trang_thai = 'hoat_dong' }) {
    const db = lay_ket_noi();
    const stmt = db.prepare(
      'INSERT INTO danh_muc (ten_danh_muc, duong_dan_danh_muc, mo_ta, trang_thai) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(ten_danh_muc, duong_dan_danh_muc, mo_ta, trang_thai);
    return this.lay_theo_id(result.lastInsertRowid);
  },

  sua(id, du_lieu) {
    const db = lay_ket_noi();
    const keys = Object.keys(du_lieu).filter(k => ['ten_danh_muc', 'duong_dan_danh_muc', 'mo_ta', 'trang_thai'].includes(k));
    if (keys.length === 0) return this.lay_theo_id(id);
    
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => du_lieu[k]);
    values.push(id);
    
    db.prepare(`UPDATE danh_muc SET ${setClause} WHERE id = ?`).run(...values);
    return this.lay_theo_id(id);
  },

  xoa(id) {
    const db = lay_ket_noi();
    // Kiem tra rang buoc co san pham khong
    const count = db.prepare('SELECT COUNT(*) as tong FROM san_pham WHERE danh_muc_id = ?').get(id).tong;
    if (count > 0) {
      throw new Error('Khong the xoa danh muc dang chua san pham.');
    }
    const result = db.prepare('DELETE FROM danh_muc WHERE id = ?').run(id);
    return result.changes > 0;
  }
};

module.exports = danh_muc;
