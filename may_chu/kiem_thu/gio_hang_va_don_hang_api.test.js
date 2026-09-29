// Kiem thu API Gio hang, Don hang, Thanh toan & Voucher (TV2): gio_hang_va_don_hang_api.test.js
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { chay_khoi_tao } from '../../co_so_du_lieu/khoi_tao_database';
import san_pham from '../../co_so_du_lieu/mo_hinh/san_pham';

beforeAll(() => {
  chay_khoi_tao();
});

describe('API Gio hang, Voucher & Don hang (TV2)', () => {
  let tokenUser = '';
  let tokenUserKhac = '';
  let donHangMoiId = null;

  beforeAll(async () => {
    // Dang nhap user chinh
    const resLogin = await request(app).post('/api/auth/dang-nhap').send({
      tai_khoan: 'minhanh@gmail.com',
      mat_khau: '123456'
    });
    tokenUser = resLogin.body.du_lieu.token;

    // Dang nhap user khac de test IDOR
    const resLoginKhac = await request(app).post('/api/auth/dang-nhap').send({
      tai_khoan: 'admin@smartdesk.vn',
      mat_khau: '123456'
    });
    // Tao them user thuong khac
    const resUserKhac = await request(app).post('/api/auth/dang-ky').send({
      ten_dang_nhap: `user_khac_${Date.now()}`,
      email: `user_khac_${Date.now()}@gmail.com`,
      mat_khau: '123456',
      ho_ten: 'Khach Hang B'
    });
    tokenUserKhac = resUserKhac.body.du_lieu.token;
  });

  it('POST /api/gio-hang/them - Them san pham vao gio hang DB', async () => {
    const res = await request(app)
      .post('/api/gio-hang/them')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        san_pham_id: 1,
        so_luong: 2
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.danh_sach.length).toBeGreaterThanOrEqual(1);
    expect(res.body.du_lieu.tong_so_luong).toBeGreaterThanOrEqual(2);
  });

  it('POST /api/gio-hang/them - Tu choi neu so luong vuot qua ton kho', async () => {
    const res = await request(app)
      .post('/api/gio-hang/them')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        san_pham_id: 1,
        so_luong: 999999
      });

    expect(res.status).toBe(400); // Handled business logic error
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('vượt quá tồn kho');
  });

  it('GET /api/gio-hang - Lay gio hang tu Database', async () => {
    const res = await request(app)
      .get('/api/gio-hang')
      .set('Authorization', `Bearer ${tokenUser}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.danh_sach.length).toBeGreaterThanOrEqual(1);
    expect(res.body.du_lieu.tam_tinh).toBeGreaterThan(0);
  });

  it('POST /api/voucher/kiem-tra - Kiem tra voucher hop le', async () => {
    const res = await request(app)
      .post('/api/voucher/kiem-tra')
      .send({
        ma_voucher: 'WELCOME10',
        tong_tien: 200000
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.so_tien_giam).toBe(20000); // 10% cua 200k = 20k
  });

  it('POST /api/voucher/kiem-tra - Tu choi voucher khong ton tai', async () => {
    const res = await request(app)
      .post('/api/voucher/kiem-tra')
      .send({
        ma_voucher: 'KHONG_CO_THAT_123',
        tong_tien: 200000
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/don-hang - Tao don hang voi Transaction, tru kho thuc te, bao mat gia tu DB', async () => {
    const spTruoc = san_pham.lay_theo_id(1);
    const tonKhoBanDau = spTruoc.so_luong_ton;

    // Client co tinh gui gia gia mao (100d) nhung server phai lay gia that trong DB (85.000d)
    const res = await request(app)
      .post('/api/don-hang')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        ten_nguoi_nhan: 'Nguyen Minh Anh',
        so_dien_thoai: '0912345678',
        dia_chi_giao_hang: 'Cau Giay, Ha Noi',
        ghi_chu: 'Giao nhanh giup em',
        ma_voucher: 'WELCOME10',
        phuong_thuc_thanh_toan: 'COD',
        danh_sach_san_pham: [
          { san_pham_id: 1, so_luong: 2, gia: 100 } // co tinh truyen gia fake 100d
        ]
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.id).toBeDefined();
    donHangMoiId = res.body.du_lieu.id;

    // Gia tam tinh phai tinh theo gia that trong DB (85.000 * 2 = 170.000)
    expect(res.body.du_lieu.tam_tinh).toBe(170000);
    expect(res.body.du_lieu.trang_thai).toBe('PENDING');

    // Kiem tra ton kho trong DB da bi tru 2 san pham
    const spSau = san_pham.lay_theo_id(1);
    expect(spSau.so_luong_ton).toBe(tonKhoBanDau - 2);

    // Kiem tra gio hang da duoc don sach sau khi dat hang
    const cartRes = await request(app)
      .get('/api/gio-hang')
      .set('Authorization', `Bearer ${tokenUser}`);
    expect(cartRes.body.du_lieu.danh_sach.length).toBe(0);
  });

  it('GET /api/don-hang/:id - Bao mat IDOR: Nguoi dung khac khong the xem don hang cua toi', async () => {
    const res = await request(app)
      .get(`/api/don-hang/${donHangMoiId}`)
      .set('Authorization', `Bearer ${tokenUserKhac}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('không có quyền xem');
  });

  it('GET /api/don-hang/cua-toi - Lay danh sach don hang cua chinh minh', async () => {
    const res = await request(app)
      .get('/api/don-hang/cua-toi')
      .set('Authorization', `Bearer ${tokenUser}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.du_lieu)).toBe(true);
    const timThay = res.body.du_lieu.find(d => d.id === donHangMoiId);
    expect(timThay).toBeDefined();
  });

  it('POST /api/don-hang/:id/huy - Huy don hang PENDING va hoan tra ton kho', async () => {
    const spTruocHuy = san_pham.lay_theo_id(1);
    const tonKhoTruocHuy = spTruocHuy.so_luong_ton;

    const res = await request(app)
      .post(`/api/don-hang/${donHangMoiId}/huy`)
      .set('Authorization', `Bearer ${tokenUser}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.trang_thai).toBe('CANCELLED');

    // Kiem tra ton kho da duoc hoan tra day du
    const spSauHuy = san_pham.lay_theo_id(1);
    expect(spSauHuy.so_luong_ton).toBe(tonKhoTruocHuy + 2);
  });
});
