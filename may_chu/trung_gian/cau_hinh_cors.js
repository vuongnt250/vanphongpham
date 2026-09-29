// Middleware cau hinh CORS an toan
const cors = require('cors');

function tao_cau_hinh_cors() {
  const allowedOriginsEnv = process.env.CORS_ORIGIN;
  // Mac dinh ho tro cac domain phat trien Frontend pho bien
  const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ];

  const whitelist = allowedOriginsEnv
    ? allowedOriginsEnv.split(',').map(s => s.trim()).filter(Boolean)
    : defaultOrigins;

  return cors({
    origin: function (origin, callback) {
      // Cho phep cac request khong co origin (vi du: server-to-server, curl, Postman, test)
      if (!origin) {
        return callback(null, true);
      }

      // Neu whitelist chua '*' hoac chua chinh xac origin
      if (whitelist.includes('*') || whitelist.includes(origin)) {
        return callback(null, true);
      }

      const err = new Error(`CORS policy: Nguồn truy cập ${origin} không được phép qua CORS whitelist.`);
      err.status = 403;
      return callback(err);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-signature', 'x-webhook-signature']
  });
}

module.exports = tao_cau_hinh_cors;
