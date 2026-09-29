// Dieu khien Thanh toan (TV2)
const thanh_toan = require('../../co_so_du_lieu/mo_hinh/thanh_toan');
const don_hang = require('../../co_so_du_lieu/mo_hinh/don_hang');

const dieu_khien_thanh_toan = {
  lay_theo_don_hang(req, res, next) {
    try {
      const { don_hang_id } = req.params;
      const order = don_hang.lay_theo_id(don_hang_id);
      if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });

      const laAdmin = req.user && (req.user.role === 'admin' || req.user.vai_tro === 'admin');
      if (!laAdmin && order.user_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập thanh toán của đơn hàng này.' });
      }

      const pay = thanh_toan.lay_theo_don_hang(don_hang_id);
      res.status(200).json({
        success: true,
        du_lieu: pay
      });
    } catch (err) {
      next(err);
    }
  },

  xac_nhan_thanh_toan(req, res, next) {
    try {
      const { don_hang_id, ma_giao_dich, trang_thai = 'paid' } = req.body;
      const order = don_hang.lay_theo_id(don_hang_id);
      if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });

      const laAdmin = req.user && (req.user.role === 'admin' || req.user.vai_tro === 'admin');
      if (!laAdmin && order.user_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền cập nhật thanh toán đơn hàng này.' });
      }

      const payMoi = thanh_toan.cap_nhat_trang_thai(don_hang_id, trang_thai, ma_giao_dich);
      res.status(200).json({
        success: true,
        message: 'Cập nhật trạng thái thanh toán thành công.',
        du_lieu: payMoi
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = dieu_khien_thanh_toan;
