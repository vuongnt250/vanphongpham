// Dieu khien: dieu_khien_danh_muc.js
const dich_vu_danh_muc = require('../dich_vu/dich_vu_danh_muc');

const dieu_khien_danh_muc = {
  async lay_tat_ca(req, res, next) {
    try {
      const { trang_thai } = req.query;
      const danh_sach = dich_vu_danh_muc.lay_tat_ca({ trang_thai });
      return res.status(200).json({
        success: true,
        data: danh_sach
      });
    } catch (error) {
      next(error);
    }
  },

  async lay_chi_tiet(req, res, next) {
    try {
      const { id } = req.params;
      const dm = dich_vu_danh_muc.lay_chi_tiet(id);
      return res.status(200).json({
        success: true,
        data: dm
      });
    } catch (error) {
      next(error);
    }
  },

  async lay_san_pham_theo_danh_muc(req, res, next) {
    try {
      const { id } = req.params;
      const bo_loc = {
        gia_tu: req.query.gia_tu,
        gia_den: req.query.gia_den,
        thuong_hieu: req.query.thuong_hieu,
        sap_xep: req.query.sap_xep,
        trang: req.query.trang,
        gioi_han: req.query.gioi_han
      };
      const ket_qua = dich_vu_danh_muc.lay_san_pham_theo_danh_muc(id, bo_loc);
      return res.status(200).json({
        success: true,
        danh_muc: ket_qua.danh_muc,
        data: ket_qua.danh_sach,
        phan_trang: ket_qua.phan_trang
      });
    } catch (error) {
      next(error);
    }
  },

  async tao_moi(req, res, next) {
    try {
      const dm = dich_vu_danh_muc.tao_moi(req.body);
      return res.status(201).json({
        success: true,
        message: 'Tao danh muc thanh cong.',
        data: dm
      });
    } catch (error) {
      next(error);
    }
  },

  async cap_nhat(req, res, next) {
    try {
      const { id } = req.params;
      const dm = dich_vu_danh_muc.cap_nhat(id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Cap nhat danh muc thanh cong.',
        data: dm
      });
    } catch (error) {
      next(error);
    }
  },

  async xoa(req, res, next) {
    try {
      const { id } = req.params;
      dich_vu_danh_muc.xoa(id);
      return res.status(200).json({
        success: true,
        message: 'Xoa danh muc thanh cong.'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = dieu_khien_danh_muc;
