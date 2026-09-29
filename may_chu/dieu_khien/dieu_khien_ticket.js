// Dieu khien Ticket ho tro (Phia Khach hang / Bot Chat)
const mo_hinh_ticket = require('../../co_so_du_lieu/mo_hinh/ticket_ho_tro');

const dieu_khien_ticket = {
  async tao_ticket(req, res, next) {
    try {
      const { ho_ten, so_dien_thoai, email, tieu_de, chu_de, do_uu_tien, noi_dung } = req.body;

      if (!ho_ten || !ho_ten.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp họ và tên để nhân viên hỗ trợ.'
        });
      }

      if (!tieu_de || !tieu_de.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập tiêu đề hoặc tóm tắt vấn đề cần hỗ trợ.'
        });
      }

      const nguoi_dung_id = req.user?.id || null;
      const ticketMoi = mo_hinh_ticket.tao_ticket({
        nguoi_dung_id,
        ho_ten: ho_ten.trim(),
        so_dien_thoai: (so_dien_thoai || '').trim(),
        email: (email || '').trim(),
        tieu_de: tieu_de.trim(),
        chu_de: chu_de || 'tu_van',
        do_uu_tien: do_uu_tien || 'trung_binh',
        noi_dung: (noi_dung || '').trim()
      });

      return res.status(201).json({
        success: true,
        message: 'Tạo ticket yêu cầu hỗ trợ thành công. Đội ngũ SmartDesk sẽ phản hồi bạn trong giây lát.',
        du_lieu: ticketMoi
      });
    } catch (err) {
      next(err);
    }
  },

  async lay_danh_sach_ticket_khach(req, res, next) {
    try {
      const nguoi_dung_id = req.user?.id || null;
      const { ma, sdt, email } = req.query;

      let danh_sach_ma = [];
      if (ma) {
        danh_sach_ma = ma.split(',').map(s => s.trim()).filter(Boolean);
      }

      const tickets = mo_hinh_ticket.lay_danh_sach_khach({
        nguoi_dung_id,
        danh_sach_ma,
        so_dien_thoai: sdt,
        email
      });

      return res.status(200).json({
        success: true,
        du_lieu: tickets
      });
    } catch (err) {
      next(err);
    }
  },

  async tra_cuu_ticket(req, res, next) {
    try {
      const { ma_ticket } = req.params;
      if (!ma_ticket) {
        return res.status(400).json({
          success: false,
          message: 'Mã ticket không được để trống.'
        });
      }

      const ticket = mo_hinh_ticket.lay_theo_ma(ma_ticket.trim());
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: `Không tìm thấy ticket với mã ${ma_ticket}.`
        });
      }

      return res.status(200).json({
        success: true,
        du_lieu: ticket
      });
    } catch (err) {
      next(err);
    }
  },

  async gui_tin_nhan_khach(req, res, next) {
    try {
      const { id } = req.params;
      const { noi_dung, ten_nguoi_gui } = req.body;

      if (!noi_dung || !noi_dung.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Nội dung tin nhắn không được để trống.'
        });
      }

      const ticket = mo_hinh_ticket.lay_theo_id(Number(id));
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket không tồn tại.'
        });
      }

      const tinNhan = mo_hinh_ticket.them_tin_nhan(ticket.id, {
        nguoi_gui: 'khach_hang',
        ten_nguoi_gui: ten_nguoi_gui || ticket.ho_ten,
        noi_dung: noi_dung.trim()
      });

      return res.status(201).json({
        success: true,
        message: 'Đã gửi tin nhắn thành công.',
        du_lieu: tinNhan
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = dieu_khien_ticket;
