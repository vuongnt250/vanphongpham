// Mo hinh San pham (TV1)
const { lay_ket_noi } = require('../ket_noi');

const san_pham = {
  lay_danh_sach(bo_loc = {}) {
    const db = lay_ket_noi();
    let sql = `
      SELECT sp.*, dm.ten_danh_muc, dm.duong_dan_danh_muc,
             (SELECT duong_dan_anh FROM hinh_anh_san_pham WHERE san_pham_id = sp.id AND la_anh_chinh = 1 LIMIT 1) as anh_chinh
      FROM san_pham sp
      JOIN danh_muc dm ON sp.danh_muc_id = dm.id
      WHERE 1=1
    `;
    const params = [];

    if (bo_loc.danh_muc_id) {
      sql += ' AND sp.danh_muc_id = ?';
      params.push(bo_loc.danh_muc_id);
    }

    if (bo_loc.tu_khoa) {
      sql += ' AND (sp.ten_san_pham LIKE ? OR sp.mo_ta LIKE ? OR sp.thuong_hieu LIKE ?)';
      const keyword = `%${bo_loc.tu_khoa}%`;
      params.push(keyword, keyword, keyword);
    }

    if (bo_loc.gia_tu !== undefined && bo_loc.gia_tu !== null && bo_loc.gia_tu !== '' && !isNaN(Number(bo_loc.gia_tu))) {
      sql += ' AND sp.gia >= ?';
      params.push(Number(bo_loc.gia_tu));
    }

    if (bo_loc.gia_den !== undefined && bo_loc.gia_den !== null && bo_loc.gia_den !== '' && !isNaN(Number(bo_loc.gia_den))) {
      sql += ' AND sp.gia <= ?';
      params.push(Number(bo_loc.gia_den));
    }

    if (bo_loc.thuong_hieu) {
      sql += ' AND sp.thuong_hieu = ?';
      params.push(bo_loc.thuong_hieu);
    }

    if (bo_loc.trang_thai) {
      sql += ' AND sp.trang_thai = ?';
      params.push(bo_loc.trang_thai);
    }

    if (bo_loc.noi_bat !== undefined && bo_loc.noi_bat !== null && bo_loc.noi_bat !== '') {
      sql += ' AND sp.noi_bat = ?';
      params.push(Number(bo_loc.noi_bat));
    }

    // Dem tong so truoc khi phan trang
    const countSql = `SELECT COUNT(*) as tong FROM (${sql})`;
    const tong_so = db.prepare(countSql).get(...params).tong;

    // Sap xep
    switch (bo_loc.sap_xep) {
      case 'gia_tang':
        sql += ' ORDER BY sp.gia ASC';
        break;
      case 'gia_giam':
        sql += ' ORDER BY sp.gia DESC';
        break;
      case 'ban_chay':
        sql += ' ORDER BY sp.da_ban DESC';
        break;
      case 'danh_gia_cao':
        sql += ' ORDER BY sp.diem_danh_gia DESC';
        break;
      case 'moi_nhat':
      default:
        sql += ' ORDER BY sp.id DESC';
        break;
    }

    // Phan trang
    const trang = Math.max(1, Number(bo_loc.trang) || 1);
    const gioi_han = Math.max(1, Number(bo_loc.gioi_han) || 12);
    const offset = (trang - 1) * gioi_han;

    sql += ' LIMIT ? OFFSET ?';
    params.push(gioi_han, offset);

    const danh_sach = db.prepare(sql).all(...params);

    return {
      danh_sach,
      phan_trang: {
        trang_hien_tai: trang,
        gioi_han,
        tong_so_muc: tong_so,
        tong_so_trang: Math.ceil(tong_so / gioi_han)
      }
    };
  },

  lay_theo_id(id) {
    const db = lay_ket_noi();
    const sp = db.prepare(`
      SELECT sp.*, dm.ten_danh_muc, dm.duong_dan_danh_muc
      FROM san_pham sp
      JOIN danh_muc dm ON sp.danh_muc_id = dm.id
      WHERE sp.id = ?
    `).get(id);

    if (!sp) return null;

    // Lay danh sach hinh anh
    const hinh_anh = db.prepare(
      'SELECT * FROM hinh_anh_san_pham WHERE san_pham_id = ? ORDER BY la_anh_chinh DESC, id ASC'
    ).all(id);

    sp.hinh_anh = hinh_anh;
    sp.anh_chinh = hinh_anh.find(img => img.la_anh_chinh === 1)?.duong_dan_anh || (hinh_anh[0]?.duong_dan_anh || null);

    return sp;
  },

  them(du_lieu) {
    const db = lay_ket_noi();
    const stmt = db.prepare(`
      INSERT INTO san_pham (
        danh_muc_id, nha_cung_cap_id, ten_san_pham, gia, gia_goc,
        so_luong_ton, da_ban, don_vi_tinh, thuong_hieu, mo_ta,
        diem_danh_gia, so_luong_danh_gia, trang_thai, noi_bat, ngay_tao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    const result = stmt.run(
      du_lieu.danh_muc_id,
      du_lieu.nha_cung_cap_id || null,
      du_lieu.ten_san_pham,
      du_lieu.gia,
      du_lieu.gia_goc || du_lieu.gia,
      du_lieu.so_luong_ton || 0,
      du_lieu.da_ban || 0,
      du_lieu.don_vi_tinh || 'Cai',
      du_lieu.thuong_hieu || '',
      du_lieu.mo_ta || '',
      du_lieu.diem_danh_gia || 0,
      du_lieu.so_luong_danh_gia || 0,
      du_lieu.trang_thai || 'hoat_dong',
      du_lieu.noi_bat ? 1 : 0
    );

    return this.lay_theo_id(result.lastInsertRowid);
  },

  sua(id, du_lieu) {
    const db = lay_ket_noi();
    const cho_phep = [
      'danh_muc_id', 'nha_cung_cap_id', 'ten_san_pham', 'gia', 'gia_goc',
      'so_luong_ton', 'da_ban', 'don_vi_tinh', 'thuong_hieu', 'mo_ta',
      'diem_danh_gia', 'so_luong_danh_gia', 'trang_thai', 'noi_bat'
    ];
    const keys = Object.keys(du_lieu).filter(k => cho_phep.includes(k));
    if (keys.length === 0) return this.lay_theo_id(id);

    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => du_lieu[k]);
    values.push(id);

    db.prepare(`UPDATE san_pham SET ${setClause} WHERE id = ?`).run(...values);
    return this.lay_theo_id(id);
  },

  xoa(id) {
    const db = lay_ket_noi();
    const result = db.prepare('DELETE FROM san_pham WHERE id = ?').run(id);
    return result.changes > 0;
  },

  cap_nhat_danh_gia(id, diem_trung_binh, so_luong_danh_gia) {
    const db = lay_ket_noi();
    db.prepare(
      'UPDATE san_pham SET diem_danh_gia = ?, so_luong_danh_gia = ? WHERE id = ?'
    ).run(diem_trung_binh, so_luong_danh_gia, id);
    return this.lay_theo_id(id);
  },

  lay_danh_sach_thuong_hieu() {
    const db = lay_ket_noi();
    const rows = db.prepare(
      'SELECT DISTINCT thuong_hieu FROM san_pham WHERE thuong_hieu IS NOT NULL AND thuong_hieu != "" ORDER BY thuong_hieu ASC'
    ).all();
    return rows.map(r => r.thuong_hieu);
  }
};

module.exports = san_pham;
