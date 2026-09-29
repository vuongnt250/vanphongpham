// Kiem thu API AI Chat: ai_chat_api.test.js
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { chay_khoi_tao } from '../../co_so_du_lieu/khoi_tao_database';

beforeAll(() => {
  chay_khoi_tao();
});

describe('API Tro ly AI SmartDesk (POST /api/ai-chat)', () => {
  it('Tu choi neu khong co noi dung tin nhan (400)', async () => {
    const res = await request(app)
      .post('/api/ai-chat')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('không được để trống');
  });

  it('Tu choi neu tin nhan chi chua khoang trang (400)', async () => {
    const res = await request(app)
      .post('/api/ai-chat')
      .send({ tin_nhan: '   ' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('Phan hoi loi chao va gioi thieu tro ly AI', async () => {
    const res = await request(app)
      .post('/api/ai-chat')
      .send({ tin_nhan: 'Xin chào SmartDesk' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.tin_nhan_ai).toContain('SmartDesk');
    expect(Array.isArray(res.body.du_lieu.san_pham_goi_y)).toBe(true);
  });

  it('Tra cuu va goi y san pham theo tu khoa (But / Giay / Deli...)', async () => {
    const res = await request(app)
      .post('/api/ai-chat')
      .send({ tin_nhan: 'Tôi muốn tìm bút bi' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.tin_nhan_ai).toBeDefined();
    expect(Array.isArray(res.body.du_lieu.san_pham_goi_y)).toBe(true);
    expect(res.body.du_lieu.san_pham_goi_y.length).toBeGreaterThan(0);
  });

  it('Tu van ma giam gia va voucher dang hoat dong', async () => {
    const res = await request(app)
      .post('/api/ai-chat')
      .send({ tin_nhan: 'Hiện tại có mã giảm giá nào không?' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.tin_nhan_ai).toBeDefined();
  });

  it('Tu van chinh sach doi tra san pham', async () => {
    const res = await request(app)
      .post('/api/ai-chat')
      .send({ tin_nhan: 'Chính sách đổi trả hàng như thế nào?' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.tin_nhan_ai).toContain('đổi trả');
    expect(res.body.du_lieu.tin_nhan_ai).toContain('7 ngày');
  });

  it('Tu van chinh sach giao hang va phi van chuyen', async () => {
    const res = await request(app)
      .post('/api/ai-chat')
      .send({ tin_nhan: 'Phí giao hàng và vận chuyển tính sao?' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.tin_nhan_ai).toContain('giao hàng');
  });

  it('Goi y san pham ban chay / hot', async () => {
    const res = await request(app)
      .post('/api/ai-chat')
      .send({ tin_nhan: 'Cho tôi xem các sản phẩm bán chạy nhất' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.du_lieu.san_pham_goi_y)).toBe(true);
    expect(res.body.du_lieu.san_pham_goi_y.length).toBeGreaterThan(0);
  });
});
