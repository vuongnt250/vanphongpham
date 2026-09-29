// Dieu khien Don hang & Checkout (TV2)
const don_hang = require('../../co_so_du_lieu/mo_hinh/don_hang');
const gio_hang = require('../../co_so_du_lieu/mo_hinh/gio_hang');

const dieu_khien_don_hang = {
  // POST /api/don-hang - Tao don hang voi Transaction thuc su
  tao_don_hang(req, res, next) {
    try {
      const {
        dia_chi_id,
        ten_nguoi_nhan,
        so_dien_thoai,
        dia_chi_giao_hang,
        ghi_chu,
        ma_voucher,
        phuong_thuc_thanh_toan = 'COD',
        danh_sach_san_pham // Neu khong truyen se tu lay tu DB gio hang cua user
      } = req.body;

      let items = danh_sach_san_pham;
      if (!items || items.length === 0) {
        // Lay truc tiep tu DB cart cua user
        const cartDb = gio_hang.lay_chi_tiet_gio_hang(req.user.id);
        if (!cartDb.danh_sach || cartDb.danh_sach.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Giỏ hàng của bạn đang trống, không thể tiến hành đặt hàng.'
          });
        }
        items = cartDb.danh_sach.map(it => ({
          san_pham_id: it.san_pham.id,
          so_luong: it.so_luong
        }));
      }

      const donHangMoi = don_hang.tao_don_hang({
        user_id: req.user.id,
        dia_chi_id,
        ten_nguoi_nhan,
        so_dien_thoai,
        dia_chi_giao_hang,
        ghi_chu,
        ma_voucher,
        phuong_thuc_thanh_toan,
        danh_sach_san_pham: items
      });

      res.status(201).json({
        success: true,
        message: 'Đặt hàng thành công! Đơn hàng đã được lưu vào hệ thống.',
        du_lieu: donHangMoi
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/don-hang/cua-toi
  lay_don_hang_cua_toi(req, res, next) {
    try {
      const danh_sach = don_hang.lay_theo_user(req.user.id);
      res.status(200).json({
        success: true,
        du_lieu: danh_sach
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/don-hang/:id
  lay_chi_tiet(req, res, next) {
    try {
      const { id } = req.params;
      const order = don_hang.lay_theo_id(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng.'
        });
      }

      // IDOR protection: chi admin hoac chinh chu don hang moi duoc xem
      const laAdmin = req.user && (req.user.role === 'admin' || req.user.vai_tro === 'admin');
      if (!laAdmin && order.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền xem đơn hàng này.'
        });
      }

      res.status(200).json({
        success: true,
        du_lieu: order
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/don-hang/:id/huy
  huy_don_hang(req, res, next) {
    try {
      const { id } = req.params;
      const order = don_hang.huy_don_hang_boi_user(id, req.user.id);
      res.status(200).json({
        success: true,
        message: 'Đã hủy đơn hàng thành công và hoàn trả số lượng vào tồn kho.',
        du_lieu: order
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = dieu_khien_don_hang;
