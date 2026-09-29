import React from 'react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../trang/admin/admin_dashboard';
import api_client from '../dich_vu_api';

describe('Trang: admin_dashboard.jsx (TV3)', () => {
  beforeAll(() => {
    vi.spyOn(api_client, 'lay_thong_ke_admin').mockResolvedValue({
      success: true,
      du_lieu: {
        tong_doanh_thu: 1500000,
        tong_don_hang: 12,
        tong_khach_hang: 5,
        san_pham_sap_het: 2,
        top_ban_chay: [
          { id: 1, ten_san_pham: 'Giấy in Double A A4', da_ban: 50 }
        ],
        danh_sach_can_nhap: [
          { id: 2, ten_san_pham: 'Bút dạ quang', so_luong_ton: 4 }
        ],
        don_hang_moi_nhat: []
      }
    });

    vi.spyOn(api_client, 'lay_san_pham').mockResolvedValue({
      success: true,
      data: [{ id: 1, ten_san_pham: 'Giấy Double A', gia: 85000, so_luong_ton: 50, da_ban: 10, trang_thai: 'hoat_dong' }]
    });

    vi.spyOn(api_client, 'lay_danh_muc').mockResolvedValue({
      success: true,
      data: [{ id: 1, ten_danh_muc: 'Giấy in', duong_dan_danh_muc: 'giay-in' }]
    });

    vi.spyOn(api_client, 'lay_don_hang_admin').mockResolvedValue({
      success: true,
      du_lieu: [
        { id: 101, ma_don_hang: 'SD-101', ten_nguoi_nhan: 'Nguyen An', so_dien_thoai: '0988777666', dia_chi_giao_hang: 'Ha Noi', tong_thanh_toan: 170000, trang_thai: 'PENDING' }
      ]
    });

    vi.spyOn(api_client, 'lay_khach_hang_admin').mockResolvedValue({ success: true, du_lieu: [] });
    vi.spyOn(api_client, 'lay_kho_admin').mockResolvedValue({ success: true, du_lieu: [] });
    vi.spyOn(api_client, 'lay_voucher_admin').mockResolvedValue({ success: true, du_lieu: [] });
    vi.spyOn(api_client, 'lay_nha_cung_cap_admin').mockResolvedValue({ success: true, du_lieu: [] });
    vi.spyOn(api_client, 'lay_banner_admin').mockResolvedValue({ success: true, du_lieu: [] });
    vi.spyOn(api_client, 'lay_danh_sach_ticket_admin').mockResolvedValue({
      success: true,
      du_lieu: [
        {
          id: 501,
          ma_ticket: 'TK-501',
          ho_ten: 'Trần Thị B',
          so_dien_thoai: '0912345678',
          email: 'b@example.com',
          tieu_de: 'Hỏi báo giá 500 ram giấy',
          chu_de: 'tu_van_san_pham',
          trang_thai: 'cho_xu_ly',
          tin_nhan: [
            {
              id: 1,
              nguoi_gui: 'khach_hang',
              ten_nguoi_gui: 'Trần Thị B',
              noi_dung: 'Shop báo giá giúp 500 ram giấy Double A.',
              thoi_gian: new Date().toISOString()
            }
          ]
        }
      ],
      thong_ke: { tong_so: 1, cho_xu_ly: 1, dang_xu_ly: 0, da_dong: 0 }
    });
    vi.spyOn(api_client, 'lay_chi_tiet_ticket_admin').mockResolvedValue({
      success: true,
      du_lieu: {
        id: 501,
        ma_ticket: 'TK-501',
        ho_ten: 'Trần Thị B',
        so_dien_thoai: '0912345678',
        email: 'b@example.com',
        tieu_de: 'Hỏi báo giá 500 ram giấy',
        chu_de: 'tu_van_san_pham',
        trang_thai: 'cho_xu_ly',
        tin_nhan: [
          {
            id: 1,
            nguoi_gui: 'khach_hang',
            ten_nguoi_gui: 'Trần Thị B',
            noi_dung: 'Shop báo giá giúp 500 ram giấy Double A.',
            thoi_gian: new Date().toISOString()
          }
        ]
      }
    });
    vi.spyOn(api_client, 'admin_tra_loi_ticket').mockResolvedValue({
      success: true,
      du_lieu: { id: 2, noi_dung: 'Phản hồi từ admin' }
    });
  });

  it('Hien thi tieu de Admin Console va 4 the KPI', async () => {
    render(<AdminDashboard on_ve_trang_chu={vi.fn()} />);

    expect(screen.getByText(/SmartDesk Admin Console/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Doanh thu thực tế/i)).toBeInTheDocument();
      expect(screen.getByText(/Tổng số đơn hàng/i)).toBeInTheDocument();
      expect(screen.getByText(/Số lượng khách hàng/i)).toBeInTheDocument();
      expect(screen.getByText(/Cảnh báo tồn kho thấp/i)).toBeInTheDocument();
    });
  });

  it('Chuyen sang tab San pham va hien thi danh sach', async () => {
    render(<AdminDashboard on_ve_trang_chu={vi.fn()} />);

    const tabSanPham = screen.getByRole('button', { name: /📦 Sản phẩm/i });
    fireEvent.click(tabSanPham);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /\+ Thêm sản phẩm mới/i })).toBeInTheDocument();
      expect(screen.getByText('Giấy Double A')).toBeInTheDocument();
    });
  });

  it('Chuyen sang tab Don hang va hien thi danh sach don kem nut duyet', async () => {
    render(<AdminDashboard on_ve_trang_chu={vi.fn()} />);

    const tabDonHang = screen.getByRole('button', { name: /🛒 Đơn hàng/i });
    fireEvent.click(tabDonHang);

    await waitFor(() => {
      expect(screen.getByText('SD-101')).toBeInTheDocument();
      expect(screen.getByText(/✓ Xác nhận \(CONFIRMED\)/i)).toBeInTheDocument();
      expect(screen.getByText(/✕ Hủy đơn \(Hoàn kho\)/i)).toBeInTheDocument();
    });
  });

  it('Chuyen sang tab Ho tro khach hang va hien thi danh sach ticket kem khung chat', async () => {
    const { container } = render(<AdminDashboard on_ve_trang_chu={vi.fn()} />);

    // Cho du lieu ban dau tai xong
    await waitFor(() => {
      expect(screen.getByText(/SmartDesk Admin Console/i)).toBeInTheDocument();
    });

    const tabHoTro = screen.getByRole('button', { name: /🎧 Hỗ trợ khách hàng/i });
    fireEvent.click(tabHoTro);

    await waitFor(() => {
      expect(screen.getByText(/Tổng số ticket/i)).toBeInTheDocument();
      expect(screen.getAllByText(/#TK-501/i).length).toBeGreaterThan(0);
      expect(screen.getByPlaceholderText('Nhập câu trả lời gửi đến khách hàng...')).toBeInTheDocument();
      expect(screen.getByText(/Gửi phản hồi cho khách ✉️/i)).toBeInTheDocument();
    });
  });
});
