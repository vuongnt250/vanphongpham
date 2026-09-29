// Dieu khien Admin & Quan ly kinh doanh (TV3)
const thong_ke = require('../../co_so_du_lieu/mo_hinh/thong_ke');
const don_hang = require('../../co_so_du_lieu/mo_hinh/don_hang');
const nguoi_dung = require('../../co_so_du_lieu/mo_hinh/nguoi_dung');
const nhat_ky_kho = require('../../co_so_du_lieu/mo_hinh/nhat_ky_kho');
const nha_cung_cap = require('../../co_so_du_lieu/mo_hinh/nha_cung_cap');
const banner = require('../../co_so_du_lieu/mo_hinh/banner');
const cai_dat = require('../../co_so_du_lieu/mo_hinh/cai_dat');
const ticket_ho_tro = require('../../co_so_du_lieu/mo_hinh/ticket_ho_tro');

const dieu_khien_admin = {
  // 1. Thong ke Dashboard
  lay_thong_ke(req, res, next) {
    try {
      const data = thong_ke.lay_tong_quan();
      res.status(200).json({
        success: true,
        du_lieu: data
      });
    } catch (err) {
      next(err);
    }
  },

  // 2. Quan ly Don hang
  lay_tat_ca_don_hang(req, res, next) {
    try {
      const { trang_thai, tu_khoa, gioi_han } = req.query;
      const list = don_hang.lay_tat_ca({ trang_thai, tu_khoa, gioi_han });
      res.status(200).json({
        success: true,
        du_lieu: list
      });
    } catch (err) {
      next(err);
    }
  },

  cap_nhat_trang_thai_don_hang(req, res, next) {
    try {
      const { id } = req.params;
      const { trang_thai } = req.body;
      if (!trang_thai) {
        return res.status(400).json({ success: false, message: 'Thiếu trạng thái mới.' });
      }

      const order = don_hang.cap_nhat_trang_thai(id, trang_thai);
      res.status(200).json({
        success: true,
        message: `Đã cập nhật đơn hàng sang trạng thái ${trang_thai}`,
        du_lieu: order
      });
    } catch (err) {
      next(err);
    }
  },

  // 3. Quan ly Khach hang
  lay_danh_sach_khach_hang(req, res, next) {
    try {
      const { tu_khoa } = req.query;
      const list = nguoi_dung.lay_tat_ca({ vai_tro: 'customer', tu_khoa });
      res.status(200).json({
        success: true,
        du_lieu: list
      });
    } catch (err) {
      next(err);
    }
  },

  doi_trang_thai_khach_hang(req, res, next) {
    try {
      const { id } = req.params;
      const { trang_thai } = req.body;
      const u = nguoi_dung.sua(id, { trang_thai });
      res.status(200).json({
        success: true,
        message: 'Cập nhật trạng thái khách hàng thành công.',
        du_lieu: u
      });
    } catch (err) {
      next(err);
    }
  },

  // 4. Quan ly Ton kho & Nhat ky
  lay_nhat_ky_kho(req, res, next) {
    try {
      const { san_pham_id, loai_thay_doi, gioi_han } = req.query;
      const list = nhat_ky_kho.lay_danh_sach({ san_pham_id, loai_thay_doi, gioi_han });
      res.status(200).json({
        success: true,
        du_lieu: list
      });
    } catch (err) {
      next(err);
    }
  },

  dieu_chinh_ton_kho(req, res, next) {
    try {
      const { san_pham_id, loai_thay_doi, so_luong_thay_doi, ghi_chu } = req.body;
      if (!san_pham_id || !loai_thay_doi || !so_luong_thay_doi) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp: ID sản phẩm, Loại thay đổi (nhap_kho/xuat_kho/dieu_chinh) và Số lượng.'
        });
      }

      const logMoi = nhat_ky_kho.dieu_chinh_kho({
        san_pham_id: Number(san_pham_id),
        loai_thay_doi,
        so_luong_thay_doi: Number(so_luong_thay_doi),
        ghi_chu,
        nguoi_thuc_hien_id: req.user.id
      });

      res.status(200).json({
        success: true,
        message: 'Điều chỉnh tồn kho thành công.',
        du_lieu: logMoi
      });
    } catch (err) {
      next(err);
    }
  },

  // 5. Quan ly Nha cung cap (CRUD)
  lay_nha_cung_cap(req, res, next) {
    try {
      const list = nha_cung_cap.lay_tat_ca(req.query);
      res.status(200).json({ success: true, du_lieu: list });
    } catch (err) {
      next(err);
    }
  },

  them_nha_cung_cap(req, res, next) {
    try {
      const { ten_nha_cung_cap } = req.body;
      if (!ten_nha_cung_cap) {
        return res.status(400).json({ success: false, message: 'Thiếu tên nhà cung cấp.' });
      }
      const moi = nha_cung_cap.them(req.body);
      res.status(201).json({ success: true, message: 'Thêm nhà cung cấp thành công.', du_lieu: moi });
    } catch (err) {
      next(err);
    }
  },

  sua_nha_cung_cap(req, res, next) {
    try {
      const { id } = req.params;
      const capNhat = nha_cung_cap.sua(id, req.body);
      res.status(200).json({ success: true, message: 'Cập nhật thành công.', du_lieu: capNhat });
    } catch (err) {
      next(err);
    }
  },

  xoa_nha_cung_cap(req, res, next) {
    try {
      const { id } = req.params;
      nha_cung_cap.xoa(id);
      res.status(200).json({ success: true, message: 'Xóa nhà cung cấp thành công.' });
    } catch (err) {
      next(err);
    }
  },

  // 6. Quan ly Banner (CRUD)
  lay_banner(req, res, next) {
    try {
      const list = banner.lay_tat_ca(req.query);
      res.status(200).json({ success: true, du_lieu: list });
    } catch (err) {
      next(err);
    }
  },

  them_banner(req, res, next) {
    try {
      const { tieu_de, hinh_anh } = req.body;
      if (!tieu_de || !hinh_anh) {
        return res.status(400).json({ success: false, message: 'Tiêu đề và đường dẫn hình ảnh là bắt buộc.' });
      }
      const moi = banner.them(req.body);
      res.status(201).json({ success: true, message: 'Thêm banner thành công.', du_lieu: moi });
    } catch (err) {
      next(err);
    }
  },

  sua_banner(req, res, next) {
    try {
      const { id } = req.params;
      const capNhat = banner.sua(id, req.body);
      res.status(200).json({ success: true, message: 'Cập nhật banner thành công.', du_lieu: capNhat });
    } catch (err) {
      next(err);
    }
  },

  xoa_banner(req, res, next) {
    try {
      const { id } = req.params;
      banner.xoa(id);
      res.status(200).json({ success: true, message: 'Xóa banner thành công.' });
    } catch (err) {
      next(err);
    }
  },

  // 7. Cai dat he thong
  lay_cai_dat(req, res, next) {
    try {
      const data = cai_dat.lay_tat_ca();
      res.status(200).json({ success: true, du_lieu: data });
    } catch (err) {
      next(err);
    }
  },

  cap_nhat_cai_dat(req, res, next) {
    try {
      const { khoa, gia_tri, mo_ta } = req.body;
      if (!khoa || gia_tri === undefined) {
        return res.status(400).json({ success: false, message: 'Khóa và giá trị cài đặt là bắt buộc.' });
      }
      cai_dat.cap_nhat(khoa, gia_tri, mo_ta);
      res.status(200).json({ success: true, message: 'Cập nhật cài đặt thành công.' });
    } catch (err) {
      next(err);
    }
  },

  // 8. Quan ly Ticket Ho tro Khach hang (Live Chat Support)
  lay_danh_sach_ticket(req, res, next) {
    try {
      const { trang_thai, tim_kiem, limit, offset } = req.query;
      const danh_sach = ticket_ho_tro.lay_tat_ca({ trang_thai, tim_kiem, limit, offset });
      const thong_ke = ticket_ho_tro.thong_ke();
      res.status(200).json({
        success: true,
        du_lieu: danh_sach,
        thong_ke
      });
    } catch (err) {
      next(err);
    }
  },

  lay_chi_tiet_ticket(req, res, next) {
    try {
      const { id } = req.params;
      const ticket = ticket_ho_tro.lay_theo_id(Number(id));
      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket không tồn tại.' });
      }
      res.status(200).json({
        success: true,
        du_lieu: ticket
      });
    } catch (err) {
      next(err);
    }
  },

  admin_tra_loi_ticket(req, res, next) {
    try {
      const { id } = req.params;
      const { noi_dung } = req.body;
      if (!noi_dung || !noi_dung.trim()) {
        return res.status(400).json({ success: false, message: 'Nội dung phản hồi không được để trống.' });
      }

      const ticket = ticket_ho_tro.lay_theo_id(Number(id));
      if (!ticket) {
        return res.status(404).json({ success: false, message: 'Ticket không tồn tại.' });
      }

      const ten_admin = req.user?.ho_ten || req.user?.tai_khoan || 'Chuyên viên SmartDesk';
      const tinNhan = ticket_ho_tro.them_tin_nhan(ticket.id, {
        nguoi_gui: 'admin',
        ten_nguoi_gui: ten_admin,
        noi_dung: noi_dung.trim()
      });

      res.status(201).json({
        success: true,
        message: 'Gửi câu trả lời cho khách hàng thành công.',
        du_lieu: tinNhan
      });
    } catch (err) {
      next(err);
    }
  },

  admin_cap_nhat_trang_thai_ticket(req, res, next) {
    try {
      const { id } = req.params;
      const { trang_thai } = req.body;
      if (!trang_thai) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp trạng thái mới.' });
      }

      const ticket = ticket_ho_tro.cap_nhat_trang_thai(Number(id), trang_thai);
      res.status(200).json({
        success: true,
        message: `Đã cập nhật trạng thái ticket sang "${trang_thai}".`,
        du_lieu: ticket
      });
    } catch (err) {
      next(err);
    }
  },

  admin_xoa_ticket(req, res, next) {
    try {
      const { id } = req.params;
      ticket_ho_tro.xoa_ticket(Number(id));
      res.status(200).json({
        success: true,
        message: 'Đã xóa ticket hỗ trợ thành công.'
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = dieu_khien_admin;
