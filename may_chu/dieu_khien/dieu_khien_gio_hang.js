// Dieu khien Gio hang Database (TV2)
const gio_hang = require('../../co_so_du_lieu/mo_hinh/gio_hang');

const dieu_khien_gio_hang = {
  lay_gio_hang(req, res, next) {
    try {
      const data = gio_hang.lay_chi_tiet_gio_hang(req.user.id);
      res.status(200).json({
        success: true,
        du_lieu: data
      });
    } catch (err) {
      next(err);
    }
  },

  them_vao_gio(req, res, next) {
    try {
      const { san_pham_id, so_luong = 1 } = req.body;
      if (!san_pham_id) {
        return res.status(400).json({ success: false, message: 'Thiếu mã sản phẩm.' });
      }

      const data = gio_hang.them_san_pham(req.user.id, Number(san_pham_id), Number(so_luong));
      res.status(200).json({
        success: true,
        message: 'Đã thêm sản phẩm vào giỏ hàng.',
        du_lieu: data
      });
    } catch (err) {
      next(err);
    }
  },

  sua_so_luong(req, res, next) {
    try {
      const { san_pham_id, so_luong } = req.body;
      if (!san_pham_id || so_luong === undefined) {
        return res.status(400).json({ success: false, message: 'Thiếu mã sản phẩm hoặc số lượng.' });
      }

      const data = gio_hang.sua_so_luong(req.user.id, Number(san_pham_id), Number(so_luong));
      res.status(200).json({
        success: true,
        message: 'Cập nhật số lượng thành công.',
        du_lieu: data
      });
    } catch (err) {
      next(err);
    }
  },

  xoa_san_pham(req, res, next) {
    try {
      const { san_pham_id } = req.params;
      const data = gio_hang.xoa_san_pham(req.user.id, Number(san_pham_id));
      res.status(200).json({
        success: true,
        message: 'Đã xóa sản phẩm khỏi giỏ hàng.',
        du_lieu: data
      });
    } catch (err) {
      next(err);
    }
  },

  xoa_tat_ca(req, res, next) {
    try {
      const data = gio_hang.xoa_sach_gio(req.user.id);
      res.status(200).json({
        success: true,
        message: 'Đã dọn sạch giỏ hàng.',
        du_lieu: data
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = dieu_khien_gio_hang;
