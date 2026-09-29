-- Bang hinh anh san pham (TV1 quan ly)
CREATE TABLE IF NOT EXISTS hinh_anh_san_pham (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  san_pham_id INTEGER NOT NULL,
  duong_dan_anh VARCHAR(500) NOT NULL,
  la_anh_chinh INTEGER DEFAULT 0,
  FOREIGN KEY (san_pham_id) REFERENCES san_pham(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_hinh_anh_san_pham_id ON hinh_anh_san_pham(san_pham_id);
