-- Bang nhat ky bien dong kho (TV3 quan ly ton kho)
CREATE TABLE IF NOT EXISTS nhat_ky_kho (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  san_pham_id INTEGER NOT NULL,
  loai_thay_doi VARCHAR(50) NOT NULL CHECK (loai_thay_doi IN ('nhap_kho', 'xuat_kho', 'ban_hang', 'hoan_hang', 'dieu_chinh')),
  so_luong_thay_doi INTEGER NOT NULL,
  ton_truoc INTEGER NOT NULL,
  ton_sau INTEGER NOT NULL,
  ghi_chu TEXT,
  nguoi_thuc_hien_id INTEGER,
  ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (san_pham_id) REFERENCES san_pham(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_nhat_ky_kho_san_pham_id ON nhat_ky_kho(san_pham_id);
CREATE INDEX IF NOT EXISTS idx_nhat_ky_kho_loai ON nhat_ky_kho(loai_thay_doi);
