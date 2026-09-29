// Dieu khien: dieu_khien_san_pham.js
const dich_vu_san_pham = require('../dich_vu/dich_vu_san_pham');

const dieu_khien_san_pham = {
  async lay_danh_sach(req, res, next) {
    try {
      const bo_loc = {
        danh_muc_id: req.query.danh_muc_id,
        tu_khoa: req.query.tu_khoa,
        gia_tu: req.query.gia_tu,
        gia_den: req.query.gia_den,
        thuong_hieu: req.query.thuong_hieu,
        trang_thai: req.query.trang_thai || 'hoat_dong',
        noi_bat: req.query.noi_bat,
        sap_xep: req.query.sap_xep,
        trang: req.query.trang,
        gioi_han: req.query.gioi_han
      };

      const ket_qua = dich_vu_san_pham.lay_danh_sach(bo_loc);
      return res.status(200).json({
        success: true,
        data: ket_qua.danh_sach,
        phan_trang: ket_qua.phan_trang
      });
    } catch (error) {
      next(error);
    }
  },

  async lay_chi_tiet(req, res, next) {
    try {
      const { id } = req.params;
      const sp = dich_vu_san_pham.lay_chi_tiet(id);
      return res.status(200).json({
        success: true,
        data: sp
      });
    } catch (error) {
      next(error);
    }
  },

  async tao_moi(req, res, next) {
    try {
      const sp = dich_vu_san_pham.tao_moi(req.body);
      return res.status(201).json({
        success: true,
        message: 'Tao san pham thanh cong.',
        data: sp
      });
    } catch (error) {
      next(error);
    }
  },

  async cap_nhat(req, res, next) {
    try {
      const { id } = req.params;
      const sp = dich_vu_san_pham.cap_nhat(id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Cap nhat san pham thanh cong.',
        data: sp
      });
    } catch (error) {
      next(error);
    }
  },

  async xoa(req, res, next) {
    try {
      const { id } = req.params;
      dich_vu_san_pham.xoa(id);
      return res.status(200).json({
        success: true,
        message: 'Xoa san pham thanh cong.'
      });
    } catch (error) {
      next(error);
    }
  },

  async lay_thuong_hieu(req, res, next) {
    try {
      const danh_sach = dich_vu_san_pham.lay_danh_sach_thuong_hieu();
      return res.status(200).json({
        success: true,
        data: danh_sach
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = dieu_khien_san_pham;
