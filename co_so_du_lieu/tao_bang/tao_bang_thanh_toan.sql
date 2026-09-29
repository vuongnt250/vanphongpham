-- Bang thanh toan (TV2 quan ly)
CREATE TABLE IF NOT EXISTS thanh_toan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  don_hang_id INTEGER NOT NULL,
  phuong_thuc VARCHAR(50) NOT NULL,
  so_tien DECIMAL(12, 2) NOT NULL CHECK (so_tien >= 0),
  trang_thai VARCHAR(50) DEFAULT 'pending' CHECK (trang_thai IN ('pending', 'paid', 'failed', 'refunded')),
  ma_giao_dich VARCHAR(100),
  ngay_thanh_toan DATETIME,
  ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (don_hang_id) REFERENCES don_hang(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_thanh_toan_don_hang_id ON thanh_toan(don_hang_id);
