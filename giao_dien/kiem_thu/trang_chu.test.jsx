import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TrangChu from '../trang/trang_chu/trang_chu';

describe('Trang: trang_chu.jsx', () => {
  const danh_muc_mock = [
    { id: 1, ten_danh_muc: 'Giay in & San pham tu giay' },
    { id: 2, ten_danh_muc: 'Dung cu viet, ve' }
  ];

  const san_pham_mock = [
    { id: 1, ten_san_pham: 'Giay Double A', gia: 85000, so_luong_ton: 10, anh_chinh: '/img/1.jpg' }
  ];

  const tao_api_mock = () => ({
    lay_san_pham: vi.fn().mockResolvedValue({ success: true, data: san_pham_mock }),
    lay_danh_muc: vi.fn().mockResolvedValue({ success: true, data: danh_muc_mock })
  });

  it('Hien thi banner, danh muc va cac khu vuc san pham', async () => {
    const apiMock = tao_api_mock();
    render(<TrangChu api_service={apiMock} />);

    await waitFor(() => {
      expect(screen.getByTestId('banner-chinh')).toBeInTheDocument();
      expect(screen.getByText('SmartDesk - Van phong pham chat luong cao')).toBeInTheDocument();
      expect(screen.getByText('Giay in & San pham tu giay')).toBeInTheDocument();
      expect(screen.getByText('Dung cu viet, ve')).toBeInTheDocument();
    });
  });

  it('Dieu huong den cua hang khi tim kiem tu trang chu', async () => {
    const apiMock = tao_api_mock();
    const fn_dieu_huong = vi.fn();
    render(<TrangChu api_service={apiMock} on_dieu_huong_cua_hang={fn_dieu_huong} />);

    await waitFor(() => {
      expect(screen.getByTestId('o-nhap-tim-kiem')).toBeInTheDocument();
    });

    const input = screen.getByTestId('o-nhap-tim-kiem');
    fireEvent.change(input, { target: { value: 'Kep giay' } });
    fireEvent.click(screen.getByTestId('nut-tim-kiem'));

    expect(fn_dieu_huong).toHaveBeenCalledWith({ tu_khoa: 'Kep giay' });
  });

  it('Dieu huong den cua hang khi chon mot danh muc', async () => {
    const apiMock = tao_api_mock();
    const fn_chon_dm = vi.fn();
    render(<TrangChu api_service={apiMock} on_chon_danh_muc={fn_chon_dm} />);

    await waitFor(() => {
      expect(screen.getByTestId('the-danh-muc-1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('the-danh-muc-1'));
    expect(fn_chon_dm).toHaveBeenCalledWith(1);
  });
});