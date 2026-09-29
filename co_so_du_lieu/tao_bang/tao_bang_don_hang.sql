-- Bang don hang va chi tiet don hang (TV2 tao & theo doi, TV3 quan ly duyet trang thai)
CREATE TABLE IF NOT EXISTS don_hang (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ma_don_hang VARCHAR(50) UNIQUE NOT NULL,
  user_id INTEGER NOT NULL,
  dia_chi_id INTEGER,
  ten_nguoi_nhan VARCHAR(150) NOT NULL,
  so_dien_thoai VARCHAR(20) NOT NULL,
  dia_chi_giao_hang TEXT NOT NULL,
  ghi_chu TEXT,
  ma_voucher VARCHAR(50),
  tam_tinh DECIMAL(12, 2) NOT NULL CHECK (tam_tinh >= 0),
  phi_van_chuyen DECIMAL(12, 2) DEFAULT 0 CHECK (phi_van_chuyen >= 0),
  giam_gia DECIMAL(12, 2) DEFAULT 0 CHECK (giam_gia >= 0),
  tong_thanh_toan DECIMAL(12, 2) NOT NULL CHECK (tong_thanh_toan >= 0),
  phuong_thuc_thanh_toan VARCHAR(50) DEFAULT 'cod',
  trang_thai_thanh_toan VARCHAR(50) DEFAULT 'chua_thanh_toan' CHECK (trang_thai_thanh_toan IN ('chua_thanh_toan', 'da_thanh_toan', 'that_bai', 'hoan_tien')),
  trang_thai VARCHAR(50) DEFAULT 'PENDING' CHECK (trang_thai IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED')),
  ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES nguoi_dung(id)
);

CREATE TABLE IF NOT EXISTS chi_tiet_don_hang (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  don_hang_id INTEGER NOT NULL,
  san_pham_id INTEGER NOT NULL,
  ten_san_pham VARCHAR(255) NOT NULL,
  gia DECIMAL(12, 2) NOT NULL CHECK (gia >= 0),
  so_luong INTEGER NOT NULL CHECK (so_luong > 0),
  thanh_tien DECIMAL(12, 2) NOT NULL CHECK (thanh_tien >= 0),
  FOREIGN KEY (don_hang_id) REFERENCES don_hang(id) ON DELETE CASCADE,
  FOREIGN KEY (san_pham_id) REFERENCES san_pham(id)
);

CREATE INDEX IF NOT EXISTS idx_don_hang_user_id ON don_hang(user_id);
CREATE INDEX IF NOT EXISTS idx_don_hang_ma ON don_hang(ma_don_hang);
CREATE INDEX IF NOT EXISTS idx_don_hang_trang_thai ON don_hang(trang_thai);
CREATE INDEX IF NOT EXISTS idx_chi_tiet_don_hang_don_hang_id ON chi_tiet_don_hang(don_hang_id);
