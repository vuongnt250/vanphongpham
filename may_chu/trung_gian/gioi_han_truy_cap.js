// Middleware gioi han tan suat truy cap (Rate Limiting)
const rateLimit = require('express-rate-limit');

// Che do kiem thu cho phep gioi han cao hon hoac bo qua de khong gay gian doan test suite
const isTest = process.env.NODE_ENV === 'test';

const gioi_han_toan_cuc = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phut
  max: isTest ? 2000 : 300,  // 300 requests / 15 phut cho moi IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.'
  }
});

const gioi_han_auth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 500 : 20,    // 20 lan thu dang nhap/dang ky / 15 phut
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu đăng nhập/đăng ký từ IP này, vui lòng thử lại sau 15 phút.'
  }
});

const gioi_han_tao_don = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 500 : 30,    // 30 don hang / 15 phut
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu tạo đơn hàng từ IP này, vui lòng thử lại sau ít phút.'
  }
});

// Ham factory tao rate limiter linh hoat cho cac truong hop test cu the
function tao_gioi_han(windowMs, max, message) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: message || 'Quá nhiều yêu cầu, vui lòng thử lại sau.'
    }
  });
}

module.exports = {
  gioi_han_toan_cuc,
  gioi_han_auth,
  gioi_han_tao_don,
  tao_gioi_han
};
