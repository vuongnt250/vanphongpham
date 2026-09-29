// Kiem thu API Admin CMS & Quan ly kinh doanh (TV3): admin_api.test.js
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { chay_khoi_tao } from '../../co_so_du_lieu/khoi_tao_database';
import san_pham from '../../co_so_du_lieu/mo_hinh/san_pham';

beforeAll(() => {
  chay_khoi_tao();
});

describe('API Admin & Quan ly kinh doanh (TV3)', () => {
  let tokenAdmin = '';
  let tokenUser = '';

  beforeAll(async () => {
    // Login Admin
    const resAdmin = await request(app).post('/api/auth/dang-nhap').send({
      tai_khoan: 'admin@smartdesk.vn',
      mat_khau: '123456'
    });
    tokenAdmin = resAdmin.body.du_lieu.token;

    // Login Khach hang thuong
    const resUser = await request(app).post('/api/auth/dang-nhap').send({
      tai_khoan: 'minhanh@gmail.com',
      mat_khau: '123456'
    });
    tokenUser = resUser.body.du_lieu.token;
  });

  it('GET /api/admin/thong-ke - Nguoi dung thuong bi chan 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/admin/thong-ke')
      .set('Authorization', `Bearer ${tokenUser}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/admin/thong-ke - Admin lay thong ke KPI tu Database thuc te', async () => {
    const res = await request(app)
      .get('/api/admin/thong-ke')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const stats = res.body.du_lieu;
    expect(stats.tong_don_hang).toBeGreaterThanOrEqual(1);
    expect(stats.tong_san_pham).toBe(40);
    expect(stats.tong_khach_hang).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(stats.top_ban_chay)).toBe(true);
    expect(Array.isArray(stats.don_hang_moi_nhat)).toBe(true);
  });

  it('PUT /api/admin/don-hang/:id/trang-thai - Duyet chuyen trang thai hop le theo State Machine', async () => {
    // Tao 1 don hang PENDING de test flow chuan
    const resOrder = await request(app)
      .post('/api/don-hang')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        ten_nguoi_nhan: 'Nguoi Nhan Test',
        so_dien_thoai: '0987654321',
        dia_chi_giao_hang: 'Ha Noi',
        danh_sach_san_pham: [{ san_pham_id: 3, so_luong: 1 }]
      });

    const targetOrderId = resOrder.body.du_lieu.id;

    // Chuyen trang thai tu PENDING sang CONFIRMED
    const res1 = await request(app)
      .put(`/api/admin/don-hang/${targetOrderId}/trang-thai`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ trang_thai: 'CONFIRMED' });

    expect(res1.status).toBe(200);
    expect(res1.body.du_lieu.trang_thai).toBe('CONFIRMED');

    // Chuyen tiep tu CONFIRMED sang PROCESSING
    const res2 = await request(app)
      .put(`/api/admin/don-hang/${targetOrderId}/trang-thai`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ trang_thai: 'PROCESSING' });
    expect(res2.status).toBe(200);
    expect(res2.body.du_lieu.trang_thai).toBe('PROCESSING');
  });

  it('PUT /api/admin/don-hang/:id/trang-thai - Tu choi neu chuyen trang thai bat hop le', async () => {
    const ordersRes = await request(app)
      .get('/api/admin/don-hang')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    const deliveredOrder = ordersRes.body.du_lieu.find(d => d.trang_thai === 'DELIVERED');
    if (deliveredOrder) {
      // Tu DELIVERED chuyen ve PENDING phai bi chan
      const res = await request(app)
        .put(`/api/admin/don-hang/${deliveredOrder.id}/trang-thai`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ trang_thai: 'PENDING' });

      expect(res.status).toBe(400); // State machine violation handled with 400 Bad Request
      expect(res.body.message).toContain('Không thể chuyển trạng thái');
    }
  });

  it('CRUD Nha cung cap - Admin them, sua, xoa nha cung cap', async () => {
    // Them
    const resThem = await request(app)
      .post('/api/admin/nha-cung-cap')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        ten_nha_cung_cap: 'Nha San Xuat Giay Bai Bang',
        so_dien_thoai: '0243123456',
        email: 'contact@baibang.com',
        dia_chi: 'Phu Tho, Viet Nam'
      });

    expect(resThem.status).toBe(201);
    const nccId = resThem.body.du_lieu.id;

    // Sua
    const resSua = await request(app)
      .put(`/api/admin/nha-cung-cap/${nccId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        dia_chi: 'Ha Noi, Viet Nam'
      });
    expect(resSua.status).toBe(200);
    expect(resSua.body.du_lieu.dia_chi).toBe('Ha Noi, Viet Nam');

    // Xoa
    const resXoa = await request(app)
      .delete(`/api/admin/nha-cung-cap/${nccId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);
    expect(resXoa.status).toBe(200);
  });

  it('POST /api/admin/kho/dieu-chinh - Admin nhap kho va ghi nhat ky bien dong kho', async () => {
    const spTruoc = san_pham.lay_theo_id(2);
    const tonTruoc = spTruoc.so_luong_ton;

    const res = await request(app)
      .post('/api/admin/kho/dieu-chinh')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        san_pham_id: 2,
        loai_thay_doi: 'nhap_kho',
        so_luong_thay_doi: 50,
        ghi_chu: 'Nhap lo hang moi ve tu nha cung cap'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.ton_sau).toBe(tonTruoc + 50);

    const spSau = san_pham.lay_theo_id(2);
    expect(spSau.so_luong_ton).toBe(tonTruoc + 50);

    // Kiem tra danh sach nhat ky kho
    const logRes = await request(app)
      .get('/api/admin/kho?san_pham_id=2')
      .set('Authorization', `Bearer ${tokenAdmin}`);
    expect(logRes.status).toBe(200);
    expect(logRes.body.du_lieu.length).toBeGreaterThanOrEqual(1);
  });
});
