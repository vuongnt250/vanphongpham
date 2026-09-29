// Mo hinh Hinh anh san pham (TV1)
const { lay_ket_noi } = require('../ket_noi');

const hinh_anh_san_pham = {
  lay_theo_san_pham_id(san_pham_id) {
    const db = lay_ket_noi();
    return db.prepare(
      'SELECT * FROM hinh_anh_san_pham WHERE san_pham_id = ? ORDER BY la_anh_chinh DESC, id ASC'
    ).all(san_pham_id);
  },

  lay_theo_id(id) {
    const db = lay_ket_noi();
    return db.prepare('SELECT * FROM hinh_anh_san_pham WHERE id = ?').get(id);
  },

  them({ san_pham_id, duong_dan_anh, la_anh_chinh = 0 }) {
    const db = lay_ket_noi();
    if (la_anh_chinh) {
      db.prepare('UPDATE hinh_anh_san_pham SET la_anh_chinh = 0 WHERE san_pham_id = ?').run(san_pham_id);
    }
    const stmt = db.prepare(
      'INSERT INTO hinh_anh_san_pham (san_pham_id, duong_dan_anh, la_anh_chinh) VALUES (?, ?, ?)'
    );
    const result = stmt.run(san_pham_id, duong_dan_anh, la_anh_chinh ? 1 : 0);
    return this.lay_theo_id(result.lastInsertRowid);
  },

  sua(id, du_lieu) {
    const db = lay_ket_noi();
    const current = this.lay_theo_id(id);
    if (!current) return null;

    if (du_lieu.la_anh_chinh) {
      db.prepare('UPDATE hinh_anh_san_pham SET la_anh_chinh = 0 WHERE san_pham_id = ?').run(current.san_pham_id);
    }

    const cho_phep = ['duong_dan_anh', 'la_anh_chinh'];
    const keys = Object.keys(du_lieu).filter(k => cho_phep.includes(k));
    if (keys.length === 0) return current;

    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => du_lieu[k]);
    values.push(id);

    db.prepare(`UPDATE hinh_anh_san_pham SET ${setClause} WHERE id = ?`).run(...values);
    return this.lay_theo_id(id);
  },

  dat_lam_anh_chinh(san_pham_id, hinh_anh_id) {
    const db = lay_ket_noi();
    db.prepare('UPDATE hinh_anh_san_pham SET la_anh_chinh = 0 WHERE san_pham_id = ?').run(san_pham_id);
    db.prepare('UPDATE hinh_anh_san_pham SET la_anh_chinh = 1 WHERE id = ? AND san_pham_id = ?').run(hinh_anh_id, san_pham_id);
    return this.lay_theo_id(hinh_anh_id);
  },

  xoa(id) {
    const db = lay_ket_noi();
    const result = db.prepare('DELETE FROM hinh_anh_san_pham WHERE id = ?').run(id);
    return result.changes > 0;
  }
};

module.exports = hinh_anh_san_pham;
