// Mo hinh Dia chi giao hang (TV2)
const { lay_ket_noi } = require('../ket_noi');

const dia_chi = {
  lay_theo_user(user_id) {
    const db = lay_ket_noi();
    return db.prepare('SELECT * FROM dia_chi WHERE user_id = ? ORDER BY la_mac_dinh DESC, id DESC').all(user_id);
  },

  lay_theo_id(id) {
    const db = lay_ket_noi();
    return db.prepare('SELECT * FROM dia_chi WHERE id = ?').get(id);
  },

  them({ user_id, ten_nguoi_nhan, so_dien_thoai, dia_chi_chi_tiet, la_mac_dinh = 0 }) {
    const db = lay_ket_noi();
    if (la_mac_dinh) {
      db.prepare('UPDATE dia_chi SET la_mac_dinh = 0 WHERE user_id = ?').run(user_id);
    }
    const stmt = db.prepare(`
      INSERT INTO dia_chi (user_id, ten_nguoi_nhan, so_dien_thoai, dia_chi_chi_tiet, la_mac_dinh)
      VALUES (?, ?, ?, ?, ?)
    `);
    const res = stmt.run(user_id, ten_nguoi_nhan, so_dien_thoai, dia_chi_chi_tiet, la_mac_dinh ? 1 : 0);
    return this.lay_theo_id(res.lastInsertRowid);
  },

  sua(id, user_id, du_lieu) {
    const db = lay_ket_noi();
    if (du_lieu.la_mac_dinh) {
      db.prepare('UPDATE dia_chi SET la_mac_dinh = 0 WHERE user_id = ?').run(user_id);
    }
    const allowed = ['ten_nguoi_nhan', 'so_dien_thoai', 'dia_chi_chi_tiet', 'la_mac_dinh'];
    const keys = Object.keys(du_lieu).filter(k => allowed.includes(k));
    if (keys.length === 0) return this.lay_theo_id(id);

    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => du_lieu[k]);
    values.push(id, user_id);

    db.prepare(`UPDATE dia_chi SET ${setClause} WHERE id = ? AND user_id = ?`).run(...values);
    return this.lay_theo_id(id);
  },

  dat_mac_dinh(id, user_id) {
    const db = lay_ket_noi();
    db.prepare('UPDATE dia_chi SET la_mac_dinh = 0 WHERE user_id = ?').run(user_id);
    db.prepare('UPDATE dia_chi SET la_mac_dinh = 1 WHERE id = ? AND user_id = ?').run(id, user_id);
    return this.lay_theo_id(id);
  },

  xoa(id, user_id) {
    const db = lay_ket_noi();
    const res = db.prepare('DELETE FROM dia_chi WHERE id = ? AND user_id = ?').run(id, user_id);
    return res.changes > 0;
  }
};

module.exports = dia_chi;
