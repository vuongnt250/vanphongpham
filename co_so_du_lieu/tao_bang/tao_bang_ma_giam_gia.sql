-- Bang ma giam gia / voucher (TV3 quan ly, TV2 su dung khi dat hang)
CREATE TABLE IF NOT EXISTS ma_giam_gia (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ma_voucher VARCHAR(50) UNIQUE NOT NULL,
  ten_voucher VARCHAR(255) NOT NULL,
  loai_giam_gia VARCHAR(20) NOT NULL CHECK (loai_giam_gia IN ('percent', 'fixed')),
  gia_tri DECIMAL(12, 2) NOT NULL CHECK (gia_tri > 0),
  gia_tri_don_toi_thieu DECIMAL(12, 2) DEFAULT 0,
  giam_toi_da DECIMAL(12, 2) DEFAULT 0,
  so_luong INTEGER DEFAULT 0,
  da_su_dung INTEGER DEFAULT 0,
  ngay_bat_dau DATE,
  ngay_ket_thuc DATE,
  trang_thai VARCHAR(50) DEFAULT 'hoat_dong',
  ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ma_giam_gia_code ON ma_giam_gia(ma_voucher);
CREATE INDEX IF NOT EXISTS idx_ma_giam_gia_trang_thai ON ma_giam_gia(trang_thai);
