import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalWishlist from '../thanh_phan/modal_wishlist';

describe('Thành phần: ModalWishlist (Hộp thoại Danh sách Yêu thích)', () => {
  const mockDanhSach = [
    {
      id: 1,
      ten_san_pham: 'Bút bi Thiên Long Cao Cấp',
      gia: 15000,
      gia_goc: 20000,
      thuong_hieu: 'Thiên Long',
      anh_chinh: 'https://example.com/but.jpg',
      so_luong_ton: 50
    },
    {
      id: 2,
      ten_san_pham: 'Vở Kẻ Ngang SmartDesk 200 Trang',
      gia: 25000,
      gia_goc: 25000,
      thuong_hieu: 'SmartDesk',
      anh_chinh: 'https://example.com/vo.jpg',
      so_luong_ton: 0
    }
  ];

  beforeEach(() => {
    localStorage.clear();
  });

  it('1. Không hiển thị khi mo=false', () => {
    const { container } = render(<ModalWishlist mo={false} danh_sach={mockDanhSach} />);
    expect(container.firstChild).toBeNull();
  });

  it('2. Hiển thị danh sách sản phẩm và số lượng khi mo=true', () => {
    render(<ModalWishlist mo={true} danh_sach={mockDanhSach} />);
    expect(screen.getByText(/Sản Phẩm Yêu Thích \(2\)/i)).toBeDefined();
    expect(screen.getByText('Bút bi Thiên Long Cao Cấp')).toBeDefined();
    expect(screen.getByText('Vở Kẻ Ngang SmartDesk 200 Trang')).toBeDefined();
    expect(screen.getByText('Còn hàng')).toBeDefined();
    expect(screen.getByText('Tạm hết')).toBeDefined();
  });

  it('3. Bấm vào nút "Xem" hoặc tên sản phẩm gọi hàm onXemChiTiet', () => {
    const mockXemChiTiet = vi.fn();
    const mockDong = vi.fn();

    render(
      <ModalWishlist
        mo={true}
        danh_sach={mockDanhSach}
        onXemChiTiet={mockXemChiTiet}
        onDong={mockDong}
      />
    );

    const nutXem = screen.getAllByRole('button', { name: /xem/i });
    fireEvent.click(nutXem[0]);

    expect(mockXemChiTiet).toHaveBeenCalledWith(mockDanhSach[0]);
    expect(mockDong).toHaveBeenCalled();
  });

  it('4. Bấm vào nút "+ Giỏ hàng" gọi hàm onThemVaoGio', () => {
    const mockThemGio = vi.fn();

    render(
      <ModalWishlist
        mo={true}
        danh_sach={mockDanhSach}
        onThemVaoGio={mockThemGio}
      />
    );

    const nutThemGio = screen.getByRole('button', { name: /\+ giỏ hàng/i });
    fireEvent.click(nutThemGio);

    expect(mockThemGio).toHaveBeenCalledWith({
      san_pham: mockDanhSach[0],
      so_luong: 1
    });
  });

  it('5. Bấm vào nút "Bỏ thích" gọi hàm onXoaKhoiWishlist', () => {
    const mockXoa = vi.fn();

    render(
      <ModalWishlist
        mo={true}
        danh_sach={mockDanhSach}
        onXoaKhoiWishlist={mockXoa}
      />
    );

    const nutBoThich = screen.getAllByRole('button', { name: /bỏ thích/i });
    fireEvent.click(nutBoThich[0]);

    expect(mockXoa).toHaveBeenCalledWith(1);
  });

  it('6. Hiển thị trạng thái rỗng khi danh sách yêu thích trống', () => {
    const mockKhamPha = vi.fn();

    render(
      <ModalWishlist
        mo={true}
        danh_sach={[]}
        onKhamPha={mockKhamPha}
      />
    );

    expect(screen.getByText(/Chưa có sản phẩm yêu thích nào/i)).toBeDefined();
    const nutKhamPha = screen.getByRole('button', { name: /khám phá sản phẩm ngay/i });
    expect(nutKhamPha).toBeDefined();

    fireEvent.click(nutKhamPha);
    expect(mockKhamPha).toHaveBeenCalled();
  });
});
