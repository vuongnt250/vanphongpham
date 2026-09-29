import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { khoi_tao_ket_noi } from '../../co_so_du_lieu/ket_noi';
import mo_hinh_ticket from '../../co_so_du_lieu/mo_hinh/ticket_ho_tro';

describe('API Ticket Ho tro & Chat Admin (SmartDesk)', () => {
  beforeAll(() => {
    khoi_tao_ket_noi();
  });

  let ma_ticket_test = '';
  let id_ticket_test = null;

  it('POST /api/ticket - Tu choi neu thieu ho ten', async () => {
    const res = await request(app)
      .post('/api/ticket')
      .send({ tieu_de: 'Can tu van bao gia' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/ticket - Tu choi neu thieu tieu de', async () => {
    const res = await request(app)
      .post('/api/ticket')
      .send({ ho_ten: 'Nguyen Van A' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/ticket - Tao ticket thanh cong', async () => {
    const res = await request(app)
      .post('/api/ticket')
      .send({
        ho_ten: 'Le Thi Mai',
        so_dien_thoai: '0987654321',
        email: 'mai.le@example.com',
        chu_de: 'tu_van_san_pham',
        tieu_de: 'Cần tư vấn bút ký cao cấp tặng sếp',
        noi_dung: 'Tôi muốn tìm bút ký khắc tên tầm giá 500k.'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.ma_ticket).toMatch(/^TK-\d+$/);
    expect(res.body.du_lieu.trang_thai).toBe('cho_xu_ly');
    expect(res.body.du_lieu.tin_nhan).toHaveLength(1);
    expect(res.body.du_lieu.tin_nhan[0].noi_dung).toBe('Tôi muốn tìm bút ký khắc tên tầm giá 500k.');

    ma_ticket_test = res.body.du_lieu.ma_ticket;
    id_ticket_test = res.body.du_lieu.id;
  });

  it('GET /api/ticket/:ma_ticket - Khach hang tra cuu ticket theo ma', async () => {
    const res = await request(app).get(`/api/ticket/${ma_ticket_test}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.ho_ten).toBe('Le Thi Mai');
    expect(res.body.du_lieu.tin_nhan.length).toBeGreaterThanOrEqual(1);
  });

  it('POST /api/ticket/:id/tin-nhan - Khach hang gui tin nhan bo sung vao ticket', async () => {
    const res = await request(app)
      .post(`/api/ticket/${id_ticket_test}/tin-nhan`)
      .send({
        noi_dung: 'Shop cho mình hỏi có kèm hộp quà nhung không ạ?'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.nguoi_gui).toBe('khach_hang');
    expect(res.body.du_lieu.noi_dung).toContain('hộp quà nhung');
  });

  it('GET /api/admin/ticket - Tu choi neu chua dang nhap admin', async () => {
    const res = await request(app).get('/api/admin/ticket');
    expect(res.status).toBe(401);
  });

  it('GET /api/admin/ticket - Admin lay danh sach ticket thanh cong', async () => {
    const res = await request(app)
      .get('/api/admin/ticket')
      .set('Authorization', 'Bearer admin_1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.du_lieu)).toBe(true);
    expect(res.body.thong_ke).toHaveProperty('tong_so');
  });

  it('POST /api/admin/ticket/:id/tra-loi - Admin phan hoi cho khach hang', async () => {
    const res = await request(app)
      .post(`/api/admin/ticket/${id_ticket_test}/tra-loi`)
      .set('Authorization', 'Bearer admin_1')
      .send({
        noi_dung: 'Chào bạn Mai! Các mẫu bút Parker bên mình đều có hộp quà nhung sang trọng và miễn phí khắc laser tên nhé ạ.'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.nguoi_gui).toBe('admin');

    // Kiem tra ticket da chuyen sang dang_xu_ly
    const checkRes = await request(app).get(`/api/ticket/${ma_ticket_test}`);
    expect(checkRes.body.du_lieu.trang_thai).toBe('dang_xu_ly');
    expect(checkRes.body.du_lieu.tin_nhan).toHaveLength(3);
  });

  it('PUT /api/admin/ticket/:id/trang-thai - Admin cap nhat trang thai thanh da_dong', async () => {
    const res = await request(app)
      .put(`/api/admin/ticket/${id_ticket_test}/trang-thai`)
      .set('Authorization', 'Bearer admin_1')
      .send({ trang_thai: 'da_dong' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.du_lieu.trang_thai).toBe('da_dong');
  });
});
