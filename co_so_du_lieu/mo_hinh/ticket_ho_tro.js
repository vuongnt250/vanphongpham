// Mo hinh Ticket ho tro khach hang & Live Chat Admin (SmartDesk)
const { lay_ket_noi } = require('../ket_noi');

function khoi_tao_bang_neu_chua_co() {
  const db = lay_ket_noi();
  db.exec(`
    CREATE TABLE IF NOT EXISTS ticket_ho_tro (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ma_ticket TEXT UNIQUE NOT NULL,
      nguoi_dung_id INTEGER REFERENCES nguoi_dung(id) ON DELETE SET NULL,
      ho_ten TEXT NOT NULL,
      so_dien_thoai TEXT,
      email TEXT,
      tieu_de TEXT NOT NULL,
      chu_de TEXT DEFAULT 'khac',
      do_uu_tien TEXT DEFAULT 'trung_binh' CHECK (do_uu_tien IN ('thap', 'trung_binh', 'cao', 'khan_cap')),
      trang_thai TEXT DEFAULT 'cho_xu_ly' CHECK (trang_thai IN ('cho_xu_ly', 'dang_xu_ly', 'da_dong')),
      ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
      ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tin_nhan_ticket (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER NOT NULL REFERENCES ticket_ho_tro(id) ON DELETE CASCADE,
      nguoi_gui TEXT NOT NULL CHECK (nguoi_gui IN ('khach_hang', 'admin')),
      ten_nguoi_gui TEXT,
      noi_dung TEXT NOT NULL,
      thoi_gian DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_ticket_ma ON ticket_ho_tro(ma_ticket);
    CREATE INDEX IF NOT EXISTS idx_ticket_trang_thai ON ticket_ho_tro(trang_thai);
    CREATE INDEX IF NOT EXISTS idx_tin_nhan_ticket_id ON tin_nhan_ticket(ticket_id);
  `);
}

