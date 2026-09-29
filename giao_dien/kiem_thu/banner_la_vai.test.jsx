import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BannerLaVai from '../thanh_phan/banner_la_vai';

describe('Thành phần: banner_la_vai.jsx', () => {
  it('Hiển thị cả 2 lá vải bên trái và bên phải', () => {
    render(<BannerLaVai />);

    expect(screen.getByTestId('la-vai-trai')).toBeInTheDocument();
    expect(screen.getByTestId('la-vai-phai')).toBeInTheDocument();
    expect(screen.getByText('BÚT VIẾT')).toBeInTheDocument();
    expect(screen.getByText('DOANH NGHIỆP')).toBeInTheDocument();
  });

  it('Cho phép đóng lá vải trái độc lập', () => {
    render(<BannerLaVai />);

    const nut_dong = screen.getByLabelText('Đóng lá vải trái');
    fireEvent.click(nut_dong);

    expect(screen.queryByTestId('la-vai-trai')).not.toBeInTheDocument();
    expect(screen.getByTestId('la-vai-phai')).toBeInTheDocument();
  });

  it('Cho phép đóng lá vải phải độc lập', () => {
    render(<BannerLaVai />);

    const nut_dong = screen.getByLabelText('Đóng lá vải phải');
    fireEvent.click(nut_dong);

    expect(screen.getByTestId('la-vai-trai')).toBeInTheDocument();
    expect(screen.queryByTestId('la-vai-phai')).not.toBeInTheDocument();
  });

  it('Điều hướng khi nhấn vào lá vải', () => {
    const fn_cua_hang = vi.fn();
    const fn_chuyen_trang = vi.fn();

    render(
      <BannerLaVai
        on_dieu_huong_cua_hang={fn_cua_hang}
        on_chuyen_trang={fn_chuyen_trang}
      />
    );

    fireEvent.click(screen.getByTestId('la-vai-trai'));
    expect(fn_cua_hang).toHaveBeenCalledWith({ noi_bat: 1 });

    fireEvent.click(screen.getByTestId('la-vai-phai'));
    expect(fn_chuyen_trang).toHaveBeenCalledWith('doanh_nghiep');
  });
});
