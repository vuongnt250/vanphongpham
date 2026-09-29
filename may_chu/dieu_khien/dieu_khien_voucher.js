// Dieu khien Voucher / Ma giam gia (TV3 + TV2)
const ma_giam_gia = require('../../co_so_du_lieu/mo_hinh/ma_giam_gia');

const dieu_khien_voucher = {
  // POST /api/voucher/kiem-tra
  kiem_tra(req, res, next) {
    try {
      const { ma_voucher, tong_tien = 0 } = req.body;
      if (!ma_voucher) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mã voucher.' });
      }

      const kq = ma_giam_gia.kiem_tra_hop_le(ma_voucher, Number(tong_tien));
      if (!kq.hop_le) {
        return res.status(400).json({
          success: false,
          message: kq.ly_do
        });
      }

      res.status(200).json({
        success: true,
        message: 'Áp dụng mã giảm giá thành công!',
        du_lieu: {
          ma_voucher: kq.voucher.ma_voucher,
          ten_voucher: kq.voucher.ten_voucher,
          so_tien_giam: kq.so_tien_giam,
          loai_giam_gia: kq.voucher.loai_giam_gia,
          gia_tri: kq.voucher.gia_tri
        }
      });
    } catch (err) {
      next(err);
    }
  },

  lay_danh_sach(req, res, next) {
    try {
      const { trang_thai } = req.query;
      const list = ma_giam_gia.lay_tat_ca({ trang_thai });
      res.status(200).json({
        success: true,
        du_lieu: list
      });
    } catch (err) {
      next(err);
    }
  },

  them(req, res, next) {
    try {
      const { ma_voucher, ten_voucher, loai_giam_gia, gia_tri } = req.body;
      if (!ma_voucher || !ten_voucher || !loai_giam_gia || !gia_tri) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp đầy đủ: Mã voucher, Tên, Loại giảm giá và Giá trị.'
        });
      }

      const moi = ma_giam_gia.them(req.body);
      res.status(201).json({
        success: true,
        message: 'Tạo mã voucher thành công.',
        du_lieu: moi
      });
    } catch (err) {
      next(err);
    }
  },

  sua(req, res, next) {
    try {
      const { id } = req.params;
      const vc = ma_giam_gia.lay_theo_id(id);
      if (!vc) return res.status(404).json({ success: false, message: 'Không tìm thấy voucher.' });

      const capNhat = ma_giam_gia.sua(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Cập nhật voucher thành công.',
        du_lieu: capNhat
      });
    } catch (err) {
      next(err);
    }
  },

  xoa(req, res, next) {
    try {
      const { id } = req.params;
      const vc = ma_giam_gia.lay_theo_id(id);
      if (!vc) return res.status(404).json({ success: false, message: 'Không tìm thấy voucher.' });

      ma_giam_gia.xoa(id);
      res.status(200).json({
        success: true,
        message: 'Xóa voucher thành công.'
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = dieu_khien_voucher;
