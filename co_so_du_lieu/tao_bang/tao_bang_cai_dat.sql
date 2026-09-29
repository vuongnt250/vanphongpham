-- Bang cau hinh he thong (TV3 quan ly)
CREATE TABLE IF NOT EXISTS cai_dat (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  khoa VARCHAR(100) UNIQUE NOT NULL,
  gia_tri TEXT NOT NULL,
  mo_ta VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_cai_dat_khoa ON cai_dat(khoa);
