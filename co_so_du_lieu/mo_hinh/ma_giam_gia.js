// Mo hinh Ma giam gia (Voucher / Coupons - TV3 quan ly, TV2 su dung)
const { lay_ket_noi } = require('../ket_noi');

const ma_giam_gia = {
  lay_tat_ca(tuy_chon = {}) {
    const db = lay_ket_noi();
    let sql = 'SELECT * FROM ma_giam_gia WHERE 1=1';
    const params = [];

    if (tuy_chon.trang_thai) {
      sql += ' AND trang_thai = ?';
      params.push(tuy_chon.trang_thai);
    }
    sql += ' ORDER BY id DESC';
    return db.prepare(sql).all(...params);
  },

  lay_theo_id(id) {
    const db = lay_ket_noi();
    return db.prepare('SELECT * FROM ma_giam_gia WHERE id = ?').get(id);
  },

  lay_theo_ma(ma_voucher) {
    const db = lay_ket_noi();
    return db.prepare('SELECT * FROM ma_giam_gia WHERE UPPER(ma_voucher) = UPPER(?)').get(ma_voucher);
  },

  them({ ma_voucher, ten_voucher, loai_giam_gia, gia_tri, gia_tri_don_toi_thieu = 0, giam_toi_da = 0, so_luong = 100, ngay_bat_dau = null, ngay_ket_thuc = null, trang_thai = 'hoat_dong' }) {
    const db = lay_ket_noi();
    const codeUpper = ma_voucher.trim().toUpperCase();
    const exist = this.lay_theo_ma(codeUpper);
    if (exist) throw new Error('Mã giảm giá đã tồn tại trong hệ thống.');

    const stmt = db.prepare(`
      INSERT INTO ma_giam_gia (ma_voucher, ten_voucher, loai_giam_gia, gia_tri, gia_tri_don_toi_thieu, giam_toi_da, so_luong, da_su_dung, ngay_bat_dau, ngay_ket_thuc, trang_thai)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)
    `);
    const res = stmt.run(codeUpper, ten_voucher, loai_giam_gia, gia_tri, gia_tri_don_toi_thieu, giam_toi_da, so_luong, ngay_bat_dau, ngay_ket_thuc, trang_thai);
    return this.lay_theo_id(res.lastInsertRowid);
  },

  sua(id, du_lieu) {
    const db = lay_ket_noi();
    const allowed = ['ten_voucher', 'loai_giam_gia', 'gia_tri', 'gia_tri_don_toi_thieu', 'giam_toi_da', 'so_luong', 'ngay_bat_dau', 'ngay_ket_thuc', 'trang_thai'];
    const keys = Object.keys(du_lieu).filter(k => allowed.includes(k));
    if (keys.length === 0) return this.lay_theo_id(id);

    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => du_lieu[k]);
    values.push(id);

    db.prepare(`UPDATE ma_giam_gia SET ${setClause} WHERE id = ?`).run(...values);
    return this.lay_theo_id(id);
  },

  xoa(id) {
    const db = lay_ket_noi();
    const res = db.prepare('DELETE FROM ma_giam_gia WHERE id = ?').run(id);
    return res.changes > 0;
  },

  kiem_tra_hop_le(ma_voucher, tong_tien_don_hang) {
    const vc = this.lay_theo_ma(ma_voucher);
    if (!vc) {
      return { hop_le: false, ly_do: 'Mã giảm giá không tồn tại.' };
    }
    if (vc.trang_thai !== 'hoat_dong') {
      return { hop_le: false, ly_do: 'Mã giảm giá đã ngừng hoạt động.' };
    }
    if (vc.so_luong > 0 && vc.da_su_dung >= vc.so_luong) {
      return { hop_le: false, ly_do: 'Mã giảm giá đã hết lượt sử dụng.' };
    }

    const today = new Date().toISOString().split('T')[0];
    if (vc.ngay_bat_dau && today < vc.ngay_bat_dau) {
      return { hop_le: false, ly_do: 'Mã giảm giá chưa đến ngày áp dụng.' };
    }
    if (vc.ngay_ket_thuc && today > vc.ngay_ket_thuc) {
      return { hop_le: false, ly_do: 'Mã giảm giá đã hết hạn sử dụng.' };
    }

    if (tong_tien_don_hang < vc.gia_tri_don_toi_thieu) {
      return {
        hop_le: false,
        ly_do: `Đơn hàng chưa đạt giá trị tối thiểu ${new Intl.NumberFormat('vi-VN').format(vc.gia_tri_don_toi_thieu)}đ để áp dụng mã này.`
      };
    }

    // Tinh so tien giam
    let so_tien_giam = 0;
    if (vc.loai_giam_gia === 'percent') {
      so_tien_giam = (tong_tien_don_hang * vc.gia_tri) / 100;
      if (vc.giam_toi_da > 0 && so_tien_giam > vc.giam_toi_da) {
        so_tien_giam = vc.giam_toi_da;
      }
    } else {
      so_tien_giam = vc.gia_tri;
    }

    if (so_tien_giam > tong_tien_don_hang) {
      so_tien_giam = tong_tien_don_hang;
    }

    return {
      hop_le: true,
      voucher: vc,
      so_tien_giam: Math.round(so_tien_giam)
    };
  },

  tang_luot_dung(ma_voucher) {
    const db = lay_ket_noi();
    db.prepare('UPDATE ma_giam_gia SET da_su_dung = da_su_dung + 1 WHERE UPPER(ma_voucher) = UPPER(?)').run(ma_voucher);
  }
};

module.exports = ma_giam_gia;
