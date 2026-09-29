// Kiem thu API San pham: san_pham_api.test.js
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { chay_khoi_tao } from '../../co_so_du_lieu/khoi_tao_database';

beforeAll(() => {
  chay_khoi_tao();
});

describe('API San pham (TV1)', () => {
  it('GET /api/san-pham - Lay danh sach san pham co phan trang', async () => {
    const res = await request(app).get('/api/san-pham?trang=1&gioi_han=10');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeLessThanOrEqual(10);
    expect(res.body.phan_trang).toBeDefined();
    expect(res.body.phan_trang.tong_so_muc).toBeGreaterThan(0);
  });

  it('GET /api/san-pham - Tim kiem theo tu khoa', async () => {
    const res = await request(app).get('/api/san-pham?tu_khoa=Double A');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].ten_san_pham).toContain('Double A');
  });

  it('GET /api/san-pham - Loc theo khoang gia', async () => {
    const res = await request(app).get('/api/san-pham?gia_tu=50000&gia_den=100000');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    for (const sp of res.body.data) {
      expect(sp.gia).toBeGreaterThanOrEqual(50000);
      expect(sp.gia).toBeLessThanOrEqual(100000);
    }
  });

  it('GET /api/san-pham - Sap xep theo gia tang dan', async () => {
    const res = await request(app).get('/api/san-pham?sap_xep=gia_tang&gioi_han=5');
    expect(res.status).toBe(200);
    const prices = res.body.data.map(item => item.gia);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  it('GET /api/san-pham/:id - Lay chi tiet san pham ton tai', async () => {
    const res = await request(app).get('/api/san-pham/1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(1);
    expect(Array.isArray(res.body.data.hinh_anh)).toBe(true);
  });

  it('GET /api/san-pham/:id - Loi 404 khi ID khong ton tai', async () => {
    const res = await request(app).get('/api/san-pham/99999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/san-pham - Tu choi 403 khi khong co quyen Admin', async () => {
    const res = await request(app)
      .post('/api/san-pham')
      .send({
        ten_san_pham: 'San pham kiem thu',
        danh_muc_id: 1,
        gia: 50000
      });
    expect(res.status).toBe(403);
  });

  it('POST /api/san-pham - Cho phep Admin tao san pham moi hop le', async () => {
    const res = await request(app)
      .post('/api/san-pham')
      .set('x-user-id', '1')
      .set('x-user-role', 'admin')
      .send({
        ten_san_pham: 'But bi kiem thu dac biet',
        danh_muc_id: 2,
        gia: 12000,
        gia_goc: 15000,
        so_luong_ton: 100,
        thuong_hieu: 'Thien Long',
        don_vi_tinh: 'Cay'
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.ten_san_pham).toBe('But bi kiem thu dac biet');
  });

  it('PUT /api/san-pham/:id - Admin cap nhat san pham', async () => {
    const res = await request(app)
      .put('/api/san-pham/1')
      .set('x-user-id', '1')
      .set('x-user-role', 'admin')
      .send({
        gia: 88000
      });
    expect(res.status).toBe(200);
    expect(res.body.data.gia).toBe(88000);
  });

  // --- SECURITY REGRESSION TESTS ---
  it('SECURITY: Chặn SQL Injection trong tìm kiếm sản phẩm (tu_khoa)', async () => {
    const payload = "' OR '1'='1";
    const res = await request(app).get(`/api/san-pham?tu_khoa=${encodeURIComponent(payload)}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // Prepared statement xu ly payload nhu mot chuoi text thuan tuy
    // Khong duoc tra ve toan bo san pham vi payload khong lam vo cau truc SQL
    expect(res.body.data.length).toBe(0);
  });

  it('SECURITY: Chặn SQL Injection trong tham số lọc (gia_tu)', async () => {
    const payload = "0; DROP TABLE san_pham; --";
    const res = await request(app).get(`/api/san-pham?gia_tu=${encodeURIComponent(payload)}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // Xac nhan bang san_pham van nguyen ven, khong bi pha huy boi SQL injection
    const checkRes = await request(app).get('/api/san-pham/1');
    expect(checkRes.status).toBe(200);
    expect(checkRes.body.data.id).toBe(1);
  });
});