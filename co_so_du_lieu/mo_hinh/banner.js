// Mo hinh Banner quang cao (TV3)
const { lay_ket_noi } = require('../ket_noi');

const banner = {
  lay_tat_ca(tuy_chon = {}) {
    const db = lay_ket_noi();
    let sql = 'SELECT * FROM banner WHERE 1=1';
    const params = [];

    if (tuy_chon.trang_thai) {
      sql += ' AND trang_thai = ?';
      params.push(tuy_chon.trang_thai);
    }
    sql += ' ORDER BY thu_tu ASC, id DESC';
    return db.prepare(sql).all(...params);
  },

  lay_hoat_dong() {
    return this.lay_tat_ca({ trang_thai: 'hoat_dong' });
  },

  lay_theo_id(id) {
    const db = lay_ket_noi();
    return db.prepare('SELECT * FROM banner WHERE id = ?').get(id);
  },

  them({ tieu_de, hinh_anh, lien_ket = '/shop', thu_tu = 0, trang_thai = 'hoat_dong' }) {
    const db = lay_ket_noi();
    const stmt = db.prepare(`
      INSERT INTO banner (tieu_de, hinh_anh, lien_ket, thu_tu, trang_thai)
      VALUES (?, ?, ?, ?, ?)
    `);
    const res = stmt.run(tieu_de, hinh_anh, lien_ket, thu_tu, trang_thai);
    return this.lay_theo_id(res.lastInsertRowid);
  },

  sua(id, du_lieu) {
    const db = lay_ket_noi();
    const allowed = ['tieu_de', 'hinh_anh', 'lien_ket', 'thu_tu', 'trang_thai'];
    const keys = Object.keys(du_lieu).filter(k => allowed.includes(k));
    if (keys.length === 0) return this.lay_theo_id(id);

    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => du_lieu[k]);
    values.push(id);

    db.prepare(`UPDATE banner SET ${setClause} WHERE id = ?`).run(...values);
    return this.lay_theo_id(id);
  },

  xoa(id) {
    const db = lay_ket_noi();
    const res = db.prepare('DELETE FROM banner WHERE id = ?').run(id);
    return res.changes > 0;
  }
};

module.exports = banner;
