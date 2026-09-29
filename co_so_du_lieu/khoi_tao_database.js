// Script khoi tao toan bo co so du lieu SQLite cho ca 3 thanh vien tu database.json
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { khoi_tao_ket_noi } = require('./ket_noi');

function chay_khoi_tao(duong_dan_db) {
  const db = khoi_tao_ket_noi(duong_dan_db);
  
  db.exec('PRAGMA foreign_keys = OFF;');

  // 1. Danh sach tao tat ca cac bang
  const danh_sach_file_tao_bang = [
    path.join(__dirname, 'tao_bang', 'tao_bang_danh_muc.sql'),
    path.join(__dirname, 'tao_bang', 'tao_bang_nha_cung_cap.sql'),
    path.join(__dirname, 'tao_bang', 'tao_bang_san_pham.sql'),
    path.join(__dirname, 'tao_bang', 'tao_bang_hinh_anh_san_pham.sql'),
    path.join(__dirname, 'tao_bang', 'tao_bang_nguoi_dung.sql'),
    path.join(__dirname, 'tao_bang', 'tao_bang_dia_chi.sql'),
    path.join(__dirname, 'tao_bang', 'tao_bang_gio_hang.sql'),
    path.join(__dirname, 'tao_bang', 'tao_bang_ma_giam_gia.sql'),
    path.join(__dirname, 'tao_bang', 'tao_bang_don_hang.sql'),
    path.join(__dirname, 'tao_bang', 'tao_bang_thanh_toan.sql'),
    path.join(__dirname, 'tao_bang', 'tao_bang_danh_gia.sql'),
    path.join(__dirname, 'tao_bang', 'tao_bang_banner.sql'),
    path.join(__dirname, 'tao_bang', 'tao_bang_cai_dat.sql'),
    path.join(__dirname, 'tao_bang', 'tao_bang_nhat_ky_kho.sql'),
    path.join(__dirname, 'tao_bang', 'tao_bang_ticket_ho_tro.sql')
  ];

  for (const file of danh_sach_file_tao_bang) {
    if (fs.existsSync(file)) {
      const sql = fs.readFileSync(file, 'utf8');
      db.exec(sql);
    }
  }

  // Tu dong cap nhat cot yeu_cau_doi_mat_khau neu chua ton tai tren database SQLite cu
  try {
    const cols = db.prepare("PRAGMA table_info(nguoi_dung)").all();
    const hasCol = cols.some(c => c.name === 'yeu_cau_doi_mat_khau');
    if (!hasCol) {
      db.exec('ALTER TABLE nguoi_dung ADD COLUMN yeu_cau_doi_mat_khau INTEGER DEFAULT 0;');
    }
  } catch (e) {}

  // 2. Xoa sach du lieu cu truoc khi nap lai (Idempotent)
  const bang_can_xoa = [
    'tin_nhan_ticket', 'ticket_ho_tro',
    'nhat_ky_kho', 'thanh_toan', 'chi_tiet_don_hang', 'don_hang',
    'chi_tiet_gio_hang', 'gio_hang', 'dia_chi', 'danh_gia',
    'hinh_anh_san_pham', 'san_pham', 'nha_cung_cap', 'danh_muc',
    'ma_giam_gia', 'banner', 'cai_dat', 'nguoi_dung'
  ];
  for (const bang of bang_can_xoa) {
    try {
      db.exec(`DELETE FROM ${bang};`);
    } catch (e) {
      // Bo qua neu bang chua ton tai
    }
  }

  // 3. Nap du lieu tu database.json
  const duong_dan_json = path.join(__dirname, '..', 'database.json');
  if (fs.existsSync(duong_dan_json)) {
    const rawData = fs.readFileSync(duong_dan_json, 'utf8');
    const jsonDb = JSON.parse(rawData);

    // Seed danh_muc
    if (Array.isArray(jsonDb.categories)) {
      const stmt = db.prepare(`
        INSERT INTO danh_muc (id, ten_danh_muc, duong_dan_danh_muc, mo_ta, trang_thai)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const dm of jsonDb.categories) {
        const trang_thai = dm.status === 'active' ? 'hoat_dong' : (dm.trang_thai || dm.status || 'hoat_dong');
        stmt.run(
          dm.id,
          dm.name || dm.ten_danh_muc,
          dm.slug || dm.duong_dan_danh_muc,
          dm.description || dm.mo_ta || null,
          trang_thai
        );
      }
    }

    // Seed nha_cung_cap
    if (Array.isArray(jsonDb.suppliers)) {
      const stmt = db.prepare(`
        INSERT INTO nha_cung_cap (id, ten_nha_cung_cap, so_dien_thoai, email, dia_chi, trang_thai)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      for (const ncc of jsonDb.suppliers) {
        stmt.run(
          ncc.id,
          ncc.name || ncc.ten_nha_cung_cap,
          ncc.phone || ncc.so_dien_thoai || null,
          ncc.email || null,
          ncc.address || ncc.dia_chi || null,
          ncc.status === 'active' ? 'hoat_dong' : (ncc.status || 'hoat_dong')
        );
      }
    }

    // Seed nguoi_dung (Voi bcrypt password hashing)
    const mat_khau_mac_dinh_hash = bcrypt.hashSync('123456', 10);
    if (Array.isArray(jsonDb.users)) {
      const stmt = db.prepare(`
        INSERT INTO nguoi_dung (id, ten_dang_nhap, email, mat_khau, ho_ten, so_dien_thoai, vai_tro, trang_thai, yeu_cau_doi_mat_khau)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const u of jsonDb.users) {
        const ten_dang_nhap = u.email ? u.email.split('@')[0] : `user_${u.id}`;
        const vai_tro = u.role || 'customer';
        const yeu_cau = (vai_tro === 'admin' || vai_tro === 'staff') ? 1 : 0;
        stmt.run(
          u.id,
          ten_dang_nhap,
          u.email,
          mat_khau_mac_dinh_hash,
          u.name || u.ho_ten || 'Khách hàng',
          u.phone || u.so_dien_thoai || null,
          vai_tro,
          u.status === 'active' ? 'hoat_dong' : 'hoat_dong',
          yeu_cau
        );
      }
    }

    // Dam bao co tai khoan admin mac dinh
    const checkAdmin = db.prepare("SELECT id FROM nguoi_dung WHERE ten_dang_nhap = 'admin' OR email = 'admin@smartdesk.vn'").get();
    if (!checkAdmin) {
      db.prepare(`
        INSERT INTO nguoi_dung (ten_dang_nhap, email, mat_khau, ho_ten, so_dien_thoai, vai_tro, trang_thai, yeu_cau_doi_mat_khau)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `).run('admin', 'admin@smartdesk.vn', mat_khau_mac_dinh_hash, 'Quản trị viên Hệ thống', '0900000000', 'admin', 'hoat_dong');
    } else {
      db.prepare("UPDATE nguoi_dung SET yeu_cau_doi_mat_khau = 1 WHERE ten_dang_nhap = 'admin' OR email = 'admin@smartdesk.vn'").run();
    }

    const checkCustomer = db.prepare("SELECT id FROM nguoi_dung WHERE ten_dang_nhap = 'customer' OR email = 'customer@smartdesk.vn'").get();
    if (!checkCustomer) {
      db.prepare(`
        INSERT INTO nguoi_dung (ten_dang_nhap, email, mat_khau, ho_ten, so_dien_thoai, vai_tro, trang_thai, yeu_cau_doi_mat_khau)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0)
      `).run('customer', 'customer@smartdesk.vn', mat_khau_mac_dinh_hash, 'Khách hàng SmartDesk', '0912345678', 'customer', 'hoat_dong');
    }

    const checkStaff = db.prepare("SELECT id FROM nguoi_dung WHERE ten_dang_nhap = 'staff' OR email = 'staff@smartdesk.vn'").get();
    if (!checkStaff) {
      db.prepare(`
        INSERT INTO nguoi_dung (ten_dang_nhap, email, mat_khau, ho_ten, so_dien_thoai, vai_tro, trang_thai, yeu_cau_doi_mat_khau)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `).run('staff', 'staff@smartdesk.vn', mat_khau_mac_dinh_hash, 'Nhân viên SmartDesk', '0933333333', 'staff', 'hoat_dong');
    }

    // Seed dia_chi
    if (Array.isArray(jsonDb.addresses)) {
      const stmt = db.prepare(`
        INSERT INTO dia_chi (id, user_id, ten_nguoi_nhan, so_dien_thoai, dia_chi_chi_tiet, la_mac_dinh)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      for (const a of jsonDb.addresses) {
        stmt.run(
          a.id,
          a.userId,
          a.receiverName || a.ten_nguoi_nhan,
          a.phone || a.so_dien_thoai,
          a.address || a.dia_chi_chi_tiet,
          a.isDefault ? 1 : 0
        );
      }
    }

    // Seed san_pham
    if (Array.isArray(jsonDb.products)) {
      const stmt = db.prepare(`
        INSERT INTO san_pham (id, danh_muc_id, nha_cung_cap_id, ten_san_pham, gia, gia_goc, so_luong_ton, da_ban, don_vi_tinh, thuong_hieu, mo_ta, diem_danh_gia, so_luong_danh_gia, trang_thai, noi_bat, ngay_tao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const sp of jsonDb.products) {
        const trang_thai = sp.status === 'active' ? 'hoat_dong' : (sp.trang_thai || sp.status || 'hoat_dong');
        const noi_bat = (sp.featured || sp.isFeatured || sp.noi_bat) ? 1 : 0;
        const da_ban = sp.sold !== undefined ? sp.sold : (sp.soldCount !== undefined ? sp.soldCount : (sp.da_ban || 0));
        
        stmt.run(
          sp.id,
          sp.categoryId !== undefined ? sp.categoryId : (sp.danh_muc_id || 1),
          sp.supplierId !== undefined ? sp.supplierId : (sp.nha_cung_cap_id || null),
          sp.name || sp.ten_san_pham,
          sp.price !== undefined ? sp.price : (sp.gia || 0),
          sp.originalPrice !== undefined ? sp.originalPrice : (sp.gia_goc || null),
          sp.stock !== undefined ? sp.stock : (sp.so_luong_ton || 0),
          da_ban,
          sp.unit || sp.don_vi_tinh || 'Cái',
          sp.brand || sp.thuong_hieu || null,
          sp.description || sp.mo_ta || null,
          sp.rating !== undefined ? sp.rating : (sp.diem_danh_gia || 0),
          sp.reviewCount !== undefined ? sp.reviewCount : (sp.so_luong_danh_gia || 0),
          trang_thai,
          noi_bat,
          sp.createdAt || sp.ngay_tao || new Date().toISOString()
        );
      }
    }

    // Seed hinh_anh_san_pham
    if (Array.isArray(jsonDb.productImages)) {
      const stmt = db.prepare(`
        INSERT INTO hinh_anh_san_pham (id, san_pham_id, duong_dan_anh, la_anh_chinh)
        VALUES (?, ?, ?, ?)
      `);
      for (const ha of jsonDb.productImages) {
        const duong_dan_anh = ha.image || ha.imageUrl || ha.duong_dan_anh || '';
        const la_anh_chinh = (ha.isPrimary || ha.la_anh_chinh) ? 1 : 0;
        stmt.run(
          ha.id,
          ha.productId !== undefined ? ha.productId : (ha.san_pham_id || 1),
          duong_dan_anh,
          la_anh_chinh
        );
      }
    }

    // Seed ma_giam_gia (coupons)
    if (Array.isArray(jsonDb.coupons)) {
      const stmt = db.prepare(`
        INSERT INTO ma_giam_gia (id, ma_voucher, ten_voucher, loai_giam_gia, gia_tri, gia_tri_don_toi_thieu, giam_toi_da, so_luong, da_su_dung, ngay_bat_dau, ngay_ket_thuc, trang_thai)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const cp of jsonDb.coupons) {
        stmt.run(
          cp.id,
          cp.code || cp.ma_voucher,
          cp.name || cp.ten_voucher,
          cp.type || cp.loai_giam_gia || 'fixed',
          cp.value !== undefined ? cp.value : cp.gia_tri,
          cp.minOrder !== undefined ? cp.minOrder : (cp.gia_tri_don_toi_thieu || 0),
          cp.maxDiscount !== undefined ? cp.maxDiscount : (cp.giam_toi_da || 0),
          cp.quantity !== undefined ? cp.quantity : (cp.so_luong || 100),
          cp.used !== undefined ? cp.used : (cp.da_su_dung || 0),
          cp.startDate || cp.ngay_bat_dau || '2026-01-01',
          cp.endDate || cp.ngay_ket_thuc || '2026-12-31',
          cp.status === 'active' ? 'hoat_dong' : 'hoat_dong'
        );
      }
    }

    // Seed banner
    if (Array.isArray(jsonDb.banners)) {
      const stmt = db.prepare(`
        INSERT INTO banner (id, tieu_de, hinh_anh, lien_ket, thu_tu, trang_thai)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      let order = 1;
      for (const bn of jsonDb.banners) {
        stmt.run(
          bn.id,
          bn.title || bn.tieu_de,
          bn.image || bn.hinh_anh,
          bn.link || bn.lien_ket || '/shop',
          order++,
          bn.status === 'active' ? 'hoat_dong' : 'hoat_dong'
        );
      }
    }

    // Seed cai_dat (settings)
    if (Array.isArray(jsonDb.settings)) {
      const stmt = db.prepare(`
        INSERT INTO cai_dat (id, khoa, gia_tri, mo_ta)
        VALUES (?, ?, ?, ?)
      `);
      for (const st of jsonDb.settings) {
        stmt.run(
          st.id,
          st.key || st.khoa,
          String(st.value !== undefined ? st.value : st.gia_tri),
          st.description || st.mo_ta || null
        );
      }
    }

    // Seed danh_gia
    if (Array.isArray(jsonDb.reviews)) {
      const stmt = db.prepare(`
        INSERT INTO danh_gia (id, san_pham_id, user_id, don_hang_id, so_sao, noi_dung, trang_thai, ngay_tao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const dg of jsonDb.reviews) {
        const trang_thai = dg.status === 'approved' ? 'da_duyet' : (dg.trang_thai || dg.status || 'da_duyet');
        stmt.run(
          dg.id,
          dg.productId !== undefined ? dg.productId : (dg.san_pham_id || 1),
          dg.userId !== undefined ? dg.userId : (dg.user_id || 1),
          dg.orderId !== undefined ? dg.orderId : (dg.don_hang_id || null),
          dg.rating !== undefined ? dg.rating : (dg.so_sao || 5),
          dg.comment || dg.noi_dung || 'Danh gia san pham',
          trang_thai,
          dg.createdAt || dg.ngay_tao || new Date().toISOString()
        );
      }
    }

    // Seed don_hang & chi_tiet_don_hang
    if (Array.isArray(jsonDb.orders)) {
      const stmtOrder = db.prepare(`
        INSERT INTO don_hang (id, ma_don_hang, user_id, dia_chi_id, ten_nguoi_nhan, so_dien_thoai, dia_chi_giao_hang, ghi_chu, ma_voucher, tam_tinh, phi_van_chuyen, giam_gia, tong_thanh_toan, phuong_thuc_thanh_toan, trang_thai_thanh_toan, trang_thai, ngay_tao)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const od of jsonDb.orders) {
        const addr = (jsonDb.addresses || []).find(a => a.id === od.addressId);
        const receiverName = addr ? addr.receiverName : 'Nguyễn Minh Anh';
        const phone = addr ? addr.phone : '0912345678';
        const addressText = addr ? addr.address : 'Hà Nội';

        let stt = 'PENDING';
        if (od.status === 'delivered') stt = 'DELIVERED';
        else if (od.status === 'shipping') stt = 'SHIPPING';
        else if (od.status === 'processing') stt = 'PROCESSING';
        else if (od.status === 'confirmed') stt = 'CONFIRMED';
        else if (od.status === 'cancelled') stt = 'CANCELLED';

        const ma_don = `SD-${od.id}`;
        stmtOrder.run(
          od.id,
          ma_don,
          od.userId || 2,
          od.addressId || null,
          receiverName,
          phone,
          addressText,
          'Giao gio hanh chinh',
          od.couponId ? 'WELCOME10' : null,
          od.total || 0,
          od.shippingFee || 30000,
          od.discount || 0,
          od.finalTotal || od.total || 0,
          'COD',
          od.paymentStatus === 'paid' ? 'da_thanh_toan' : 'chua_thanh_toan',
          stt,
          od.createdAt || new Date().toISOString()
        );
      }
    }

    // Seed chi_tiet_don_hang
    if (Array.isArray(jsonDb.orderItems)) {
      const stmtItem = db.prepare(`
        INSERT INTO chi_tiet_don_hang (id, don_hang_id, san_pham_id, ten_san_pham, gia, so_luong, thanh_tien)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const oi of jsonDb.orderItems) {
        const prod = (jsonDb.products || []).find(p => p.id === oi.productId);
        const tenSp = prod ? (prod.name || prod.ten_san_pham) : `Sản phẩm #${oi.productId}`;
        const gia = oi.price || (prod ? prod.price : 0);
        const soLuong = oi.quantity || 1;
        stmtItem.run(
          oi.id,
          oi.orderId,
          oi.productId,
          tenSp,
          gia,
          soLuong,
          gia * soLuong
        );
      }
    }

    // Seed thanh_toan
    if (Array.isArray(jsonDb.payments)) {
      const stmtPay = db.prepare(`
        INSERT INTO thanh_toan (id, don_hang_id, phuong_thuc, so_tien, trang_thai, ngay_thanh_toan)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      for (const p of jsonDb.payments) {
        stmtPay.run(
          p.id,
          p.orderId,
          p.method || 'COD',
          p.amount || 0,
          p.status || 'paid',
          p.paidAt || new Date().toISOString()
        );
      }
    }

    // Seed initial nhat_ky_kho
    const spList = db.prepare('SELECT id, so_luong_ton FROM san_pham').all();
    const stmtKho = db.prepare(`
      INSERT INTO nhat_ky_kho (san_pham_id, loai_thay_doi, so_luong_thay_doi, ton_truoc, ton_sau, ghi_chu, nguoi_thuc_hien_id)
      VALUES (?, 'nhap_kho', ?, 0, ?, 'Khoi tao ton kho ban dau', 1)
    `);
    for (const s of spList) {
      if (s.so_luong_ton > 0) {
        stmtKho.run(s.id, s.so_luong_ton, s.so_luong_ton);
      }
    }
  }

  db.exec('PRAGMA foreign_keys = ON;');

  return {
    danh_muc: db.prepare('SELECT COUNT(*) as t FROM danh_muc').get().t,
    nha_cung_cap: db.prepare('SELECT COUNT(*) as t FROM nha_cung_cap').get().t,
    nguoi_dung: db.prepare('SELECT COUNT(*) as t FROM nguoi_dung').get().t,
    dia_chi: db.prepare('SELECT COUNT(*) as t FROM dia_chi').get().t,
    san_pham: db.prepare('SELECT COUNT(*) as t FROM san_pham').get().t,
    hinh_anh: db.prepare('SELECT COUNT(*) as t FROM hinh_anh_san_pham').get().t,
    ma_giam_gia: db.prepare('SELECT COUNT(*) as t FROM ma_giam_gia').get().t,
    don_hang: db.prepare('SELECT COUNT(*) as t FROM don_hang').get().t,
    chi_tiet_don_hang: db.prepare('SELECT COUNT(*) as t FROM chi_tiet_don_hang').get().t,
    thanh_toan: db.prepare('SELECT COUNT(*) as t FROM thanh_toan').get().t,
    banner: db.prepare('SELECT COUNT(*) as t FROM banner').get().t,
    cai_dat: db.prepare('SELECT COUNT(*) as t FROM cai_dat').get().t,
    nhat_ky_kho: db.prepare('SELECT COUNT(*) as t FROM nhat_ky_kho').get().t
  };
}

if (require.main === module) {
  const kq = chay_khoi_tao();
  console.log('Khoi tao thanh cong co so du lieu SQLite toan dien cho ca 3 thanh vien:', kq);
}

module.exports = {
  chay_khoi_tao
};