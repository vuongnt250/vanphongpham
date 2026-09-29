import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TheSanPham from '../thanh_phan/the_san_pham';

describe('Thanh phan: the_san_pham.jsx', () => {
  const san_pham_mau = {
    id: 1,
    ten_san_pham: 'Giay Double A A4 80gsm',
    gia: 85000,
    gia_goc: 95000,
    so_luong_ton: 150,
    da_ban: 76,
    thuong_hieu: 'Double A',
    ten_danh_muc: 'Giay in',
    diem_danh_gia: 4.8,
    so_luong_danh_gia: 80,
    anh_chinh: '/images/products/product-1.jpg'
  };

  it('Hien thi day du thong tin san pham', () => {
    render(<TheSanPham san_pham={san_pham_mau} />);

    expect(screen.getByTestId('ten-san-pham')).toHaveTextContent('Giay Double A A4 80gsm');
    expect(screen.getByTestId('gia-hien-tai')).toHaveTextContent('85.000');
    expect(screen.getByTestId('gia-goc')).toHaveTextContent('95.000');
    expect(screen.getByTestId('nhan-giam-gia')).toHaveTextContent('-11%');
    expect(screen.getByText('Double A')).toBeInTheDocument();
  });

  it('Hien thi trang thai het hang khi so_luong_ton <= 0', () => {
    const sp_het_hang = { ...san_pham_mau, so_luong_ton: 0 };
    render(<TheSanPham san_pham={sp_het_hang} />);

    expect(screen.getByTestId('nhan-het-hang')).toHaveTextContent('Het hang');
  });

  it('Goi ham on_chon_san_pham khi nguoi dung nhap vao the', () => {
    const fn_chon = vi.fn();
    render(<TheSanPham san_pham={san_pham_mau} on_chon_san_pham={fn_chon} />);

    fireEvent.click(screen.getByTestId('the-san-pham-1'));
    expect(fn_chon).toHaveBeenCalledWith(san_pham_mau);
  });

  it('Xu ly an toan khi truyen san pham null/rong', () => {
    render(<TheSanPham san_pham={null} />);
    expect(screen.getByTestId('the-san-pham-rong')).toHaveTextContent('Khong co du lieu san pham');
  });

  it('Chuyen sang anh fallback mac dinh khi anh loi', () => {
    render(<TheSanPham san_pham={san_pham_mau} />);
    const anh = screen.getByTestId('anh-san-pham');
    fireEvent.error(anh);
    expect(anh.src).toContain('data:image/svg+xml');
  });
});