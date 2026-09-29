// Dieu khien: dieu_khien_hinh_anh.js
const dich_vu_hinh_anh = require('../dich_vu/dich_vu_hinh_anh');

const dieu_khien_hinh_anh = {
  async lay_theo_san_pham(req, res, next) {
    try {
      const { id } = req.params;
      const danh_sach = dich_vu_hinh_anh.lay_theo_san_pham(id);
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
      const ha = dich_vu_hinh_anh.lay_chi_tiet(id);
      if (!ha) {
        return res.status(404).json({
          success: false,
          message: 'Khong tim thay hinh anh.'
        });
      }
      return res.status(200).json({
        success: true,
        data: ha
      });
    } catch (error) {
      next(error);
    }
  },

  async tao_moi(req, res, next) {
    try {
      const san_pham_id = req.params.id || req.body.san_pham_id;
      const du_lieu = {
        ...req.body,
        san_pham_id
      };
      const ha = dich_vu_hinh_anh.tao_moi(du_lieu);
      return res.status(201).json({
        success: true,
        message: 'Them hinh anh thanh cong.',
        data: ha
      });
    } catch (error) {
      next(error);
    }
  },

  async cap_nhat(req, res, next) {
    try {
      const { id } = req.params;
      const ha = dich_vu_hinh_anh.cap_nhat(id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Cap nhat hinh anh thanh cong.',
        data: ha
      });
    } catch (error) {
      next(error);
    }
  },

  async dat_anh_chinh(req, res, next) {
    try {
      const { san_pham_id, hinh_anh_id } = req.params;
      const ha = dich_vu_hinh_anh.dat_anh_chinh(san_pham_id, hinh_anh_id);
      return res.status(200).json({
        success: true,
        message: 'Dat anh chinh thanh cong.',
        data: ha
      });
    } catch (error) {
      next(error);
    }
  },

  async xoa(req, res, next) {
    try {
      const { id } = req.params;
      dich_vu_hinh_anh.xoa(id);
      return res.status(200).json({
        success: true,
        message: 'Xoa hinh anh thanh cong.'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = dieu_khien_hinh_anh;
