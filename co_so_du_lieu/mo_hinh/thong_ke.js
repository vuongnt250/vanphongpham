// Mo hinh Thong ke Dashboard thoi gian thuc tu Database SQL (TV3)
const { lay_ket_noi } = require('../ket_noi');

const thong_ke = {
  lay_tong_quan() {
    const db = lay_ket_noi();

    // 1. Tong doanh thu tu cac don hang DELIVERED hoac da thanh toan
    const doanh_thu = db.prepare(`
      SELECT COALESCE(SUM(tong_thanh_toan), 0) as tong 
      FROM don_hang 
      WHERE trang_thai = 'DELIVERED' OR trang_thai_thanh_toan = 'da_thanh_toan'
    `).get().tong;

    // 2. Tong so don hang
    const tong_don_hang = db.prepare('SELECT COUNT(*) as tong FROM don_hang').get().tong;

    // 3. Don hang theo trang thai
    const don_hang_theo_trang_thai = db.prepare(`
      SELECT trang_thai, COUNT(*) as so_luong 
      FROM don_hang 
      GROUP BY trang_thai
    `).all();

    // 4. Tong so khach hang
    const tong_khach_hang = db.prepare("SELECT COUNT(*) as tong FROM nguoi_dung WHERE vai_tro = 'customer'").get().tong;

    // 5. Tong so san pham & san pham sap het hang (< 10)
    const tong_san_pham = db.prepare('SELECT COUNT(*) as tong FROM san_pham').get().tong;
    const san_pham_sap_het = db.prepare('SELECT COUNT(*) as tong FROM san_pham WHERE so_luong_ton <= 10').get().tong;

    // 6. Top san pham ban chay nhat
    const top_ban_chay = db.prepare(`
      SELECT sp.id, sp.ten_san_pham, sp.gia, sp.da_ban, sp.so_luong_ton, dm.ten_danh_muc, ha.duong_dan_anh as anh_chinh
      FROM san_pham sp
      LEFT JOIN danh_muc dm ON sp.danh_muc_id = dm.id
      LEFT JOIN hinh_anh_san_pham ha ON sp.id = ha.san_pham_id AND ha.la_anh_chinh = 1
      ORDER BY sp.da_ban DESC
      LIMIT 5
    `).all();

    // 7. San pham can nhap kho gap
    const danh_sach_can_nhap = db.prepare(`
      SELECT sp.id, sp.ten_san_pham, sp.gia, sp.so_luong_ton, dm.ten_danh_muc
      FROM san_pham sp
      LEFT JOIN danh_muc dm ON sp.danh_muc_id = dm.id
      WHERE sp.so_luong_ton <= 10
      ORDER BY sp.so_luong_ton ASC
      LIMIT 5
    `).all();

    // 8. 5 Don hang gan day nhat
    const don_hang_moi_nhat = db.prepare(`
      SELECT id, ma_don_hang, ten_nguoi_nhan, tong_thanh_toan, trang_thai, trang_thai_thanh_toan, ngay_tao
      FROM don_hang
      ORDER BY id DESC
      LIMIT 5
    `).all();

    return {
      tong_doanh_thu: doanh_thu,
      tong_don_hang,
      don_hang_theo_trang_thai,
      tong_khach_hang,
      tong_san_pham,
      san_pham_sap_het,
      top_ban_chay,
      danh_sach_can_nhap,
      don_hang_moi_nhat
    };
  }
};

module.exports = thong_ke;
