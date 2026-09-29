-- Bang nha cung cap (TV3 quan ly)
CREATE TABLE IF NOT EXISTS nha_cung_cap (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ten_nha_cung_cap VARCHAR(255) NOT NULL,
  so_dien_thoai VARCHAR(20),
  email VARCHAR(100),
  dia_chi TEXT,
  trang_thai VARCHAR(50) DEFAULT 'hoat_dong',
  ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_nha_cung_cap_trang_thai ON nha_cung_cap(trang_thai);
