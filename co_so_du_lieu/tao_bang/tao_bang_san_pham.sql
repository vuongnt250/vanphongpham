-- Bang san pham (TV1 quan ly)
CREATE TABLE IF NOT EXISTS san_pham (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  danh_muc_id INTEGER NOT NULL,
  nha_cung_cap_id INTEGER,
  ten_san_pham VARCHAR(255) NOT NULL,
  gia DECIMAL(12, 2) NOT NULL CHECK (gia >= 0),
  gia_goc DECIMAL(12, 2) CHECK (gia_goc >= 0),
  so_luong_ton INTEGER DEFAULT 0 CHECK (so_luong_ton >= 0),
  da_ban INTEGER DEFAULT 0 CHECK (da_ban >= 0),
  don_vi_tinh VARCHAR(50),
  thuong_hieu VARCHAR(100),
  mo_ta TEXT,
  diem_danh_gia DECIMAL(3, 2) DEFAULT 0 CHECK (diem_danh_gia >= 0 AND diem_danh_gia <= 5),
  so_luong_danh_gia INTEGER DEFAULT 0 CHECK (so_luong_danh_gia >= 0),
  trang_thai VARCHAR(50) DEFAULT 'hoat_dong',
  noi_bat INTEGER DEFAULT 0,
  ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (danh_muc_id) REFERENCES danh_muc(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_san_pham_danh_muc_id ON san_pham(danh_muc_id);
CREATE INDEX IF NOT EXISTS idx_san_pham_trang_thai ON san_pham(trang_thai);
CREATE INDEX IF NOT EXISTS idx_san_pham_gia ON san_pham(gia);
CREATE INDEX IF NOT EXISTS idx_san_pham_thuong_hieu ON san_pham(thuong_hieu);
CREATE INDEX IF NOT EXISTS idx_san_pham_noi_bat ON san_pham(noi_bat);
