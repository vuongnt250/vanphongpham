-- Bang dia chi nhan hang (TV2 quan ly)
CREATE TABLE IF NOT EXISTS dia_chi (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  ten_nguoi_nhan VARCHAR(150) NOT NULL,
  so_dien_thoai VARCHAR(20) NOT NULL,
  dia_chi_chi_tiet TEXT NOT NULL,
  la_mac_dinh INTEGER DEFAULT 0,
  ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_dia_chi_user_id ON dia_chi(user_id);
