// Mo hinh Nhat ky kho & Quan ly ton kho (TV3)
const { lay_ket_noi } = require('../ket_noi');

const nhat_ky_kho = {
  lay_danh_sach(tuy_chon = {}) {
    const db = lay_ket_noi();
    let sql = `
      SELECT nk.*, sp.ten_san_pham, nd.ho_ten as nguoi_thuc_hien
      FROM nhat_ky_kho nk
      JOIN san_pham sp ON nk.san_pham_id = sp.id
      LEFT JOIN nguoi_dung nd ON nk.nguoi_thuc_hien_id = nd.id
      WHERE 1=1
    `;
    const params = [];

    if (tuy_chon.san_pham_id) {
      sql += ' AND nk.san_pham_id = ?';
      params.push(tuy_chon.san_pham_id);
    }
    if (tuy_chon.loai_thay_doi) {
      sql += ' AND nk.loai_thay_doi = ?';
      params.push(tuy_chon.loai_thay_doi);
    }
    sql += ' ORDER BY nk.id DESC';

    if (tuy_chon.gioi_han) {
      sql += ' LIMIT ?';
      params.push(Number(tuy_chon.gioi_han));
    }

    return db.prepare(sql).all(...params);
  },

  // Dieu chinh ton kho truc tiep boi Admin (nhap kho / dieu chinh)
  dieu_chinh_kho({ san_pham_id, loai_thay_doi, so_luong_thay_doi, ghi_chu = '', nguoi_thuc_hien_id = 1 }) {
    if (!['nhap_kho', 'xuat_kho', 'dieu_chinh'].includes(loai_thay_doi)) {
      throw new Error(`Loại thay đổi không hợp lệ: ${loai_thay_doi}`);
    }
    const qty = Number(so_luong_thay_doi);
    if (isNaN(qty) || qty <= 0) {
      throw new Error('Số lượng thay đổi phải lớn hơn 0.');
    }

    const db = lay_ket_noi();
    db.exec('BEGIN TRANSACTION;');

    try {
      const sp = db.prepare('SELECT id, ten_san_pham, so_luong_ton FROM san_pham WHERE id = ?').get(san_pham_id);
      if (!sp) throw new Error('Không tìm thấy sản phẩm.');

      const ton_truoc = sp.so_luong_ton;
      let ton_sau = ton_truoc;

      if (loai_thay_doi === 'nhap_kho') {
        ton_sau = ton_truoc + qty;
      } else if (loai_thay_doi === 'xuat_kho') {
        if (ton_truoc < qty) throw new Error(`Số lượng xuất (${qty}) vượt quá tồn kho hiện tại (${ton_truoc}).`);
        ton_sau = ton_truoc - qty;
      } else if (loai_thay_doi === 'dieu_chinh') {
        // dieu_chinh so luong moi truc tiep
        ton_sau = qty;
      }

      db.prepare('UPDATE san_pham SET so_luong_ton = ? WHERE id = ?').run(ton_sau, san_pham_id);

      const stmtLog = db.prepare(`
        INSERT INTO nhat_ky_kho (san_pham_id, loai_thay_doi, so_luong_thay_doi, ton_truoc, ton_sau, ghi_chu, nguoi_thuc_hien_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const res = stmtLog.run(san_pham_id, loai_thay_doi, qty, ton_truoc, ton_sau, ghi_chu, nguoi_thuc_hien_id);

      db.exec('COMMIT;');
      return db.prepare('SELECT * FROM nhat_ky_kho WHERE id = ?').get(res.lastInsertRowid);
    } catch (err) {
      db.exec('ROLLBACK;');
      throw err;
    }
  }
};

module.exports = nhat_ky_kho;
