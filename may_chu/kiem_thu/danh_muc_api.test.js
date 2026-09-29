// Kiem thu API Danh muc: danh_muc_api.test.js
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { chay_khoi_tao } from '../../co_so_du_lieu/khoi_tao_database';

beforeAll(() => {
  chay_khoi_tao();
});

describe('API Danh muc (TV1)', () => {
  it('GET /api/danh-muc - Lay toan bo danh muc', async () => {
    const res = await request(app).get('/api/danh-muc');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(7);
  });

  it('GET /api/danh-muc/:id - Lay chi tiet danh muc theo ID', async () => {
    const res = await request(app).get('/api/danh-muc/1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(1);
    expect(res.body.data.duong_dan_danh_muc).toBe('giay-in-san-pham-tu-giay');
  });

  it('GET /api/danh-muc/:id/san-pham - Lay san pham theo danh muc', async () => {
    const res = await request(app).get('/api/danh-muc/1/san-pham');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.danh_muc).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    for (const sp of res.body.data) {
      expect(sp.danh_muc_id).toBe(1);
    }
  });

  it('POST /api/danh-muc - Tu choi neu khong co quyen Admin', async () => {
    const res = await request(app).post('/api/danh-muc').send({
      ten_danh_muc: 'Danh muc moi',
      duong_dan_danh_muc: 'danh-muc-moi'
    });
    expect(res.status).toBe(403);
  });

  it('POST /api/danh-muc - Admin tao danh muc moi', async () => {
    const res = await request(app)
      .post('/api/danh-muc')
      .set('x-user-id', '1')
      .set('x-user-role', 'admin')
      .send({
        ten_danh_muc: 'Thiet bi hoi nghi',
        duong_dan_danh_muc: 'thiet-bi-hoi-nghi',
        mo_ta: 'Thiet bi hoi nghi va thuyet trinh'
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.ten_danh_muc).toBe('Thiet bi hoi nghi');
  });
});