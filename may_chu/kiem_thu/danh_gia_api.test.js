// Kiem thu API Danh gia: danh_gia_api.test.js
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { chay_khoi_tao } from '../../co_so_du_lieu/khoi_tao_database';

beforeAll(() => {
  chay_khoi_tao();
});

describe('API Danh gia san pham (TV1)', () => {
  it('GET /api/san-pham/:id/danh-gia - Lay danh sach danh gia va thong ke', async () => {
    const res = await request(app).get('/api/san-pham/1/danh-gia');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.thong_ke).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/san-pham/:id/danh-gia - Tu choi 401 neu chua dang nhap (khong co token/user)', async () => {
    const res = await request(app)
      .post('/api/san-pham/1/danh-gia')
      .send({
        so_sao: 5,
        noi_dung: 'Hang rat tot!'
      });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/san-pham/:id/danh-gia - Tu choi 400 neu so sao khong hop le', async () => {
    const res = await request(app)
      .post('/api/san-pham/1/danh-gia')
      .set('x-user-id', '2')
      .send({
        so_sao: 6, // Vuot qua 5 sao
        noi_dung: 'Hang rat tot!'
      });
    expect(res.status).toBe(400);
  });

  it('POST /api/san-pham/:id/danh-gia - Tu choi 400 neu noi dung qua ngan', async () => {
    const res = await request(app)
      .post('/api/san-pham/1/danh-gia')
      .set('x-user-id', '2')
      .send({
        so_sao: 5,
        noi_dung: 'ok' // Duoi 3 ky tu
      });
    expect(res.status).toBe(400);
  });

  it('POST /api/san-pham/:id/danh-gia - Dang nhap va gui danh gia thanh cong, tu dong tinh diem', async () => {
    const res = await request(app)
      .post('/api/san-pham/1/danh-gia')
      .set('x-user-id', '3')
      .send({
        so_sao: 5,
        noi_dung: 'Chat luong giay in cuc ky tuyet voi!'
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user_id).toBe(3);
    expect(res.body.thong_ke.tong_so_danh_gia).toBeGreaterThan(0);
    expect(res.body.thong_ke.diem_trung_binh).toBeGreaterThan(0);
  });

  // --- SECURITY REGRESSION TEST ---
  it('SECURITY: user_id spoofing - Server chi lay user_id tu auth header (req.user.id), bo qua user_id trong body', async () => {
    const res = await request(app)
      .post('/api/san-pham/1/danh-gia')
      .set('x-user-id', '3') // Auth la user_id = 3
      .send({
        so_sao: 5,
        noi_dung: 'Co tinh gia mao user_id trong request body!',
        user_id: 999 // Gia mao thanh user 999
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user_id).toBe(3); // Phai la 3 (tu req.user.id)
    expect(res.body.data.user_id).not.toBe(999); // Tuyet doi khong lay 999 tu body
  });
});