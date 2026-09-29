// Mo hinh Nguoi dung (TV2)
const { lay_ket_noi } = require('../ket_noi');
const bcrypt = require('bcryptjs');

const nguoi_dung = {
  lay_tat_ca(tuy_chon = {}) {
    const db = lay_ket_noi();
    let sql = 'SELECT id, ten_dang_nhap, email, ho_ten, so_dien_thoai, vai_tro, trang_thai, yeu_cau_doi_mat_khau, ngay_tao FROM nguoi_dung WHERE 1=1';
    const params = [];

    if (tuy_chon.vai_tro) {
      sql += ' AND vai_tro = ?';
      params.push(tuy_chon.vai_tro);
    }
    if (tuy_chon.tu_khoa) {
      sql += ' AND (ho_ten LIKE ? OR email LIKE ? OR ten_dang_nhap LIKE ?)';
      const k = `%${tuy_chon.tu_khoa}%`;
      params.push(k, k, k);
    }
    sql += ' ORDER BY id DESC';

    return db.prepare(sql).all(...params);
  },

  lay_theo_id(id) {
    const db = lay_ket_noi();
    return db.prepare('SELECT id, ten_dang_nhap, email, ho_ten, so_dien_thoai, vai_tro, trang_thai, yeu_cau_doi_mat_khau, ngay_tao FROM nguoi_dung WHERE id = ?').get(id);
  },

  lay_theo_email_hoac_username(tai_khoan) {
    const db = lay_ket_noi();
    return db.prepare('SELECT * FROM nguoi_dung WHERE email = ? OR ten_dang_nhap = ?').get(tai_khoan, tai_khoan);
  },

  lay_theo_email(email) {
    const db = lay_ket_noi();
    return db.prepare('SELECT * FROM nguoi_dung WHERE email = ?').get(email);
  },

  lay_theo_username(ten_dang_nhap) {
    const db = lay_ket_noi();
    return db.prepare('SELECT * FROM nguoi_dung WHERE ten_dang_nhap = ?').get(ten_dang_nhap);
  },

  them({ ten_dang_nhap, email, mat_khau, ho_ten, so_dien_thoai = '', vai_tro = 'customer' }) {
    const db = lay_ket_noi();
    const hash = bcrypt.hashSync(mat_khau, 10);
    const stmt = db.prepare(`
      INSERT INTO nguoi_dung (ten_dang_nhap, email, mat_khau, ho_ten, so_dien_thoai, vai_tro, trang_thai)
      VALUES (?, ?, ?, ?, ?, ?, 'hoat_dong')
    `);
    const result = stmt.run(ten_dang_nhap, email, hash, ho_ten, so_dien_thoai, vai_tro);
    return this.lay_theo_id(result.lastInsertRowid);
  },

  sua(id, du_lieu) {
    const db = lay_ket_noi();
    const allowed = ['ho_ten', 'so_dien_thoai', 'trang_thai', 'vai_tro'];
    const keys = Object.keys(du_lieu).filter(k => allowed.includes(k));
    if (keys.length === 0) return this.lay_theo_id(id);

    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => du_lieu[k]);
    values.push(id);

    db.prepare(`UPDATE nguoi_dung SET ${setClause} WHERE id = ?`).run(...values);
    return this.lay_theo_id(id);
  },

  doi_mat_khau(id, mat_khau_moi) {
    const db = lay_ket_noi();
    const hash = bcrypt.hashSync(mat_khau_moi, 10);
    db.prepare('UPDATE nguoi_dung SET mat_khau = ?, yeu_cau_doi_mat_khau = 0 WHERE id = ?').run(hash, id);
    return true;
  },

  kiem_tra_mat_khau(mat_khau_nhap, mat_khau_hash) {
    return bcrypt.compareSync(mat_khau_nhap, mat_khau_hash);
  }
};

module.exports = nguoi_dung;
