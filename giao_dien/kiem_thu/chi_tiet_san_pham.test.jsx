import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TrangChiTietSanPham from '../trang/trang_chi_tiet_san_pham/trang_chi_tiet_san_pham';

describe('Trang: trang_chi_tiet_san_pham.jsx', () => {
  const san_pham_mock = {
    id: 1,
    ten_san_pham: 'Giay Double A A4 80gsm',
    gia: 85000,
    gia_goc: 95000,
    so_luong_ton: 50,
    da_ban: 20,
    don_vi_tinh: 'Ram',
    thuong_hieu: 'Double A',
    ten_danh_muc: 'Giay in',
    mo_ta: 'Mo ta san pham chi tiet',
    anh_chinh: '/images/products/product-1.jpg',
    hinh_anh: [
      { id: 1, duong_dan_anh: '/images/products/product-1.jpg', la_anh_chinh: 1 },
      { id: 2, duong_dan_anh: '/images/products/product-1-sub.jpg', la_anh_chinh: 0 }
    ]
  };

  const tao_api_mock = (sp = san_pham_mock) => ({
    lay_chi_tiet_san_pham: vi.fn().mockResolvedValue({ success: true, data: sp }),
    lay_danh_gia_san_pham: vi.fn().mockResolvedValue({
      success: true,
      data: [
        { id: 1, user_id: 2, so_sao: 5, noi_dung: 'Tuyet voi!', ngay_tao: '2026-08-01' }
      ],
      thong_ke: { diem_trung_binh: 5, tong_so_danh_gia: 1, chi_tiet_sao: { 5: 1 } }
    }),
    gui_danh_gia: vi.fn().mockResolvedValue({
      success: true,
      data: { id: 2, user_id: 1, so_sao: 5, noi_dung: 'San pham rat dep' },
      thong_ke: { diem_trung_binh: 5, tong_so_danh_gia: 2, chi_tiet_sao: { 5: 2 } }
    })
  });

  it('Hien thi day du chi tiet san pham', async () => {
    const apiMock = tao_api_mock();
    render(<TrangChiTietSanPham san_pham_id={1} api_service={apiMock} />);

    await waitFor(() => {
      expect(screen.getByTestId('chi-tiet-ten-san-pham')).toHaveTextContent('Giay Double A A4 80gsm');
      expect(screen.getByTestId('chi-tiet-gia')).toHaveTextContent('85.000');
      expect(screen.getByTestId('chi-tiet-con-hang')).toHaveTextContent('Con hang (50 Ram)');
      expect(screen.getByTestId('chi-tiet-mo-ta')).toHaveTextContent('Mo ta san pham chi tiet');
    });
  });

  it('Hien thi thong bao loi khi san pham khong ton tai', async () => {
    const apiMock = {
      lay_chi_tiet_san_pham: vi.fn().mockRejectedValue(new Error('Khong tim thay san pham voi ma: 9999')),
      lay_danh_gia_san_pham: vi.fn().mockResolvedValue({ data: [] })
    };

    render(<TrangChiTietSanPham san_pham_id={9999} api_service={apiMock} />);

    await waitFor(() => {
      expect(screen.getByTestId('chi-tiet-loi')).toBeInTheDocument();
      expect(screen.getByText('Khong tim thay san pham voi ma: 9999')).toBeInTheDocument();
    });
  });

  it('Thay doi so luong va goi on_them_vao_gio', async () => {
    const apiMock = tao_api_mock();
    const fn_them_gio = vi.fn();
    render(<TrangChiTietSanPham san_pham_id={1} api_service={apiMock} on_them_vao_gio={fn_them_gio} />);

    await waitFor(() => {
      expect(screen.getByTestId('nut-them-vao-gio')).toBeInTheDocument();
    });

    // Tang so luong len 2
    fireEvent.click(screen.getByTestId('nut-tang-so-luong'));
    expect(screen.getByTestId('o-nhap-so-luong')).toHaveValue(2);

    // Bam them vao gio
    fireEvent.click(screen.getByTestId('nut-them-vao-gio'));
    expect(fn_them_gio).toHaveBeenCalledWith({
      san_pham: expect.objectContaining({ id: 1 }),
      so_luong: 2
    });
  });

  it('Gui danh gia moi thanh cong', async () => {
    const apiMock = tao_api_mock();
    render(<TrangChiTietSanPham san_pham_id={1} api_service={apiMock} />);

    await waitFor(() => {
      expect(screen.getByTestId('bieu-mau-danh-gia')).toBeInTheDocument();
    });

    const inputNoiDung = screen.getByTestId('o-nhap-noi-dung');
    fireEvent.change(inputNoiDung, { target: { value: 'San pham rat tot va dung yeu cau' } });

    fireEvent.click(screen.getByTestId('nut-gui-danh-gia'));

    await waitFor(() => {
      expect(apiMock.gui_danh_gia).toHaveBeenCalledWith(1, {
        so_sao: 5,
        noi_dung: 'San pham rat tot va dung yeu cau'
      });
      expect(screen.getByTestId('thong-bao-thanh-cong')).toBeInTheDocument();
    });
  });
});