// Middleware xu ly loi chung (TV1)

function xu_ly_loi_chung(err, req, res, next) {
  console.error('Loi may chu:', err.message);

  const statusCode = err.status || (err.message.includes('Khong tim thay') ? 404 : 400);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Da xay ra loi tren may chu.'
  });
}

function xu_ly_duong_dan_khong_ton_tai(req, res) {
  res.status(404).json({
    success: false,
    message: `Duong dan ${req.method} ${req.originalUrl} khong ton tai tren he thong.`
  });
}

module.exports = {
  xu_ly_loi_chung,
  xu_ly_duong_dan_khong_ton_tai
};
