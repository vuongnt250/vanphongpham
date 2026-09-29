-- Bang banner quang cao (TV3 quan ly)
CREATE TABLE IF NOT EXISTS banner (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tieu_de VARCHAR(255) NOT NULL,
  hinh_anh VARCHAR(255) NOT NULL,
  lien_ket VARCHAR(255),
  thu_tu INTEGER DEFAULT 0,
  trang_thai VARCHAR(50) DEFAULT 'hoat_dong',
  ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_banner_trang_thai ON banner(trang_thai);
