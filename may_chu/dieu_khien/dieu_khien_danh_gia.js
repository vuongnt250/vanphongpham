// Dieu khien: dieu_khien_danh_gia.js
const dich_vu_danh_gia = require('../dich_vu/dich_vu_danh_gia');

const dieu_khien_danh_gia = {
  async lay_theo_san_pham(req, res, next) {
    try {
      const { id } = req.params;
      const { trang_thai } = req.query;
      const ket_qua = dich_vu_danh_gia.lay_theo_san_pham(id, { trang_thai });
      return res.status(200).json({
        success: true,
        data: ket_qua.danh_sach,
        thong_ke: ket_qua.thong_ke
      });
    } catch (error) {
      next(error);
    }
  },

  async lay_chi_tiet(req, res, next) {
    try {
      const { id } = req.params;
      const dg = dich_vu_danh_gia.lay_chi_tiet(id);
      return res.status(200).json({
        success: true,
        data: dg
      });
    } catch (error) {
      next(error);
    }
  },

  async tao_moi(req, res, next) {
    try {
      // Bao mat bat buoc: Lay user_id tu req.user (middleware xac thuc)
      // Khong tin tuong user_id tu client body
      const user_id = req.user ? req.user.id : null;
      if (!user_id) {
        return res.status(401).json({
          success: false,
          message: 'Ban phai dang nhap de gui danh gia.'
        });
      }

      const san_pham_id = req.params.id || req.body.san_pham_id;
      const { so_sao, noi_dung, don_hang_id } = req.body;

      const ket_qua = dich_vu_danh_gia.tao_moi({
        san_pham_id,
        user_id,
        don_hang_id,
        so_sao,
        noi_dung
      });

      return res.status(201).json({
        success: true,
        message: 'Gui danh gia thanh cong.',
        data: ket_qua.danh_gia,
        thong_ke: ket_qua.thong_ke
      });
    } catch (error) {
      next(error);
    }
  },

  async cap_nhat(req, res, next) {
    try {
      const { id } = req.params;
      const dg = dich_vu_danh_gia.cap_nhat(id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Cap nhat danh gia thanh cong.',
        data: dg
      });
    } catch (error) {
      next(error);
    }
  },

  async xoa(req, res, next) {
    try {
      const { id } = req.params;
      dich_vu_danh_gia.xoa(id);
      return res.status(200).json({
        success: true,
        message: 'Xoa danh gia thanh cong.'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = dieu_khien_danh_gia;
