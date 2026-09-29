-- Bang nguoi dung (TV2 quan ly)
CREATE TABLE IF NOT EXISTS nguoi_dung (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ten_dang_nhap VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  mat_khau VARCHAR(255) NOT NULL,
  ho_ten VARCHAR(150) NOT NULL,
  so_dien_thoai VARCHAR(20),
  vai_tro VARCHAR(20) DEFAULT 'customer' CHECK (vai_tro IN ('admin', 'customer', 'staff')),
  trang_thai VARCHAR(50) DEFAULT 'hoat_dong',
  yeu_cau_doi_mat_khau INTEGER DEFAULT 0,
  ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_nguoi_dung_email ON nguoi_dung(email);
CREATE INDEX IF NOT EXISTS idx_nguoi_dung_ten_dang_nhap ON nguoi_dung(ten_dang_nhap);
CREATE INDEX IF NOT EXISTS idx_nguoi_dung_vai_tro ON nguoi_dung(vai_tro);
