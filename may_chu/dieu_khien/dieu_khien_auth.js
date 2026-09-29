// Dieu khien Xac thuc & Nguoi dung (TV2)
const nguoi_dung = require('../../co_so_du_lieu/mo_hinh/nguoi_dung');
const { tao_token } = require('../trung_gian/xac_thuc');

const dieu_khien_auth = {
  // POST /api/auth/dang-ky
  dang_ky(req, res, next) {
    try {
      const { ten_dang_nhap, email, mat_khau, ho_ten, so_dien_thoai } = req.body;

      if (!ten_dang_nhap || !email || !mat_khau || !ho_ten) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp đầy đủ tên đăng nhập, email, mật khẩu và họ tên.'
        });
      }

      if (mat_khau.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu phải có ít nhất 6 ký tự.'
        });
      }

      const existEmail = nguoi_dung.lay_theo_email(email.trim().toLowerCase());
      if (existEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email này đã được sử dụng.'
        });
      }

      const existUser = nguoi_dung.lay_theo_username(ten_dang_nhap.trim());
      if (existUser) {
        return res.status(400).json({
          success: false,
          message: 'Tên đăng nhập này đã tồn tại.'
        });
      }

      const userMoi = nguoi_dung.them({
        ten_dang_nhap: ten_dang_nhap.trim(),
        email: email.trim().toLowerCase(),
        mat_khau,
        ho_ten: ho_ten.trim(),
        so_dien_thoai: so_dien_thoai ? so_dien_thoai.trim() : '',
        vai_tro: 'customer'
      });

      const token = tao_token({ id: userMoi.id, email: userMoi.email, vai_tro: userMoi.vai_tro });

      res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản thành công!',
        du_lieu: {
          user: userMoi,
          token
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/dang-nhap
  dang_nhap(req, res, next) {
    try {
      const tai_khoan = req.body.tai_khoan || req.body.ten_dang_nhap || req.body.email;
      const mat_khau = req.body.mat_khau;

      if (!tai_khoan || !mat_khau) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập tên đăng nhập hoặc email cùng mật khẩu.'
        });
      }

      const user = nguoi_dung.lay_theo_email_hoac_username(tai_khoan.trim());
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Tài khoản hoặc mật khẩu không chính xác.'
        });
      }

      if (user.trang_thai !== 'hoat_dong') {
        return res.status(403).json({
          success: false,
          message: 'Tài khoản của bạn đã bị khóa hoặc ngừng kích hoạt.'
        });
      }

      const hopLe = nguoi_dung.kiem_tra_mat_khau(mat_khau, user.mat_khau);
      if (!hopLe) {
        return res.status(401).json({
          success: false,
          message: 'Tài khoản hoặc mật khẩu không chính xác.'
        });
      }

      const token = tao_token({ id: user.id, email: user.email, vai_tro: user.vai_tro });

      const userSafe = {
        id: user.id,
        ten_dang_nhap: user.ten_dang_nhap,
        email: user.email,
        ho_ten: user.ho_ten,
        so_dien_thoai: user.so_dien_thoai,
        vai_tro: user.vai_tro,
        trang_thai: user.trang_thai,
        yeu_cau_doi_mat_khau: Boolean(user.yeu_cau_doi_mat_khau),
        ngay_tao: user.ngay_tao
      };

      res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công!',
        yeu_cau_doi_mat_khau: Boolean(user.yeu_cau_doi_mat_khau),
        du_lieu: {
          user: userSafe,
          token,
          yeu_cau_doi_mat_khau: Boolean(user.yeu_cau_doi_mat_khau)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/auth/me
  lay_thong_tin_hien_tai(req, res, next) {
    try {
      const user = nguoi_dung.lay_theo_id(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin người dùng.'
        });
      }
      res.status(200).json({
        success: true,
        du_lieu: {
          id: user.id,
          ten_dang_nhap: user.ten_dang_nhap,
          email: user.email,
          ho_ten: user.ho_ten,
          so_dien_thoai: user.so_dien_thoai,
          vai_tro: user.vai_tro,
          trang_thai: user.trang_thai,
          yeu_cau_doi_mat_khau: Boolean(user.yeu_cau_doi_mat_khau),
          ngay_tao: user.ngay_tao
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/auth/cap-nhat
  cap_nhat_ho_so(req, res, next) {
    try {
      const { ho_ten, so_dien_thoai } = req.body;
      const user = nguoi_dung.sua(req.user.id, { ho_ten, so_dien_thoai });
      res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin thành công.',
        du_lieu: user
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/doi-mat-khau
  doi_mat_khau(req, res, next) {
    try {
      const { mat_khau_cu, mat_khau_moi } = req.body;
      if (!mat_khau_cu || !mat_khau_moi) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp mật khẩu cũ và mật khẩu mới.'
        });
      }
      if (mat_khau_moi.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu mới phải có ít nhất 6 ký tự.'
        });
      }

      const userFull = nguoi_dung.lay_theo_email_hoac_username(req.user.email);
      if (!userFull || !nguoi_dung.kiem_tra_mat_khau(mat_khau_cu, userFull.mat_khau)) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu cũ không chính xác.'
        });
      }

      nguoi_dung.doi_mat_khau(req.user.id, mat_khau_moi);

      res.status(200).json({
        success: true,
        message: 'Đổi mật khẩu thành công.'
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = dieu_khien_auth;
