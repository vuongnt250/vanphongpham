import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DangNhapDangKy from '../trang/xac_thuc/dang_nhap_dang_ky';

describe('Thanh phan: dang_nhap_dang_ky.jsx (TV2)', () => {
  it('Hien thi form dang nhap mac dinh voi day du truong', () => {
    render(<DangNhapDangKy on_dang_nhap_thanh_cong={vi.fn()} on_dong={vi.fn()} />);

    expect(screen.getByPlaceholderText(/nhập tên đăng nhập hoặc email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nhập mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /đăng nhập ngay/i })).toBeInTheDocument();
  });

  it('Chuyen doi qua lai giua tab Dang nhap va Dang ky', () => {
    render(<DangNhapDangKy on_dang_nhap_thanh_cong={vi.fn()} on_dong={vi.fn()} />);

    const tabDangKy = screen.getByRole('button', { name: /^đăng ký$/i });
    fireEvent.click(tabDangKy);

    expect(screen.getByPlaceholderText(/ví dụ: nguyễn văn an/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nguyenan98/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nhập lại mật khẩu/i)).toBeInTheDocument();
  });

  it('Bao loi khi de trong tai khoan hoac mat khau khi dang nhap', async () => {
    render(<DangNhapDangKy on_dang_nhap_thanh_cong={vi.fn()} on_dong={vi.fn()} />);

    const form = screen.getByRole('button', { name: /đăng nhập ngay/i }).closest('form');
    fireEvent.submit(form);

    expect(screen.getByText(/vui lòng nhập tên đăng nhập và mật khẩu/i)).toBeInTheDocument();
  });
});
