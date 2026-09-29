// Mo hinh Cau hinh he thong (TV3)
const { lay_ket_noi } = require('../ket_noi');

const cai_dat = {
  lay_tat_ca() {
    const db = lay_ket_noi();
    const rows = db.prepare('SELECT * FROM cai_dat').all();
    const map = {};
    for (const r of rows) {
      map[r.khoa] = r.gia_tri;
    }
    return { danh_sach: rows, ban_do: map };
  },

  lay_theo_khoa(khoa) {
    const db = lay_ket_noi();
    const row = db.prepare('SELECT * FROM cai_dat WHERE khoa = ?').get(khoa);
    return row ? row.gia_tri : null;
  },

  cap_nhat(khoa, gia_tri, mo_ta = null) {
    const db = lay_ket_noi();
    const exist = db.prepare('SELECT id FROM cai_dat WHERE khoa = ?').get(khoa);
    if (exist) {
      db.prepare('UPDATE cai_dat SET gia_tri = ?, mo_ta = COALESCE(?, mo_ta) WHERE khoa = ?').run(String(gia_tri), mo_ta, khoa);
    } else {
      db.prepare('INSERT INTO cai_dat (khoa, gia_tri, mo_ta) VALUES (?, ?, ?)').run(khoa, String(gia_tri), mo_ta);
    }
    return this.lay_theo_khoa(khoa);
  }
};

module.exports = cai_dat;
