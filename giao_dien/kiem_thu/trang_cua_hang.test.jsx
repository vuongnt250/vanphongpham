import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TrangCuaHang from '../trang/trang_cua_hang/trang_cua_hang';

describe('Trang: trang_cua_hang.jsx', () => {
  const danh_muc_mock = [
    { id: 1, ten_danh_muc: 'Giay in' },
    { id: 2, ten_danh_muc: 'Dung cu viet' }
  ];
  const thuong_hieu_mock = ['Double A', 'Thien Long'];
  const san_pham_mock = [
    {
      id: 1,
      ten_san_pham: 'Giay Double A A4',
      gia: 85000,
      so_luong_ton: 100,
      da_ban: 50,
      anh_chinh: '/images/products/product-1.jpg'
    },
    {
      id: 2,
      ten_san_pham: 'But bi Thien Long',
      gia: 5000,
      so_luong_ton: 200,
      da_ban: 120,
      anh_chinh: '/images/products/product-2.jpg'
    }
  ];

  const tao_api_mock = () => ({
    lay_danh_muc: vi.fn().mockResolvedValue({ success: true, data: danh_muc_mock }),
    lay_thuong_hieu: vi.fn().mockResolvedValue({ success: true, data: thuong_hieu_mock }),
    lay_san_pham: vi.fn().mockResolvedValue({
      success: true,
      data: san_pham_mock,
      phan_trang: { trang_hien_tai: 1, tong_so_trang: 1, tong_so_muc: 2, gioi_han: 12 }
    })
  });

  it('Hien thi danh sach san pham va bo loc', async () => {
    const apiMock = tao_api_mock();
    render(<TrangCuaHang api_service={apiMock} />);

    await waitFor(() => {
      expect(screen.getByTestId('trang-cua-hang')).toBeInTheDocument();
      expect(screen.getByText('Cua hang SmartDesk')).toBeInTheDocument();
      expect(screen.getByText('Tim thay 2 san pham')).toBeInTheDocument();
      expect(screen.getByText('Giay Double A A4')).toBeInTheDocument();
      expect(screen.getByText('But bi Thien Long')).toBeInTheDocument();
    });
  });

  it('Tim kiem san pham goi api voi tu khoa moi', async () => {
    const apiMock = tao_api_mock();
    render(<TrangCuaHang api_service={apiMock} />);

    await waitFor(() => {
      expect(screen.getByTestId('o-nhap-tim-kiem')).toBeInTheDocument();
    });

    const input = screen.getByTestId('o-nhap-tim-kiem');
    fireEvent.change(input, { target: { value: 'But bi' } });
    fireEvent.click(screen.getByTestId('nut-tim-kiem'));

    await waitFor(() => {
      expect(apiMock.lay_san_pham).toHaveBeenCalledWith(expect.objectContaining({
        tu_khoa: 'But bi',
        trang: 1
      }));
    });
  });

  it('Thay doi sap xep goi api voi tieu chi sap xep moi', async () => {
    const apiMock = tao_api_mock();
    render(<TrangCuaHang api_service={apiMock} />);

    await waitFor(() => {
      expect(screen.getByTestId('select-sap-xep')).toBeInTheDocument();
    });

    const select = screen.getByTestId('select-sap-xep');
    fireEvent.change(select, { target: { value: 'gia_tang' } });

    await waitFor(() => {
      expect(apiMock.lay_san_pham).toHaveBeenCalledWith(expect.objectContaining({
        sap_xep: 'gia_tang'
      }));
    });
  });
});