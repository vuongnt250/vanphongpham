-- Bang danh muc san pham (TV1 quan ly)
CREATE TABLE IF NOT EXISTS danh_muc (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ten_danh_muc VARCHAR(255) NOT NULL,
  duong_dan_danh_muc VARCHAR(255) NOT NULL UNIQUE,
  mo_ta TEXT,
  trang_thai VARCHAR(50) DEFAULT 'hoat_dong'
);

CREATE INDEX IF NOT EXISTS idx_danh_muc_duong_dan ON danh_muc(duong_dan_danh_muc);
CREATE INDEX IF NOT EXISTS idx_danh_muc_trang_thai ON danh_muc(trang_thai);
