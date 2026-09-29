// Mo hinh Thanh toan (TV2)
const { lay_ket_noi } = require('../ket_noi');

const thanh_toan = {
  lay_theo_id(id) {
    const db = lay_ket_noi();
    return db.prepare('SELECT * FROM thanh_toan WHERE id = ?').get(id);
  },

  lay_theo_don_hang(don_hang_id) {
    const db = lay_ket_noi();
    return db.prepare('SELECT * FROM thanh_toan WHERE don_hang_id = ?').get(don_hang_id);
  },

  cap_nhat_trang_thai(don_hang_id, trang_thai, ma_giao_dich = null) {
    const db = lay_ket_noi();
    const pay = this.lay_theo_don_hang(don_hang_id);
    if (!pay) throw new Error('Không tìm thấy bản ghi thanh toán của đơn hàng.');

    db.prepare(`
      UPDATE thanh_toan 
      SET trang_thai = ?, ma_giao_dich = COALESCE(?, ma_giao_dich), ngay_thanh_toan = CURRENT_TIMESTAMP 
      WHERE don_hang_id = ?
    `).run(trang_thai, ma_giao_dich, don_hang_id);

    if (trang_thai === 'paid') {
      db.prepare("UPDATE don_hang SET trang_thai_thanh_toan = 'da_thanh_toan' WHERE id = ?").run(don_hang_id);
    }

    return this.lay_theo_don_hang(don_hang_id);
  },

  xu_ly_webhook_giao_dich({ don_hang_id, trang_thai = 'paid', ma_giao_dich = null }) {
    const db = lay_ket_noi();
    const pay = this.lay_theo_don_hang(don_hang_id);
    if (!pay) return { success: false, code: 'NOT_FOUND', message: 'Không tìm thấy bản ghi thanh toán cho đơn hàng.' };

    if (pay.trang_thai === 'paid') {
      return { success: true, code: 'ALREADY_PAID', message: 'Giao dịch đã được ghi nhận trước đó (Idempotent).', du_lieu: pay };
    }

    db.exec('BEGIN TRANSACTION;');
    try {
      db.prepare(`
        UPDATE thanh_toan 
        SET trang_thai = ?, ma_giao_dich = COALESCE(?, ma_giao_dich), ngay_thanh_toan = CURRENT_TIMESTAMP 
        WHERE don_hang_id = ?
      `).run(trang_thai, ma_giao_dich, don_hang_id);

      if (trang_thai === 'paid') {
        db.prepare("UPDATE don_hang SET trang_thai_thanh_toan = 'da_thanh_toan' WHERE id = ?").run(don_hang_id);
      }

      db.exec('COMMIT;');
    } catch (txErr) {
      db.exec('ROLLBACK;');
      throw txErr;
    }
    return {
      success: true,
      code: 'PROCESSED',
      message: 'Xử lý thanh toán thành công qua Webhook.',
      du_lieu: this.lay_theo_don_hang(don_hang_id)
    };
  }
};

module.exports = thanh_toan;
