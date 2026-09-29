// Kiem thu API Hinh anh: hinh_anh_api.test.js
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { chay_khoi_tao } from '../../co_so_du_lieu/khoi_tao_database';

beforeAll(() => {
  chay_khoi_tao();
});

describe('API Hinh anh san pham (TV1)', () => {
  it('GET /api/san-pham/:id/hinh-anh - Lay danh sach hinh anh cua san pham', async () => {
    const res = await request(app).get('/api/san-pham/1/hinh-anh');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('POST /api/san-pham/:id/hinh-anh - Admin them hinh anh moi', async () => {
    const res = await request(app)
      .post('/api/san-pham/1/hinh-anh')
      .set('x-user-id', '1')
      .set('x-user-role', 'admin')
      .send({
        duong_dan_anh: '/images/products/test-image.jpg',
        la_anh_chinh: 0
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.duong_dan_anh).toBe('/images/products/test-image.jpg');
  });

  it('PUT /api/san-pham/:san_pham_id/hinh-anh/:hinh_anh_id/anh-chinh - Admin dat anh chinh', async () => {
    const res = await request(app)
      .put('/api/san-pham/1/hinh-anh/1/anh-chinh')
      .set('x-user-id', '1')
      .set('x-user-role', 'admin');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.la_anh_chinh).toBe(1);
  });
});