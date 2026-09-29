import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HienThiDanhGia from '../thanh_phan/hien_thi_danh_gia';
import DanhSachDanhGia from '../thanh_phan/danh_sach_danh_gia';
import BieuMauDanhGia from '../thanh_phan/bieu_mau_danh_gia';

describe('Thanh phan: Danh gia san pham', () => {
  describe('HienThiDanhGia', () => {
    it('Hien thi dung thong ke danh gia', () => {
      const thong_ke = {
        diem_trung_binh: 4.5,
        tong_so_danh_gia: 10,
        chi_tiet_sao: { 1: 0, 2: 1, 3: 1, 4: 3, 5: 5 }
      };
      render(<HienThiDanhGia thong_ke={thong_ke} />);

      expect(screen.getByTestId('diem-so-tb')).toHaveTextContent('4.5');
      expect(screen.getByTestId('tong-so-danh-gia')).toHaveTextContent('10 danh gia');
    });

    it('Hien thi trang thai rong khi chua co danh gia', () => {
      render(<HienThiDanhGia thong_ke={{ tong_so_danh_gia: 0 }} />);
      expect(screen.getByTestId('danh-gia-chua-co')).toHaveTextContent('Chua co danh gia nao');
    });
  });

  describe('DanhSachDanhGia', () => {
    it('Hien thi danh sach cac binh luan', () => {
      const danh_sach = [
        { id: 1, user_id: 2, so_sao: 5, noi_dung: 'San pham rat tot!', ngay_tao: '2026-08-01' }
      ];
      render(<DanhSachDanhGia danh_sach_danh_gia={danh_sach} />);

      expect(screen.getByTestId('muc-danh-gia-1')).toBeInTheDocument();
      expect(screen.getByText('San pham rat tot!')).toBeInTheDocument();
      expect(screen.getByText('Nguoi dung #2')).toBeInTheDocument();
    });

    it('Hien thi trang thai rong khi khong co binh luan', () => {
      render(<DanhSachDanhGia danh_sach_danh_gia={[]} />);
      expect(screen.getByTestId('danh-sach-danh-gia-rong')).toBeInTheDocument();
    });
  });

  describe('BieuMauDanhGia', () => {
    it('Bao loi validation khi noi dung danh gia qua ngan', () => {
      const fn_gui = vi.fn();
      render(<BieuMauDanhGia on_gui_danh_gia={fn_gui} />);

      const inputNoiDung = screen.getByTestId('o-nhap-noi-dung');
      fireEvent.change(inputNoiDung, { target: { value: 'ab' } });

      const btnSubmit = screen.getByTestId('nut-gui-danh-gia');
      fireEvent.click(btnSubmit);

      expect(screen.getByTestId('thong-bao-loi')).toHaveTextContent('Noi dung danh gia phai co it nhat 3 ky tu');
      expect(fn_gui).not.toHaveBeenCalled();
    });

    it('Chon sao va gui danh gia hop le', () => {
      const fn_gui = vi.fn();
      render(<BieuMauDanhGia on_gui_danh_gia={fn_gui} />);

      // Chon 4 sao
      fireEvent.click(screen.getByTestId('chon-sao-4'));

      // Nhap noi dung hop le
      const inputNoiDung = screen.getByTestId('o-nhap-noi-dung');
      fireEvent.change(inputNoiDung, { target: { value: 'Giay in dung rat em, khong bi lem muc' } });

      // Bam gui
      const btnSubmit = screen.getByTestId('nut-gui-danh-gia');
      fireEvent.click(btnSubmit);

      expect(fn_gui).toHaveBeenCalledWith({
        so_sao: 4,
        noi_dung: 'Giay in dung rat em, khong bi lem muc'
      });
    });
  });
});