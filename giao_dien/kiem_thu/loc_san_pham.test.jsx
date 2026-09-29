import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LocSanPham from '../thanh_phan/loc_san_pham';

describe('Thanh phan: loc_san_pham.jsx', () => {
  const danh_muc_mock = [
    { id: 1, ten_danh_muc: 'Giay in' },
    { id: 2, ten_danh_muc: 'Dung cu viet' }
  ];
  const thuong_hieu_mock = ['Thien Long', 'Double A', 'Deli'];

  it('Render day du cac thanh phan loc', () => {
    render(
      <LocSanPham
        danh_muc_list={danh_muc_mock}
        danh_sach_thuong_hieu={thuong_hieu_mock}
        bo_loc_hien_tai={{}}
        on_thay_doi_bo_loc={() => {}}
      />
    );

    expect(screen.getByTestId('loc-theo-danh-muc')).toBeInTheDocument();
    expect(screen.getByTestId('loc-theo-gia')).toBeInTheDocument();
    expect(screen.getByTestId('loc-theo-thuong-hieu')).toBeInTheDocument();
  });

  it('Goi on_thay_doi_bo_loc khi chon danh muc', () => {
    const fn_thay_doi = vi.fn();
    render(
      <LocSanPham
        danh_muc_list={danh_muc_mock}
        danh_sach_thuong_hieu={thuong_hieu_mock}
        bo_loc_hien_tai={{}}
        on_thay_doi_bo_loc={fn_thay_doi}
      />
    );

    fireEvent.click(screen.getByTestId('danh-muc-item-1'));
    expect(fn_thay_doi).toHaveBeenCalledWith(expect.objectContaining({ danh_muc_id: 1, trang: 1 }));
  });

  it('Goi on_thay_doi_bo_loc khi chon thuong hieu', () => {
    const fn_thay_doi = vi.fn();
    render(
      <LocSanPham
        danh_muc_list={danh_muc_mock}
        danh_sach_thuong_hieu={thuong_hieu_mock}
        bo_loc_hien_tai={{}}
        on_thay_doi_bo_loc={fn_thay_doi}
      />
    );

    fireEvent.click(screen.getByTestId('thuong-hieu-item-0'));
    expect(fn_thay_doi).toHaveBeenCalledWith(expect.objectContaining({ thuong_hieu: 'Thien Long', trang: 1 }));
  });

  it('Goi on_dat_lai_bo_loc khi bam nut Dat lai', () => {
    const fn_dat_lai = vi.fn();
    render(
      <LocSanPham
        danh_muc_list={danh_muc_mock}
        danh_sach_thuong_hieu={thuong_hieu_mock}
        bo_loc_hien_tai={{ danh_muc_id: 1 }}
        on_thay_doi_bo_loc={() => {}}
        on_dat_lai_bo_loc={fn_dat_lai}
      />
    );

    fireEvent.click(screen.getByTestId('nut-dat-lai-bo-loc'));
    expect(fn_dat_lai).toHaveBeenCalled();
  });
});