const ticket_ho_tro = {
  tao_ticket({ nguoi_dung_id = null, ho_ten, so_dien_thoai = '', email = '', tieu_de, chu_de = 'tu_van', do_uu_tien = 'trung_binh', noi_dung = '' }) {
    khoi_tao_bang_neu_chua_co();
    const db = lay_ket_noi();

    // Sinh ma ticket ngau nhien duy nhat
    let ma_ticket = '';
    let exists = true;
    while (exists) {
      const rand = Math.floor(10000 + Math.random() * 90000);
      ma_ticket = `TK-${rand}`;
      const row = db.prepare('SELECT id FROM ticket_ho_tro WHERE ma_ticket = ?').get(ma_ticket);
      if (!row) exists = false;
    }

    const stmt = db.prepare(`
      INSERT INTO ticket_ho_tro (ma_ticket, nguoi_dung_id, ho_ten, so_dien_thoai, email, tieu_de, chu_de, do_uu_tien, trang_thai)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'cho_xu_ly')
    `);
    const res = stmt.run(ma_ticket, nguoi_dung_id, ho_ten, so_dien_thoai, email, tieu_de, chu_de, do_uu_tien);
    const ticketId = Number(res.lastInsertRowid);

    // Them tin nhan dau tien vao cuoc tro chuyen
    if (noi_dung && noi_dung.trim()) {
      db.prepare(`
        INSERT INTO tin_nhan_ticket (ticket_id, nguoi_gui, ten_nguoi_gui, noi_dung)
        VALUES (?, 'khach_hang', ?, ?)
      `).run(ticketId, ho_ten, noi_dung.trim());
    }

    return this.lay_theo_id(ticketId);
  },

  lay_tat_ca(tuy_chon = {}) {
    khoi_tao_bang_neu_chua_co();
    const db = lay_ket_noi();
    let sql = `
      SELECT t.*, 
        (SELECT COUNT(*) FROM tin_nhan_ticket WHERE ticket_id = t.id) AS so_tin_nhan,
        (SELECT noi_dung FROM tin_nhan_ticket WHERE ticket_id = t.id ORDER BY id DESC LIMIT 1) AS tin_nhan_cuoi,
        (SELECT thoi_gian FROM tin_nhan_ticket WHERE ticket_id = t.id ORDER BY id DESC LIMIT 1) AS thoi_gian_tin_cuoi
      FROM ticket_ho_tro t
      WHERE 1=1
    `;
    const params = [];

    if (tuy_chon.trang_thai && tuy_chon.trang_thai !== 'tat_ca') {
      sql += ' AND t.trang_thai = ?';
      params.push(tuy_chon.trang_thai);
    }

    if (tuy_chon.tim_kiem) {
      sql += ' AND (t.ma_ticket LIKE ? OR t.ho_ten LIKE ? OR t.so_dien_thoai LIKE ? OR t.tieu_de LIKE ?)';
      const k = `%${tuy_chon.tim_kiem.trim()}%`;
      params.push(k, k, k, k);
    }

    sql += " ORDER BY CASE t.trang_thai WHEN 'cho_xu_ly' THEN 1 WHEN 'dang_xu_ly' THEN 2 ELSE 3 END, t.ngay_cap_nhat DESC";

    if (tuy_chon.limit) {
      sql += ' LIMIT ?';
      params.push(Number(tuy_chon.limit));
      if (tuy_chon.offset) {
        sql += ' OFFSET ?';
        params.push(Number(tuy_chon.offset));
      }
    }

    return db.prepare(sql).all(...params);
  },

  lay_danh_sach_khach({ nguoi_dung_id = null, danh_sach_ma = [], so_dien_thoai = '', email = '' }) {
    khoi_tao_bang_neu_chua_co();
    const db = lay_ket_noi();

    let sql = `
      SELECT t.*, 
        (SELECT COUNT(*) FROM tin_nhan_ticket WHERE ticket_id = t.id) AS so_tin_nhan,
        (SELECT noi_dung FROM tin_nhan_ticket WHERE ticket_id = t.id ORDER BY id DESC LIMIT 1) AS tin_nhan_cuoi,
        (SELECT thoi_gian FROM tin_nhan_ticket WHERE ticket_id = t.id ORDER BY id DESC LIMIT 1) AS thoi_gian_tin_cuoi
      FROM ticket_ho_tro t
      WHERE 1=0
    `;
    const params = [];

    if (nguoi_dung_id) {
      sql += ' OR t.nguoi_dung_id = ?';
      params.push(Number(nguoi_dung_id));
    }

    if (Array.isArray(danh_sach_ma) && danh_sach_ma.length > 0) {
      const placeholders = danh_sach_ma.map(() => '?').join(',');
      sql += ` OR t.ma_ticket IN (${placeholders})`;
      params.push(...danh_sach_ma);
    }

    if (so_dien_thoai && so_dien_thoai.trim()) {
      sql += ' OR t.so_dien_thoai = ?';
      params.push(so_dien_thoai.trim());
    }

    if (email && email.trim()) {
      sql += ' OR t.email = ?';
      params.push(email.trim());
    }

    if (params.length === 0) {
      return [];
    }

    sql += " ORDER BY t.ngay_cap_nhat DESC, t.id DESC LIMIT 50";

    return db.prepare(sql).all(...params);
  },

  lay_theo_id(id) {
    khoi_tao_bang_neu_chua_co();
    const db = lay_ket_noi();
    const ticket = db.prepare('SELECT * FROM ticket_ho_tro WHERE id = ?').get(id);
    if (!ticket) return null;

    const tin_nhan = db.prepare(`
      SELECT * FROM tin_nhan_ticket 
      WHERE ticket_id = ? 
      ORDER BY id ASC
    `).all(id);

    return {
      ...ticket,
      tin_nhan
    };
  },

  lay_theo_ma(ma_ticket) {
    khoi_tao_bang_neu_chua_co();
    const db = lay_ket_noi();
    const ticket = db.prepare('SELECT * FROM ticket_ho_tro WHERE ma_ticket = ?').get(ma_ticket);
    if (!ticket) return null;

    const tin_nhan = db.prepare(`
      SELECT * FROM tin_nhan_ticket 
      WHERE ticket_id = ? 
      ORDER BY id ASC
    `).all(ticket.id);

    return {
      ...ticket,
      tin_nhan
    };
  },

  them_tin_nhan(ticket_id, { nguoi_gui, ten_nguoi_gui, noi_dung }) {
    khoi_tao_bang_neu_chua_co();
    const db = lay_ket_noi();
    const stmt = db.prepare(`
      INSERT INTO tin_nhan_ticket (ticket_id, nguoi_gui, ten_nguoi_gui, noi_dung)
      VALUES (?, ?, ?, ?)
    `);
    const res = stmt.run(ticket_id, nguoi_gui, ten_nguoi_gui || (nguoi_gui === 'admin' ? 'Hỗ trợ SmartDesk' : 'Khách hàng'), noi_dung.trim());

    // Cap nhat thoi gian cap nhat va trang thai cua ticket
    const now = new Date().toISOString();
    if (nguoi_gui === 'admin') {
      db.prepare(`
        UPDATE ticket_ho_tro 
        SET ngay_cap_nhat = ?, trang_thai = CASE WHEN trang_thai = 'cho_xu_ly' THEN 'dang_xu_ly' ELSE trang_thai END
        WHERE id = ?
      `).run(now, ticket_id);
    } else {
      db.prepare(`
        UPDATE ticket_ho_tro 
        SET ngay_cap_nhat = ?, trang_thai = CASE WHEN trang_thai = 'da_dong' THEN 'dang_xu_ly' ELSE trang_thai END
        WHERE id = ?
      `).run(now, ticket_id);
    }

    return db.prepare('SELECT * FROM tin_nhan_ticket WHERE id = ?').get(res.lastInsertRowid);
  },

  cap_nhat_trang_thai(id, trang_thai) {
    khoi_tao_bang_neu_chua_co();
    const db = lay_ket_noi();
    const valid = ['cho_xu_ly', 'dang_xu_ly', 'da_dong'];
    if (!valid.includes(trang_thai)) {
      throw new Error(`Trạng thái "${trang_thai}" không hợp lệ.`);
    }

    const now = new Date().toISOString();
    db.prepare('UPDATE ticket_ho_tro SET trang_thai = ?, ngay_cap_nhat = ? WHERE id = ?').run(trang_thai, now, id);
    return this.lay_theo_id(id);
  },

  xoa_ticket(id) {
    khoi_tao_bang_neu_chua_co();
    const db = lay_ket_noi();
    const res = db.prepare('DELETE FROM ticket_ho_tro WHERE id = ?').run(id);
    return res.changes > 0;
  },

  thong_ke() {
    khoi_tao_bang_neu_chua_co();
    const db = lay_ket_noi();
    const rows = db.prepare(`
      SELECT 
        COUNT(*) AS tong_so,
        SUM(CASE WHEN trang_thai = 'cho_xu_ly' THEN 1 ELSE 0 END) AS cho_xu_ly,
        SUM(CASE WHEN trang_thai = 'dang_xu_ly' THEN 1 ELSE 0 END) AS dang_xu_ly,
        SUM(CASE WHEN trang_thai = 'da_dong' THEN 1 ELSE 0 END) AS da_dong
      FROM ticket_ho_tro
    `).get();

    return {
      tong_so: rows?.tong_so || 0,
      cho_xu_ly: rows?.cho_xu_ly || 0,
      dang_xu_ly: rows?.dang_xu_ly || 0,
      da_dong: rows?.da_dong || 0
    };
  }
};

module.exports = ticket_ho_tro;
