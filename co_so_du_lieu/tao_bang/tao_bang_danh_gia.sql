-- Bang danh gia san pham (TV1 quan ly)
-- Luu y: user_id tham chieu toi nguoi dung tu module TV2, TV1 khong tu y tao bang users
CREATE TABLE IF NOT EXISTS danh_gia (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  san_pham_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  don_hang_id INTEGER,
  so_sao INTEGER NOT NULL CHECK (so_sao >= 1 AND so_sao <= 5),
  noi_dung TEXT NOT NULL,
  trang_thai VARCHAR(50) DEFAULT 'da_duyet',
  ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (san_pham_id) REFERENCES san_pham(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_danh_gia_san_pham_id ON danh_gia(san_pham_id);
CREATE INDEX IF NOT EXISTS idx_danh_gia_user_id ON danh_gia(user_id);
CREATE INDEX IF NOT EXISTS idx_danh_gia_trang_thai ON danh_gia(trang_thai);
