-- Bang gio hang va chi tiet gio hang (TV2 quan ly)
CREATE TABLE IF NOT EXISTS gio_hang (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chi_tiet_gio_hang (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gio_hang_id INTEGER NOT NULL,
  san_pham_id INTEGER NOT NULL,
  so_luong INTEGER NOT NULL CHECK (so_luong > 0),
  ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (gio_hang_id) REFERENCES gio_hang(id) ON DELETE CASCADE,
  FOREIGN KEY (san_pham_id) REFERENCES san_pham(id) ON DELETE CASCADE,
  UNIQUE(gio_hang_id, san_pham_id)
);

CREATE INDEX IF NOT EXISTS idx_gio_hang_user_id ON gio_hang(user_id);
CREATE INDEX IF NOT EXISTS idx_chi_tiet_gio_hang_gio_hang_id ON chi_tiet_gio_hang(gio_hang_id);
