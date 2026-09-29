// Bo kiem thu Bao mat chuyen sau & Cac ca kiem thu phu dinh (Security & Negative Tests) - Phase P
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import { chay_khoi_tao } from '../../co_so_du_lieu/khoi_tao_database';
import { JWT_SECRET } from '../trung_gian/xac_thuc';

describe('PHASE P: Security & Negative Tests Suite', () => {
  let tokenCustomerA;
  let tokenCustomerB;
  let tokenAdmin;
  let expiredToken;
  const invalidToken = 'Bearer invalid.token.payload';

  beforeAll(() => {
    chay_khoi_tao();

    // User A: id 2 (minhanh)
    tokenCustomerA = 'Bearer ' + jwt.sign({ id: 2, ten_dang_nhap: 'minhanh', vai_tro: 'customer' }, JWT_SECRET, { expiresIn: '1h' });
    // User B: id 3 (hoangnam)
    tokenCustomerB = 'Bearer ' + jwt.sign({ id: 3, ten_dang_nhap: 'hoangnam', vai_tro: 'customer' }, JWT_SECRET, { expiresIn: '1h' });
    // Admin: id 1 (admin)
    tokenAdmin = 'Bearer ' + jwt.sign({ id: 1, ten_dang_nhap: 'admin', vai_tro: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    // Expired Token
    expiredToken = 'Bearer ' + jwt.sign({ id: 2, ten_dang_nhap: 'minhanh', vai_tro: 'customer' }, JWT_SECRET, { expiresIn: '-10s' });
  });

  describe('1. Authentication Negative Tests', () => {
    it('Tu choi dang nhap voi mat khau sai (401)', async () => {
      const res = await request(app)
        .post('/api/auth/dang-nhap')
        .send({ ten_dang_nhap: 'admin', mat_khau: 'mat_khau_sai_hoan_toan' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('Tu choi dang ky tai khoan bi trung ten dang nhap', async () => {
      const res = await request(app)
        .post('/api/auth/dang-ky')
        .send({
          ten_dang_nhap: 'minhanh', // Da ton tai trong database.json
          mat_khau: '123456',
          email: 'emailmoi123456@gmail.com',
          ho_ten: 'Test Trung'
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/đã tồn tại/i);
    });

    it('Tu choi dang ky tai khoan bi trung email', async () => {
      const res = await request(app)
        .post('/api/auth/dang-ky')
        .send({
          ten_dang_nhap: 'user_doc_nhat_999',
          mat_khau: '123456',
          email: 'admin@smartdesk.vn', // Email da ton tai
          ho_ten: 'Test Trung Email'
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/email.*đã được sử dụng/i);
    });

    it('Tu choi truy cap route yeu cau dang nhap khi token sai format', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', invalidToken);
      expect(res.status).toBe(401);
    });

    it('Tu choi truy cap khi token da het han (expired)', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', expiredToken);
      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/hết hạn/i);
    });

    it('Tu choi khi khong truyen token vao route can xac thuc', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('2. Authorization & IDOR Negative Tests', () => {
    it('Tu choi quyen Admin khi Customer truy cap API Admin (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/admin/thong-ke')
        .set('Authorization', tokenCustomerA);
      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/không có quyền/i);
    });

    it('IDOR: User B khong the xem don hang cua User A (403 Forbidden)', async () => {
      // Don hang #1001 thuoc ve user_id 2 (User A)
      const res = await request(app)
        .get('/api/don-hang/1001')
        .set('Authorization', tokenCustomerB); // User B (id 3) truy cap
      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/không có quyền/i);
    });

    it('IDOR: User A khong the sua dia chi cua User B (403 Forbidden)', async () => {
      // Dia chi #2 thuoc ve user_id 3 (User B)
      const res = await request(app)
        .put('/api/dia-chi/2')
        .set('Authorization', tokenCustomerA) // User A (id 2) sua
        .send({ ten_nguoi_nhan: 'Hacker Name' });
      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/không có quyền/i);
    });

    it('IDOR: User A khong the xoa dia chi cua User B (403 Forbidden)', async () => {
      const res = await request(app)
        .delete('/api/dia-chi/2')
        .set('Authorization', tokenCustomerA);
      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/không có quyền/i);
    });
  });

  describe('3. Product & Cart Negative Tests', () => {
    it('Tra ve loi 404 khi tim san pham khong ton tai', async () => {
      const res = await request(app).get('/api/san-pham/999999');
      expect(res.status).toBe(404);
    });

    it('Tu choi them so luong am vao gio hang', async () => {
      const res = await request(app)
        .post('/api/gio-hang/them')
        .set('Authorization', tokenCustomerA)
        .send({ san_pham_id: 1, so_luong: -5 });
      expect(res.status).toBe(400);
    });

    it('Tu choi them so luong 0 vao gio hang', async () => {
      const res = await request(app)
        .post('/api/gio-hang/them')
        .set('Authorization', tokenCustomerA)
        .send({ san_pham_id: 1, so_luong: 0 });
      expect(res.status).toBe(400);
    });

    it('Tu choi them so luong vuot qua ton kho hien co', async () => {
      const res = await request(app)
        .post('/api/gio-hang/them')
        .set('Authorization', tokenCustomerA)
        .send({ san_pham_id: 1, so_luong: 999999 });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/vượt quá tồn kho/i);
    });
  });

  describe('4. Order & Transaction Negative Tests', () => {
    it('Tu choi tao don hang khi danh sach san pham trong (empty cart)', async () => {
      const res = await request(app)
        .post('/api/don-hang')
        .set('Authorization', tokenCustomerA)
        .send({
          ten_nguoi_nhan: 'Nguyen Van A',
          so_dien_thoai: '0901234567',
          dia_chi_giao_hang: '123 Test Street',
          danh_sach_san_pham: []
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/(trống|ít nhất 1 sản phẩm)/i);
    });

    it('Tu choi tao don hang khi san pham khong ton tai', async () => {
      const res = await request(app)
        .post('/api/don-hang')
        .set('Authorization', tokenCustomerA)
        .send({
          ten_nguoi_nhan: 'Nguyen Van A',
          so_dien_thoai: '0901234567',
          dia_chi_giao_hang: '123 Test Street',
          danh_sach_san_pham: [{ san_pham_id: 88888, so_luong: 1 }]
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/không tồn tại/i);
    });

    it('Tu choi tao don hang khi so luong vuot qua ton kho (Atomic Rollback)', async () => {
      const res = await request(app)
        .post('/api/don-hang')
        .set('Authorization', tokenCustomerA)
        .send({
          ten_nguoi_nhan: 'Nguyen Van A',
          so_dien_thoai: '0901234567',
          dia_chi_giao_hang: '123 Test Street',
          danh_sach_san_pham: [{ san_pham_id: 1, so_luong: 50000 }]
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/chỉ còn.*sản phẩm trong kho/i);
    });

    it('Chong Price Tampering: Bo qua gia gia mao tu client va tinh dung gia DB', async () => {
      // San pham #1 gia that la 85.000d. Client gui gia 100d.
      const res = await request(app)
        .post('/api/don-hang')
        .set('Authorization', tokenCustomerA)
        .send({
          ten_nguoi_nhan: 'Nguyen Van A',
          so_dien_thoai: '0901234567',
          dia_chi_giao_hang: '123 Test Street',
          danh_sach_san_pham: [{ san_pham_id: 1, so_luong: 1, gia: 100 }]
        });
      expect(res.status).toBe(201);
      // Tam tinh phai la 85.000d, khong the la 100d
      expect(res.body.du_lieu.tam_tinh).toBe(85000);
      expect(res.body.du_lieu.danh_sach_san_pham[0].gia).toBe(85000);
    });
  });

  describe('5. Coupon Validation Negative Tests', () => {
    it('Bao loi khi ma voucher khong ton tai', async () => {
      const res = await request(app)
        .post('/api/voucher/kiem-tra')
        .send({ ma_voucher: 'MA_KHONG_CO_THUC', tong_tien: 500000 });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/không tồn tại/i);
    });

    it('Bao loi khi don hang chua dat gia tri toi thieu', async () => {
      // SMART20K yeu cau don toi thieu 200.000d. Gui don 50.000d.
      const res = await request(app)
        .post('/api/voucher/kiem-tra')
        .send({ ma_voucher: 'SMART20K', tong_tien: 50000 });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/chưa đạt giá trị tối thiểu/i);
    });
  });

  describe('6. State Machine & Order Transition Negative Tests', () => {
    it('Tu choi buoc nhay trang thai phi logic (DELIVERED -> PENDING)', async () => {
      // Don hang 1001 da DELIVERED
      const res = await request(app)
        .put('/api/admin/don-hang/1001/trang-thai')
        .set('Authorization', tokenAdmin)
        .send({ trang_thai: 'PENDING' });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/không thể chuyển trạng thái/i);
    });

    it('Customer khong the huy don hang khi don da o trang thai SHIPPING', async () => {
      // Don hang 1002 da SHIPPING, thuoc ve user_id 3 (tokenCustomerB)
      const res = await request(app)
        .post('/api/don-hang/1002/huy')
        .set('Authorization', tokenCustomerB);
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Chỉ có thể hủy đơn hàng khi ở trạng thái/i);
    });
  });
});
