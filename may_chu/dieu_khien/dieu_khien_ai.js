// Dieu khien AI Chat (SmartDesk AI Assistant)
const dich_vu_ai = require('../dich_vu/dich_vu_ai');

const dieu_khien_ai = {
  async xu_ly_chat(req, res, next) {
    try {
      const { tin_nhan, lich_su } = req.body;

      if (!tin_nhan || typeof tin_nhan !== 'string' || !tin_nhan.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Nội dung tin nhắn không được để trống.'
        });
      }

      const ket_qua = await dich_vu_ai.xu_ly_chat({
        tin_nhan: tin_nhan.trim(),
        lich_su: Array.isArray(lich_su) ? lich_su : []
      });

      return res.status(200).json({
        success: true,
        message: 'Xử lý tin nhắn AI thành công.',
        du_lieu: ket_qua
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = dieu_khien_ai;
