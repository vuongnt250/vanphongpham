// Mo hinh Danh gia san pham (TV1)
// Ghi chu: user_id tham chieu toi nguoi dung thuoc TV2 quan ly
const { lay_ket_noi } = require('../ket_noi');

const danh_gia = {
  lay_theo_san_pham_id(san_pham_id, tuy_chon = {}) {
    const db = lay_ket_noi();
    let sql = 'SELECT * FROM danh_gia WHERE san_pham_id = ?';
    const params = [san_pham_id];

    if (tuy_chon.trang_thai) {
      sql += ' AND trang_thai = ?';
      params.push(tuy_chon.trang_thai);
    }

    sql += ' ORDER BY ngay_tao DESC';
    return db.prepare(sql).all(...params);
  },

  lay_theo_id(id) {
    const db = lay_ket_noi();
    return db.prepare('SELECT * FROM danh_gia WHERE id = ?').get(id);
  },

  them({ san_pham_id, user_id, don_hang_id = null, so_sao, noi_dung, trang_thai = 'da_duyet' }) {
    const db = lay_ket_noi();
    const stmt = db.prepare(`
      INSERT INTO danh_gia (san_pham_id, user_id, don_hang_id, so_sao, noi_dung, trang_thai, ngay_tao)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    const result = stmt.run(san_pham_id, user_id, don_hang_id, so_sao, noi_dung, trang_thai);
    return this.lay_theo_id(result.lastInsertRowid);
  },

  sua(id, du_lieu) {
    const db = lay_ket_noi();
    const cho_phep = ['so_sao', 'noi_dung', 'trang_thai'];
    const keys = Object.keys(du_lieu).filter(k => cho_phep.includes(k));
    if (keys.length === 0) return this.lay_theo_id(id);

    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => du_lieu[k]);
    values.push(id);

    db.prepare(`UPDATE danh_gia SET ${setClause} WHERE id = ?`).run(...values);
    return this.lay_theo_id(id);
  },

  xoa(id) {
    const db = lay_ket_noi();
    const result = db.prepare('DELETE FROM danh_gia WHERE id = ?').run(id);
    return result.changes > 0;
  },

  tinh_thong_ke(san_pham_id) {
    const db = lay_ket_noi();
    const rows = db.prepare(`
      SELECT so_sao, COUNT(*) as so_luong
      FROM danh_gia
      WHERE san_pham_id = ? AND trang_thai = 'da_duyet'
      GROUP BY so_sao
    `).all(san_pham_id);

    const chi_tiet = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let tong_so = 0;
    let tong_diem = 0;

    for (const r of rows) {
      chi_tiet[r.so_sao] = r.so_luong;
      tong_so += r.so_luong;
      tong_diem += r.so_sao * r.so_luong;
    }

    const diem_trung_binh = tong_so > 0 ? Number((tong_diem / tong_so).toFixed(1)) : 0;

    return {
      san_pham_id,
      tong_so_danh_gia: tong_so,
      diem_trung_binh,
      chi_tiet_sao: chi_tiet
    };
  }
};

module.exports = danh_gia;
