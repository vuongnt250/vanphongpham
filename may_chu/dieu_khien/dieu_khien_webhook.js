// Dieu khien Webhook Thanh toan An toan (TV2)
// Secure Payment Webhook Infrastructure (Provider Pending: VNPay / MoMo / PayOS ready)
const crypto = require('crypto');
const thanh_toan = require('../../co_so_du_lieu/mo_hinh/thanh_toan');

function lay_webhook_secret() {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL SECURITY ERROR: WEBHOOK_SECRET biến môi trường bắt buộc chưa được cấu hình trên production!');
    }
    return 'smartdesk_dev_webhook_secret_2026';
  }
  return secret;
}

function tinh_chu_ky_hmac(payload, secret) {
  const chuoi = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return crypto.createHmac('sha256', secret).update(chuoi).digest('hex');
}

const dieu_khien_webhook = {
  lay_webhook_secret,
  tinh_chu_ky_hmac,

  xu_ly_webhook(req, res, next) {
    try {
      const signatureNhan = req.headers['x-signature'] || req.headers['x-webhook-signature'];
      if (!signatureNhan) {
        return res.status(401).json({
          success: false,
          message: 'Thiếu chữ ký xác thực Webhook (x-signature hoặc x-webhook-signature).'
        });
      }

      const secret = lay_webhook_secret();
      const expectedSignature = tinh_chu_ky_hmac(req.body, secret);

      // So sanh chu ky an toan chong Timing Attack
      const bufNhan = Buffer.from(String(signatureNhan), 'hex');
      const bufMongDoi = Buffer.from(expectedSignature, 'hex');

      if (bufNhan.length !== bufMongDoi.length || !crypto.timingSafeEqual(bufNhan, bufMongDoi)) {
        return res.status(401).json({
          success: false,
          message: 'Chữ ký Webhook không hợp lệ.'
        });
      }

      // Trich xuat du lieu tu webhook payload (ho tro ca standard format va flat format)
      const payload = req.body || {};
      const data = payload.data || payload;

      const don_hang_id = Number(data.don_hang_id || data.order_id);
      const ma_giao_dich = data.ma_giao_dich || data.transaction_id || `TXN_${Date.now()}`;
      const trang_thai = data.trang_thai || data.status || 'paid';

      if (!don_hang_id) {
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu webhook thiếu mã đơn hàng (don_hang_id).'
        });
      }

      const ket_qua = thanh_toan.xu_ly_webhook_giao_dich({
        don_hang_id,
        trang_thai: trang_thai === 'completed' || trang_thai === 'success' ? 'paid' : trang_thai,
        ma_giao_dich
      });

      if (!ket_qua.success) {
        if (ket_qua.code === 'NOT_FOUND') {
          return res.status(404).json({
            success: false,
            message: ket_qua.message
          });
        }
        return res.status(400).json({
          success: false,
          message: ket_qua.message
        });
      }

      return res.status(200).json({
        success: true,
        code: ket_qua.code,
        message: ket_qua.message,
        du_lieu: ket_qua.du_lieu
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = dieu_khien_webhook;
