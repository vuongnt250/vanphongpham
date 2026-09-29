// Kiem thu API Auth & User (TV2): auth_va_user_api.test.js
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { chay_khoi_tao } from '../../co_so_du_lieu/khoi_tao_database';

beforeAll(() => {
  chay_khoi_tao();
});

describe('API Xac thuc & Nguoi dung (TV2)', () => {
  const emailRandom = `test_user_${Date.now()}@gmail.com`;
  const usernameRandom = `user_${Date.now()}`;
  let tokenNguoiDung = '';
  let userId = null;

  it('POST /api/auth/dang-ky - Dang ky thanh cong', async () => {
    const res = await request(app)
      .post('/api/auth/dang-ky')
      .send({
        ten_dang_nhap: usernameRandom,
        email: emailRandom,
        mat_khau: '123456',
        ho_ten: 'Nguyen Van Test',
        so_dien_thoai: '0988777666'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.user).toBeDefined();
    expect(res.body.du_lieu.user.email).toBe(emailRandom);
    expect(res.body.du_lieu.token).toBeDefined();
    tokenNguoiDung = res.body.du_lieu.token;
    userId = res.body.du_lieu.user.id;
  });

  it('POST /api/auth/dang-ky - Loi khi trung lap email', async () => {
    const res = await request(app)
      .post('/api/auth/dang-ky')
      .send({
        ten_dang_nhap: `another_${Date.now()}`,
        email: emailRandom,
        mat_khau: '123456',
        ho_ten: 'Duplicate Email'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Email này đã được sử dụng');
  });

  it('POST /api/auth/dang-ky - Loi mat khau ngan hon 6 ky tu', async () => {
    const res = await request(app)
      .post('/api/auth/dang-ky')
      .send({
        ten_dang_nhap: `short_${Date.now()}`,
        email: `short_${Date.now()}@gmail.com`,
        mat_khau: '123',
        ho_ten: 'Short Pass'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('ít nhất 6 ký tự');
  });

  it('POST /api/auth/dang-nhap - Dang nhap thanh cong', async () => {
    const res = await request(app)
      .post('/api/auth/dang-nhap')
      .send({
        tai_khoan: emailRandom,
        mat_khau: '123456'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.token).toBeDefined();
    expect(res.body.du_lieu.user.email).toBe(emailRandom);
  });

  it('POST /api/auth/dang-nhap - Sai mat khau tra ve 401', async () => {
    const res = await request(app)
      .post('/api/auth/dang-nhap')
      .send({
        tai_khoan: emailRandom,
        mat_khau: 'wrongpassword'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/me - Lay thong tin voi Bearer JWT', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${tokenNguoiDung}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.id).toBe(userId);
  });

  it('GET /api/auth/me - Tu choi neu khong co token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('PUT /api/auth/cap-nhat - Cap nhat thong tin ca nhan', async () => {
    const res = await request(app)
      .put('/api/auth/cap-nhat')
      .set('Authorization', `Bearer ${tokenNguoiDung}`)
      .send({
        ho_ten: 'Nguyen Van Test Updated',
        so_dien_thoai: '0911222333'
      });

    expect(res.status).toBe(200);
    expect(res.body.du_lieu.ho_ten).toBe('Nguyen Van Test Updated');
    expect(res.body.du_lieu.so_dien_thoai).toBe('0911222333');
  });

  // Test Dia chi (Addresses)
  let diaChiId = null;
  it('POST /api/dia-chi - Them dia chi moi', async () => {
    const res = await request(app)
      .post('/api/dia-chi')
      .set('Authorization', `Bearer ${tokenNguoiDung}`)
      .send({
        ten_nguoi_nhan: 'Nguyen Van Test',
        so_dien_thoai: '0911222333',
        dia_chi_chi_tiet: '123 Pho Hue, Hai Ba Trung, Ha Noi',
        la_mac_dinh: 1
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.id).toBeDefined();
    diaChiId = res.body.du_lieu.id;
  });

  it('GET /api/dia-chi - Lay danh sach dia chi', async () => {
    const res = await request(app)
      .get('/api/dia-chi')
      .set('Authorization', `Bearer ${tokenNguoiDung}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.du_lieu)).toBe(true);
    expect(res.body.du_lieu.length).toBeGreaterThanOrEqual(1);
    expect(res.body.du_lieu[0].id).toBe(diaChiId);
  });

  it('DELETE /api/dia-chi/:id - Xoa dia chi', async () => {
    const res = await request(app)
      .delete(`/api/dia-chi/${diaChiId}`)
      .set('Authorization', `Bearer ${tokenNguoiDung}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
