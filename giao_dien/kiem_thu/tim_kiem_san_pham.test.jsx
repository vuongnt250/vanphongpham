import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimKiemSanPham from '../thanh_phan/tim_kiem_san_pham';

describe('Thanh phan: tim_kiem_san_pham.jsx', () => {
  it('Render o nhap tim kiem voi gia tri mac dinh', () => {
    render(<TimKiemSanPham gia_tri_khoi_tao="But bi" />);
    const input = screen.getByTestId('o-nhap-tim-kiem');
    expect(input.value).toBe('But bi');
  });

  it('Goi on_tim_kiem khi submit form', () => {
    const fn_tim = vi.fn();
    render(<TimKiemSanPham on_tim_kiem={fn_tim} />);

    const input = screen.getByTestId('o-nhap-tim-kiem');
    fireEvent.change(input, { target: { value: 'Thien Long' } });

    const btn = screen.getByTestId('nut-tim-kiem');
    fireEvent.click(btn);

    expect(fn_tim).toHaveBeenCalledWith('Thien Long');
  });

  it('Xoa tu khoa khi bam nut xoa', () => {
    const fn_tim = vi.fn();
    render(<TimKiemSanPham gia_tri_khoi_tao="Double A" on_tim_kiem={fn_tim} />);

    const nutXoa = screen.getByTestId('nut-xoa-tim-kiem');
    fireEvent.click(nutXoa);

    const input = screen.getByTestId('o-nhap-tim-kiem');
    expect(input.value).toBe('');
    expect(fn_tim).toHaveBeenCalledWith('');
  });
});