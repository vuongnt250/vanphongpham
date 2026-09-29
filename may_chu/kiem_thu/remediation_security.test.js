import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import crypto from 'crypto';
import app from '../app';
import { lay_ket_noi } from '../../co_so_du_lieu/ket_noi';
import { chay_khoi_tao } from '../../co_so_du_lieu/khoi_tao_database';
import { lay_jwt_secret } from '../trung_gian/xac_thuc';
import { tao_gioi_han } from '../trung_gian/gioi_han_truy_cap';
import express from 'express';

describe('BẢO MẬT & REMEDIATION PRODUCTION HARDENING TEST SUITE', () => {
  let adminToken = '';
  let customerToken = '';
  let testOrderId = 0;

  beforeAll(async () => {
    chay_khoi_tao();

    // Dang nhap admin de kiem tra yeu_cau_doi_mat_khau mac dinh
    const resAdmin = await request(app)
      .post('/api/auth/dang-nhap')
      .send({ tai_khoan: 'admin', mat_khau: '123456' });
    
    expect(resAdmin.status).toBe(200);
    adminToken = resAdmin.body.du_lieu.token;

    // Tao hoac dang nhap customer de tao don hang test webhook
    const resCust = await request(app)
      .post('/api/auth/dang-nhap')
      .send({ tai_khoan: 'customer', mat_khau: '123456' });

    expect(resCust.status).toBe(200);
    customerToken = resCust.body.du_lieu.token;

    // Tao 1 don hang test
    const resDonHang = await request(app)
      .post('/api/don-hang')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        ten_nguoi_nhan: 'Người Nhận Test Webhook',
        so_dien_thoai: '0912345678',
        dia_chi_giao_hang: 'Số 10 Hoàn Kiếm, Hà Nội',
        phuong_thuc_thanh_toan: 'chuyen_khoan',
        danh_sach_san_pham: [
          { san_pham_id: 1, so_luong: 1 }
        ]
      });

    expect(resDonHang.status).toBe(201);
    testOrderId = resDonHang.body.du_lieu.id;
  });

  // ==========================================
  // 1. JWT SECRET & ENV SECURITY
  // ==========================================
  describe('1. JWT Secret & Fail-Fast Environment Security', () => {
    it('Phải lấy JWT_SECRET từ biến môi trường', () => {
      const secret = lay_jwt_secret();
      expect(secret).toBeDefined();
      expect(typeof secret).toBe('string');
      expect(secret.length).toBeGreaterThanOrEqual(16);
    });

    it('Phải ném lỗi FATAL/CRITICAL SECURITY nếu production thiếu JWT_SECRET', () => {
      const oldEnv = process.env.NODE_ENV;
      const oldSecret = process.env.JWT_SECRET;

      try {
        process.env.NODE_ENV = 'production';
        delete process.env.JWT_SECRET;

        expect(() => lay_jwt_secret()).toThrow(/(CRITICAL|FATAL) SECURITY ERROR/);
      } finally {
        process.env.NODE_ENV = oldEnv;
        process.env.JWT_SECRET = oldSecret;
      }
    });

    it('Từ chối token giả mạo ký bằng secret khác', async () => {
      const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTk5OSwidmFpX3RybyI6ImFkbWluIn0.FAKESIGNATURE1234567890';
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${fakeToken}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // ==========================================
  // 2. DEFAULT PASSWORD & FORCED PASSWORD CHANGE
  // ==========================================
  describe('2. Default Password Security & Forced Password Change Flag', () => {
    it('Tài khoản admin mặc định khi seed phải có yeu_cau_doi_mat_khau = true', async () => {
      const res = await request(app)
        .post('/api/auth/dang-nhap')
        .send({ tai_khoan: 'admin', mat_khau: '123456' });

      expect(res.status).toBe(200);
      expect(res.body.du_lieu.user.yeu_cau_doi_mat_khau).toBe(true);
    });

    it('Tài khoản staff mặc định khi seed phải có yeu_cau_doi_mat_khau = true', async () => {
      const res = await request(app)
        .post('/api/auth/dang-nhap')
        .send({ tai_khoan: 'staff', mat_khau: '123456' });

      expect(res.status).toBe(200);
      expect(res.body.du_lieu.user.yeu_cau_doi_mat_khau).toBe(true);
    });

    it('Sau khi đổi mật khẩu thành công, cờ yeu_cau_doi_mat_khau phải chuyển thành false', async () => {
      // Đổi mật khẩu cho admin
      const resDoi = await request(app)
        .post('/api/auth/doi-mat-khau')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          mat_khau_cu: '123456',
          mat_khau_moi: 'AdminSecure@2026!'
        });

      expect(resDoi.status).toBe(200);
      expect(resDoi.body.success).toBe(true);

      // Đăng nhập lại với mật khẩu mới
      const resMoi = await request(app)
        .post('/api/auth/dang-nhap')
        .send({ tai_khoan: 'admin', mat_khau: 'AdminSecure@2026!' });

      expect(resMoi.status).toBe(200);
      expect(resMoi.body.du_lieu.user.yeu_cau_doi_mat_khau).toBe(false);

      // Khôi phục mật khẩu admin về 123456 để test suites khác chạy bình thường
      await request(app)
        .post('/api/auth/doi-mat-khau')
        .set('Authorization', `Bearer ${resMoi.body.du_lieu.token}`)
        .send({
          mat_khau_cu: 'AdminSecure@2026!',
          mat_khau_moi: '123456'
        });
    });
  });

  // ==========================================
  // 3. RATE LIMITING
  // ==========================================
  describe('3. Rate Limiting Protection', () => {
    it('Phải trả về HTTP 429 Too Many Requests khi vượt quá giới hạn cấu hình', async () => {
      const testApp = express();
      const limiter = tao_gioi_han(60000, 2, 'Vượt ngưỡng rate limit test.');
      testApp.use('/test-limit', limiter, (req, res) => res.json({ ok: true }));

      // Request 1: OK
      const r1 = await request(testApp).get('/test-limit');
      expect(r1.status).toBe(200);

      // Request 2: OK
      const r2 = await request(testApp).get('/test-limit');
      expect(r2.status).toBe(200);

      // Request 3: Bị chặn với 429
      const r3 = await request(testApp).get('/test-limit');
      expect(r3.status).toBe(429);
      expect(r3.body.success).toBe(false);
      expect(r3.body.message).toContain('Vượt ngưỡng rate limit test.');
    });
  });

  // ==========================================
  // 4. SECURE PAYMENT WEBHOOK INFRASTRUCTURE
  // ==========================================
  describe('4. Secure Payment Webhook Infrastructure (Provider Pending)', () => {
    const webhookSecret = process.env.WEBHOOK_SECRET || 'smartdesk_dev_webhook_secret_2026';

    it('Từ chối webhook nếu thiếu header x-signature (401)', async () => {
      const res = await request(app)
        .post('/api/thanh-toan/webhook')
        .send({
          don_hang_id: testOrderId,
          ma_giao_dich: 'TXN_TEST_001',
          trang_thai: 'paid'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Thiếu chữ ký');
    });

    it('Từ chối webhook nếu chữ ký x-signature sai hoặc bị giả mạo (401)', async () => {
      const payload = {
        don_hang_id: testOrderId,
        ma_giao_dich: 'TXN_TEST_001',
        trang_thai: 'paid'
      };

      const invalidSig = 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';

      const res = await request(app)
        .post('/api/thanh-toan/webhook')
        .set('x-signature', invalidSig)
        .send(payload);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('không hợp lệ');
    });

    it('Chấp nhận webhook hợp lệ với HMAC-SHA256 signature và cập nhật trạng thái thanh toán đơn hàng', async () => {
      const payload = {
        don_hang_id: testOrderId,
        ma_giao_dich: 'TXN_VNPAY_REAL_778899',
        trang_thai: 'paid'
      };

      const validSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');

      const res = await request(app)
        .post('/api/thanh-toan/webhook')
        .set('x-signature', validSig)
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.code).toBe('PROCESSED');
      expect(res.body.du_lieu.trang_thai).toBe('paid');
      expect(res.body.du_lieu.ma_giao_dich).toBe('TXN_VNPAY_REAL_778899');

      // Kiem tra don hang da duoc cap nhat sang 'da_thanh_toan'
      const db = lay_ket_noi();
      const orderDb = db.prepare('SELECT trang_thai_thanh_toan FROM don_hang WHERE id = ?').get(testOrderId);
      expect(orderDb.trang_thai_thanh_toan).toBe('da_thanh_toan');
    });

    it('Bảo đảm tính Idempotency: gửi lại cùng webhook đã thanh toán không bị lỗi (200 ALREADY_PAID)', async () => {
      const payload = {
        don_hang_id: testOrderId,
        ma_giao_dich: 'TXN_VNPAY_REAL_778899',
        trang_thai: 'paid'
      };

      const validSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');

      const res = await request(app)
        .post('/api/thanh-toan/webhook')
        .set('x-signature', validSig)
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.code).toBe('ALREADY_PAID');
      expect(res.body.message).toContain('Idempotent');
    });
  });

  // ==========================================
  // 5. CORS WHITELIST PROTECTION
  // ==========================================
  describe('5. CORS Whitelist Policy Enforcement', () => {
    it('Cho phép truy cập từ origin hợp lệ trong whitelist (localhost:5173)', async () => {
      const res = await request(app)
        .get('/api/san-pham')
        .set('Origin', 'http://localhost:5173');

      expect(res.status).toBe(200);
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });

    it('Chặn truy cập từ origin độc hại không nằm trong whitelist', async () => {
      const res = await request(app)
        .get('/api/san-pham')
        .set('Origin', 'http://malicious-hacker-site.ru');

      // Express CORS middleware tu choi voi status 403 Forbidden
      expect(res.status).toBe(403);
      expect(res.text || res.body.message).toContain('CORS policy');
    });
  });

  // ==========================================
  // 6. DATABASE CART (SINGLE SOURCE OF TRUTH)
  // ==========================================
  describe('6. Database Cart Persistence & API Contract', () => {
    it('Cho phép người dùng đã đăng nhập thêm và truy xuất giỏ hàng từ SQLite DB', async () => {
      // Xoa sach gio hang cu de bat dau test sach
      await request(app)
        .delete('/api/gio-hang/xoa-het')
        .set('Authorization', `Bearer ${customerToken}`);

      // Them san pham id 1 vao gio
      const resThem = await request(app)
        .post('/api/gio-hang/them')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ san_pham_id: 1, so_luong: 2 });

      expect(resThem.status).toBe(200);
      expect(resThem.body.success).toBe(true);

      // Lay giỏ hàng tu DB
      const resLay = await request(app)
        .get('/api/gio-hang')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(resLay.status).toBe(200);
      expect(resLay.body.du_lieu.danh_sach.length).toBeGreaterThanOrEqual(1);
      const item = resLay.body.du_lieu.danh_sach.find(it => it.san_pham.id === 1);
      expect(item).toBeDefined();
      expect(item.so_luong).toBe(2);

      // Don dep gio hang sau test
      await request(app)
        .delete('/api/gio-hang/xoa-het')
        .set('Authorization', `Bearer ${customerToken}`);
    });
  });
});
