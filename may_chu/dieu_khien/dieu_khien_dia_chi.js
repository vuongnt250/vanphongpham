// Dieu khien Dia chi nhan hang (TV2)
const dia_chi = require('../../co_so_du_lieu/mo_hinh/dia_chi');

const dieu_khien_dia_chi = {
  lay_danh_sach(req, res, next) {
    try {
      const danh_sach = dia_chi.lay_theo_user(req.user.id);
      res.status(200).json({
        success: true,
        du_lieu: danh_sach
      });
    } catch (err) {
      next(err);
    }
  },

  them(req, res, next) {
    try {
      const { ten_nguoi_nhan, so_dien_thoai, dia_chi_chi_tiet, la_mac_dinh } = req.body;
      if (!ten_nguoi_nhan || !so_dien_thoai || !dia_chi_chi_tiet) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ Tên người nhận, Số điện thoại và Địa chỉ chi tiết.'
        });
      }

      const dcMoi = dia_chi.them({
        user_id: req.user.id,
        ten_nguoi_nhan: ten_nguoi_nhan.trim(),
        so_dien_thoai: so_dien_thoai.trim(),
        dia_chi_chi_tiet: dia_chi_chi_tiet.trim(),
        la_mac_dinh: la_mac_dinh ? 1 : 0
      });

      res.status(201).json({
        success: true,
        message: 'Thêm địa chỉ thành công.',
        du_lieu: dcMoi
      });
    } catch (err) {
      next(err);
    }
  },

  sua(req, res, next) {
    try {
      const { id } = req.params;
      const dcHienTai = dia_chi.lay_theo_id(id);
      if (!dcHienTai) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ.' });
      }
      if (dcHienTai.user_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền chỉnh sửa địa chỉ này.' });
      }

      const dcCapNhat = dia_chi.sua(id, req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Cập nhật địa chỉ thành công.',
        du_lieu: dcCapNhat
      });
    } catch (err) {
      next(err);
    }
  },

  dat_mac_dinh(req, res, next) {
    try {
      const { id } = req.params;
      const dcHienTai = dia_chi.lay_theo_id(id);
      if (!dcHienTai) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ.' });
      }
      if (dcHienTai.user_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền chỉnh sửa địa chỉ này.' });
      }

      const dcCapNhat = dia_chi.dat_mac_dinh(id, req.user.id);
      res.status(200).json({
        success: true,
        message: 'Đã thiết lập địa chỉ mặc định.',
        du_lieu: dcCapNhat
      });
    } catch (err) {
      next(err);
    }
  },

  xoa(req, res, next) {
    try {
      const { id } = req.params;
      const dcHienTai = dia_chi.lay_theo_id(id);
      if (!dcHienTai) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ.' });
      }
      if (dcHienTai.user_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền xóa địa chỉ này.' });
      }

      dia_chi.xoa(id, req.user.id);
      res.status(200).json({
        success: true,
        message: 'Xóa địa chỉ thành công.'
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = dieu_khien_dia_chi;
