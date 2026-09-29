-- Bang quan ly Ticket ho tro khach hang
CREATE TABLE IF NOT EXISTS ticket_ho_tro (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ma_ticket TEXT UNIQUE NOT NULL,
  nguoi_dung_id INTEGER REFERENCES nguoi_dung(id) ON DELETE SET NULL,
  ho_ten TEXT NOT NULL,
  so_dien_thoai TEXT,
  email TEXT,
  tieu_de TEXT NOT NULL,
  chu_de TEXT DEFAULT 'khac',
  do_uu_tien TEXT DEFAULT 'trung_binh' CHECK (do_uu_tien IN ('thap', 'trung_binh', 'cao', 'khan_cap')),
  trang_thai TEXT DEFAULT 'cho_xu_ly' CHECK (trang_thai IN ('cho_xu_ly', 'dang_xu_ly', 'da_dong')),
  ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bang tin nhan hoi thoai trong Ticket
CREATE TABLE IF NOT EXISTS tin_nhan_ticket (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL REFERENCES ticket_ho_tro(id) ON DELETE CASCADE,
  nguoi_gui TEXT NOT NULL CHECK (nguoi_gui IN ('khach_hang', 'admin')),
  ten_nguoi_gui TEXT,
  noi_dung TEXT NOT NULL,
  thoi_gian DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ticket_ma ON ticket_ho_tro(ma_ticket);
CREATE INDEX IF NOT EXISTS idx_ticket_trang_thai ON ticket_ho_tro(trang_thai);
CREATE INDEX IF NOT EXISTS idx_tin_nhan_ticket_id ON tin_nhan_ticket(ticket_id);
