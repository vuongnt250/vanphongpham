import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TrangGioHang from '../trang/trang_gio_hang/trang_gio_hang';

describe('Trang: trang_gio_hang.jsx (TV2)', () => {
  const gio_hang_mock = [
    {
      san_pham: {
        id: 1,
        ten_san_pham: 'Giấy in Double A A4 80gsm',
        gia: 85000,
        so_luong_ton: 100,
        anh_chinh: '/images/products/product-1.jpg'
      },
      so_luong: 2
    }
  ];

  it('Hien thi gio hang trong khi khong co san pham', () => {
    render(<TrangGioHang gio_hang={[]} on_tiep_tuc_mua_sam={vi.fn()} />);
    expect(screen.getByText(/giỏ hàng của bạn đang trống/i)).toBeInTheDocument();
  });

  it('Hien thi chi tiet san pham, tam tinh va tong tien khi co hang trong gio', () => {
    render(
      <TrangGioHang
        gio_hang={gio_hang_mock}
        on_thay_doi_so_luong={vi.fn()}
        on_xoa_san_pham={vi.fn()}
        on_xoa_toan_bo={vi.fn()}
      />
    );

    expect(screen.getByText('Giấy in Double A A4 80gsm')).toBeInTheDocument();
    expect(screen.getByText(/thông tin thanh toán/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('Goi callback xoa san pham khi nhan nut thung rac', () => {
    const fn_xoa = vi.fn();
    render(
      <TrangGioHang
        gio_hang={gio_hang_mock}
        on_xoa_san_pham={fn_xoa}
      />
    );

    const nutXoa = screen.getByTitle(/xóa khỏi giỏ hàng/i);
    fireEvent.click(nutXoa);
    expect(fn_xoa).toHaveBeenCalledWith(1);
  });
});
