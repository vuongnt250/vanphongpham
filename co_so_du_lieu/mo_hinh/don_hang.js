// Mo hinh Don hang va chi tiet don hang voi Database Transaction (TV2 + TV3)
const { lay_ket_noi } = require('../ket_noi');
const ma_giam_gia = require('./ma_giam_gia');

const TRANG_THAI_HOP_LE = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED'];

// Bang chuyen trang thai hop le (State Machine)
const CHUYEN_TRANG_THAI_HOP_LE = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPING', 'CANCELLED'],
  SHIPPING: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [], // Trang thai cuoi cung khong the chuyen tiep
  CANCELLED: []  // Da huy thi khong the khoi phuc
};

const don_hang = {
  lay_tat_ca(tuy_chon = {}) {
    const db = lay_ket_noi();
    let sql = 'SELECT * FROM don_hang WHERE 1=1';
    const params = [];

    if (tuy_chon.trang_thai) {
      sql += ' AND trang_thai = ?';
      params.push(tuy_chon.trang_thai);
    }
    if (tuy_chon.user_id) {
      sql += ' AND user_id = ?';
      params.push(tuy_chon.user_id);
    }
    if (tuy_chon.tu_khoa) {
      sql += ' AND (ma_don_hang LIKE ? OR ten_nguoi_nhan LIKE ? OR so_dien_thoai LIKE ?)';
      const k = `%${tuy_chon.tu_khoa}%`;
      params.push(k, k, k);
    }
    sql += ' ORDER BY id DESC';

    if (tuy_chon.gioi_han) {
      sql += ' LIMIT ?';
      params.push(Number(tuy_chon.gioi_han));
    }

    const danh_sach = db.prepare(sql).all(...params);
    return danh_sach.map(d => this.lay_theo_id(d.id));
  },

  lay_theo_id(id) {
    const db = lay_ket_noi();
    const order = db.prepare('SELECT * FROM don_hang WHERE id = ?').get(id);
    if (!order) return null;

    const items = db.prepare(`
      SELECT ct.*, sp.don_vi_tinh, ha.duong_dan_anh as anh_chinh
      FROM chi_tiet_don_hang ct
      LEFT JOIN san_pham sp ON ct.san_pham_id = sp.id
      LEFT JOIN hinh_anh_san_pham ha ON sp.id = ha.san_pham_id AND ha.la_anh_chinh = 1
      WHERE ct.don_hang_id = ?
    `).all(id);

    const payments = db.prepare('SELECT * FROM thanh_toan WHERE don_hang_id = ?').all(id);

    return {
      ...order,
      danh_sach_san_pham: items,
      thanh_toan: payments.length > 0 ? payments[0] : null
    };
  },

  lay_theo_ma(ma_don_hang) {
    const db = lay_ket_noi();
    const order = db.prepare('SELECT id FROM don_hang WHERE ma_don_hang = ?').get(ma_don_hang);
    if (!order) return null;
    return this.lay_theo_id(order.id);
  },

  lay_theo_user(user_id) {
    const db = lay_ket_noi();
    const danh_sach = db.prepare('SELECT id FROM don_hang WHERE user_id = ? ORDER BY id DESC').all(user_id);
    return danh_sach.map(d => this.lay_theo_id(d.id));
  },

  // TAO DON HANG THUC TE TRONG TRANSACTION:
  // 1. Kiem tra nguoi dung
  // 2. Lay gia va ton kho truc tiep tu DB (khong tin gia client)
  // 3. Kiem tra voucher server side
  // 4. Tru ton kho + ghi log nhat ky kho
  // 5. Luu don hang + chi tiet don hang + tao payment record
  // 6. Xoa sach gio hang
  tao_don_hang({
    user_id,
    dia_chi_id = null,
    ten_nguoi_nhan,
    so_dien_thoai,
    dia_chi_giao_hang,
    ghi_chu = '',
    ma_voucher = null,
    phuong_thuc_thanh_toan = 'COD',
    danh_sach_san_pham = [] // [{ san_pham_id, so_luong }]
  }) {
    if (!danh_sach_san_pham || danh_sach_san_pham.length === 0) {
      throw new Error('Đơn hàng phải có ít nhất 1 sản phẩm.');
    }
    if (!ten_nguoi_nhan || !so_dien_thoai || !dia_chi_giao_hang) {
      throw new Error('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng.');
    }

    const db = lay_ket_noi();

    // Bat dau Transaction thu cong trong SQLite
    db.exec('BEGIN TRANSACTION;');

    try {
      let tam_tinh = 0;
      const verifiedItems = [];

      // 1. Verify san pham & ton kho tu database
      for (const item of danh_sach_san_pham) {
        const spId = Number(item.san_pham_id || (item.san_pham && item.san_pham.id));
        const qty = Number(item.so_luong || 1);

        if (qty <= 0) {
          throw new Error(`Số lượng sản phẩm không hợp lệ: ${qty}`);
        }

        const sp = db.prepare('SELECT id, ten_san_pham, gia, so_luong_ton, trang_thai FROM san_pham WHERE id = ?').get(spId);
        if (!sp) {
          throw new Error(`Sản phẩm với ID ${spId} không tồn tại.`);
        }
        if (sp.trang_thai !== 'hoat_dong') {
          throw new Error(`Sản phẩm "${sp.ten_san_pham}" hiện đang ngừng kinh doanh.`);
        }
        if (sp.so_luong_ton < qty) {
          throw new Error(`Sản phẩm "${sp.ten_san_pham}" chỉ còn ${sp.so_luong_ton} sản phẩm trong kho (bạn yêu cầu ${qty}).`);
        }

        const thanh_tien = sp.gia * qty;
        tam_tinh += thanh_tien;

        verifiedItems.push({
          san_pham_id: sp.id,
          ten_san_pham: sp.ten_san_pham,
          gia: sp.gia,
          so_luong: qty,
          thanh_tien,
          ton_truoc: sp.so_luong_ton
        });
      }

      // 2. Kiem tra voucher server-side
      let giam_gia = 0;
      let voucher_hop_le = null;
      if (ma_voucher && ma_voucher.trim()) {
        const kqVoucher = ma_giam_gia.kiem_tra_hop_le(ma_voucher.trim(), tam_tinh);
        if (kqVoucher.hop_le) {
          giam_gia = kqVoucher.so_tien_giam;
          voucher_hop_le = kqVoucher.voucher.ma_voucher;
          // Tang luot dung
          ma_giam_gia.tang_luot_dung(voucher_hop_le);
        }
      }

      // 3. Tinh phi van chuyen
      const phi_van_chuyen = tam_tinh >= 300000 ? 0 : 30000;
      const tong_thanh_toan = Math.max(0, tam_tinh + phi_van_chuyen - giam_gia);

      // 4. Tao ma don hang duy nhat
      const ma_don_hang = `SD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

      // 5. Insert Don hang
      const stmtOrder = db.prepare(`
        INSERT INTO don_hang (
          ma_don_hang, user_id, dia_chi_id, ten_nguoi_nhan, so_dien_thoai, dia_chi_giao_hang,
          ghi_chu, ma_voucher, tam_tinh, phi_van_chuyen, giam_gia, tong_thanh_toan,
          phuong_thuc_thanh_toan, trang_thai_thanh_toan, trang_thai
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
      `);

      const resOrder = stmtOrder.run(
        ma_don_hang,
        user_id,
        dia_chi_id,
        ten_nguoi_nhan,
        so_dien_thoai,
        dia_chi_giao_hang,
        ghi_chu,
        voucher_hop_le,
        tam_tinh,
        phi_van_chuyen,
        giam_gia,
        tong_thanh_toan,
        phuong_thuc_thanh_toan,
        'chua_thanh_toan'
      );
      const don_hang_id = resOrder.lastInsertRowid;

      // 6. Insert Chi tiet don hang & Tru kho san pham + Ghi nhat ky kho
      const stmtItem = db.prepare(`
        INSERT INTO chi_tiet_don_hang (don_hang_id, san_pham_id, ten_san_pham, gia, so_luong, thanh_tien)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const stmtTruKho = db.prepare(`
        UPDATE san_pham SET so_luong_ton = so_luong_ton - ?, da_ban = da_ban + ? WHERE id = ?
      `);
      const stmtLogKho = db.prepare(`
        INSERT INTO nhat_ky_kho (san_pham_id, loai_thay_doi, so_luong_thay_doi, ton_truoc, ton_sau, ghi_chu, nguoi_thuc_hien_id)
        VALUES (?, 'ban_hang', ?, ?, ?, ?, ?)
      `);

      for (const item of verifiedItems) {
        stmtItem.run(don_hang_id, item.san_pham_id, item.ten_san_pham, item.gia, item.so_luong, item.thanh_tien);
        stmtTruKho.run(item.so_luong, item.so_luong, item.san_pham_id);

        const ton_sau = item.ton_truoc - item.so_luong;
        stmtLogKho.run(
          item.san_pham_id,
          item.so_luong,
          item.ton_truoc,
          ton_sau,
          `Bán hàng theo đơn ${ma_don_hang}`,
          user_id
        );
      }

      // 7. Tao ban ghi thanh toan
      db.prepare(`
        INSERT INTO thanh_toan (don_hang_id, phuong_thuc, so_tien, trang_thai, ngay_thanh_toan)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        don_hang_id,
        phuong_thuc_thanh_toan,
        tong_thanh_toan,
        'pending',
        null
      );

      // 8. Xoa sach gio hang cua user trong database neu co
      const cart = db.prepare('SELECT id FROM gio_hang WHERE user_id = ?').get(user_id);
      if (cart) {
        db.prepare('DELETE FROM chi_tiet_gio_hang WHERE gio_hang_id = ?').run(cart.id);
      }

      // Commit transaction
      db.exec('COMMIT;');

      return this.lay_theo_id(don_hang_id);
    } catch (err) {
      db.exec('ROLLBACK;');
      throw err;
    }
  },

  // Cap nhat trang thai don hang theo State Machine (TV3)
  cap_nhat_trang_thai(id, trang_thai_moi) {
    if (!TRANG_THAI_HOP_LE.includes(trang_thai_moi)) {
      throw new Error(`Trạng thái không hợp lệ: ${trang_thai_moi}`);
    }

    const order = this.lay_theo_id(id);
    if (!order) throw new Error('Không tìm thấy đơn hàng.');

    const hien_tai = order.trang_thai;
    if (hien_tai === trang_thai_moi) return order;

    const danh_sach_cho_phep = CHUYEN_TRANG_THAI_HOP_LE[hien_tai] || [];
    if (!danh_sach_cho_phep.includes(trang_thai_moi)) {
      throw new Error(`Không thể chuyển trạng thái từ "${hien_tai}" sang "${trang_thai_moi}".`);
    }

    const db = lay_ket_noi();
    db.exec('BEGIN TRANSACTION;');
    try {
      // Neu huy don hang -> Hoan tra ton kho san pham
      if (trang_thai_moi === 'CANCELLED') {
        const stmtHoanKho = db.prepare(`
          UPDATE san_pham SET so_luong_ton = so_luong_ton + ?, da_ban = MAX(0, da_ban - ?) WHERE id = ?
        `);
        const stmtLog = db.prepare(`
          INSERT INTO nhat_ky_kho (san_pham_id, loai_thay_doi, so_luong_thay_doi, ton_truoc, ton_sau, ghi_chu)
          VALUES (?, 'hoan_hang', ?, ?, ?, ?)
        `);

        for (const it of order.danh_sach_san_pham) {
          const spHienTai = db.prepare('SELECT so_luong_ton FROM san_pham WHERE id = ?').get(it.san_pham_id);
          const ton_truoc = spHienTai ? spHienTai.so_luong_ton : 0;
          const ton_sau = ton_truoc + it.so_luong;

          stmtHoanKho.run(it.so_luong, it.so_luong, it.san_pham_id);
          stmtLog.run(
            it.san_pham_id,
            it.so_luong,
            ton_truoc,
            ton_sau,
            `Hoàn kho do hủy đơn hàng ${order.ma_don_hang}`
          );
        }
      }

      // Neu giao thanh cong -> Cap nhat trang thai thanh toan la da_thanh_toan
      let updatePaymentClause = '';
      if (trang_thai_moi === 'DELIVERED') {
        updatePaymentClause = ", trang_thai_thanh_toan = 'da_thanh_toan'";
        db.prepare("UPDATE thanh_toan SET trang_thai = 'paid', ngay_thanh_toan = CURRENT_TIMESTAMP WHERE don_hang_id = ?").run(id);
      }

      db.prepare(`UPDATE don_hang SET trang_thai = ?, ngay_cap_nhat = CURRENT_TIMESTAMP ${updatePaymentClause} WHERE id = ?`).run(trang_thai_moi, id);

      db.exec('COMMIT;');
      return this.lay_theo_id(id);
    } catch (e) {
      db.exec('ROLLBACK;');
      throw e;
    }
  },

  // Khach hang huy don hang cua chinh minh (khi con PENDING)
  huy_don_hang_boi_user(id, user_id) {
    const order = this.lay_theo_id(id);
    if (!order) throw new Error('Không tìm thấy đơn hàng.');
    if (order.user_id !== user_id) throw new Error('Bạn không có quyền thao tác trên đơn hàng này.');

    if (order.trang_thai !== 'PENDING') {
      throw new Error('Chỉ có thể hủy đơn hàng khi ở trạng thái Chờ xác nhận (PENDING).');
    }

    return this.cap_nhat_trang_thai(id, 'CANCELLED');
  }
};

module.exports = don_hang;
