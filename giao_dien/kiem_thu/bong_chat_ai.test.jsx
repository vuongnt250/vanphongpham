import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BongChatAI from '../thanh_phan/bong_chat_ai';
import api_client from '../dich_vu_api';

vi.mock('../dich_vu_api', () => ({
  default: {
    gui_tin_nhan_ai: vi.fn().mockResolvedValue({
      success: true,
      du_lieu: {
        tin_nhan_ai: 'Dưới đây là một số gợi ý của SmartDesk AI.',
        san_pham_goi_y: [
          {
            id: 1,
            ten_san_pham: 'Bút bi Thiên Long FO-024',
            gia: 5000,
            gia_goc: 6000,
            thuong_hieu: 'Thiên Long',
            anh_chinh: '/images/san_pham/but.png'
          }
        ]
      }
    }),
    tao_ticket_ho_tro: vi.fn().mockResolvedValue({
      success: true,
      du_lieu: {
        id: 99,
        ma_ticket: 'TK-99999',
        ho_ten: 'Nguyễn Văn Test',
        so_dien_thoai: '0901234567',
        email: 'test@example.com',
        chu_de: 'tu_van_san_pham',
        tieu_de: 'Cần tư vấn mua sỉ',
        trang_thai: 'cho_xu_ly',
        tin_nhan: [
          {
            id: 1,
            nguoi_gui: 'khach_hang',
            ten_nguoi_gui: 'Nguyễn Văn Test',
            noi_dung: 'Cần tư vấn mua sỉ sổ tay và bút.',
            thoi_gian: new Date().toISOString()
          }
        ]
      }
    }),
    lay_chi_tiet_ticket: vi.fn().mockResolvedValue({
      success: true,
      du_lieu: {
        id: 99,
        ma_ticket: 'TK-99999',
        ho_ten: 'Nguyễn Văn Test',
        tieu_de: 'Cần tư vấn mua sỉ',
        trang_thai: 'cho_xu_ly',
        tin_nhan: []
      }
    }),
    gui_tin_nhan_ticket: vi.fn().mockResolvedValue({
      success: true,
      du_lieu: {
        id: 2,
        noi_dung: 'Tin nhắn test'
      }
    }),
    lay_danh_sach_ticket_khach: vi.fn().mockResolvedValue({
      success: true,
      du_lieu: []
    })
  }
}));

describe('Thành phần: BongChatAI (Giao diện Bóng chat & Trợ lý AI)', () => {
  it('Hiển thị nút bóng chat nổi ban đầu', () => {
    render(<BongChatAI />);
    const nutBong = screen.getByLabelText('Mở khung trò chuyện cùng Trợ lý AI SmartDesk');
    expect(nutBong).toBeInTheDocument();
  });

  it('Bấm vào nút bóng chat mở ra cửa sổ trò chuyện', () => {
    render(<BongChatAI />);
    const nutBong = screen.getByLabelText('Mở khung trò chuyện cùng Trợ lý AI SmartDesk');
    fireEvent.click(nutBong);

    const cuaSo = screen.getByRole('dialog', { name: 'Cửa sổ trò chuyện SmartDesk AI' });
    expect(cuaSo).toBeInTheDocument();
    expect(screen.getByText('SmartDesk AI')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Hỏi AI về sản phẩm, giá, voucher...')).toBeInTheDocument();
  });

  it('Bấm nút thu nhỏ đóng cửa sổ chat và hiện lại nút bóng', () => {
    render(<BongChatAI />);
    const nutBong = screen.getByLabelText('Mở khung trò chuyện cùng Trợ lý AI SmartDesk');
    fireEvent.click(nutBong);

    const nutDong = screen.getByTitle('Thu nhỏ khung chat');
    fireEvent.click(nutDong);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Mở khung trò chuyện cùng Trợ lý AI SmartDesk')).toBeInTheDocument();
  });

  it('Gửi câu hỏi và hiển thị phản hồi từ AI kèm thẻ sản phẩm', async () => {
    const fnXemChiTiet = vi.fn();
    const fnThemGio = vi.fn();

    render(
      <BongChatAI 
        onXemChiTietSanPham={fnXemChiTiet}
        onThemVaoGio={fnThemGio}
      />
    );

    // Mo khung chat
    fireEvent.click(screen.getByLabelText('Mở khung trò chuyện cùng Trợ lý AI SmartDesk'));

    // Nhap cau hoi
    const input = screen.getByPlaceholderText('Hỏi AI về sản phẩm, giá, voucher...');
    fireEvent.change(input, { target: { value: 'Tìm bút bi' } });

    // Gui tin nhan
    const nutGui = screen.getByLabelText('Gửi câu hỏi');
    fireEvent.click(nutGui);

    await waitFor(() => {
      expect(api_client.gui_tin_nhan_ai).toHaveBeenCalledWith('Tìm bút bi', expect.any(Array));
      expect(screen.getByText('Dưới đây là một số gợi ý của SmartDesk AI.')).toBeInTheDocument();
      expect(screen.getByText('Bút bi Thiên Long FO-024')).toBeInTheDocument();
    });

    // Test nut xem chi tiet va nut them vao gio
    const nutChiTiet = screen.getByText('Xem chi tiết');
    fireEvent.click(nutChiTiet);
    expect(fnXemChiTiet).toHaveBeenCalledWith(1);

    const nutThemGio = screen.getByText('+ Giỏ');
    fireEvent.click(nutThemGio);
    expect(fnThemGio).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, ten_san_pham: 'Bút bi Thiên Long FO-024' }),
      1
    );
  });

  it('Bấm nút "Chat Admin" chuyển sang form tạo ticket và hỗ trợ gửi yêu cầu', async () => {
    // Clear session storage de khong bi vuong ticket cu
    sessionStorage.clear();

    render(<BongChatAI />);

    // Mo khung chat
    fireEvent.click(screen.getByLabelText('Mở khung trò chuyện cùng Trợ lý AI SmartDesk'));

    // Bam nut Chat Admin tren header
    const nutChatAdmin = screen.getByText('🎫 Chat Admin');
    fireEvent.click(nutChatAdmin);

    // Kiem tra hien thi form tao ticket
    expect(screen.getByText('Yêu Cầu Hỗ Trợ Chuyên Viên')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ví dụ: Nguyễn Văn A')).toBeInTheDocument();

    // Dien thong tin ticket
    fireEvent.change(screen.getByPlaceholderText('Ví dụ: Nguyễn Văn A'), {
      target: { value: 'Nguyễn Văn Test' }
    });
    fireEvent.change(screen.getByPlaceholderText('Tóm tắt ngắn gọn vấn đề cần hỗ trợ...'), {
      target: { value: 'Cần tư vấn mua sỉ' }
    });
    fireEvent.change(screen.getByPlaceholderText('Cung cấp thông tin chi tiết (mã đơn hàng, tên sản phẩm, câu hỏi...)'), {
      target: { value: 'Cần tư vấn mua sỉ sổ tay và bút.' }
    });

    // Gui form tao ticket
    const nutGuiTicket = screen.getByText('Gửi yêu cầu & Mở chat');
    fireEvent.click(nutGuiTicket);

    await waitFor(() => {
      expect(api_client.tao_ticket_ho_tro).toHaveBeenCalledWith(
        expect.objectContaining({
          ho_ten: 'Nguyễn Văn Test',
          tieu_de: 'Cần tư vấn mua sỉ',
          noi_dung: 'Cần tư vấn mua sỉ sổ tay và bút.'
        })
      );
      // Kiem tra da chuyen sang che do live chat ticket
      expect(screen.getByText('#TK-99999')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Nhập tin nhắn gửi chuyên viên...')).toBeInTheDocument();
    });
  });

  it('Hiển thị danh sách toàn bộ ticket khi khách hàng có nhiều ticket', async () => {
    localStorage.setItem('smartdesk_my_tickets', JSON.stringify(['TK-00001', 'TK-00002']));
    api_client.lay_danh_sach_ticket_khach.mockResolvedValue({
      success: true,
      du_lieu: [
        {
          id: 1,
          ma_ticket: 'TK-00001',
          tieu_de: 'Ticket 1 cần bảo hành',
          trang_thai: 'cho_xu_ly',
          chu_de: 'bao_hanh_doi_tra',
          tin_nhan: [{ id: 1, nguoi_gui: 'khach_hang', noi_dung: 'Bảo hành bàn học' }]
        },
        {
          id: 2,
          ma_ticket: 'TK-00002',
          tieu_de: 'Ticket 2 hỏi xuất hóa đơn',
          trang_thai: 'dang_xu_ly',
          chu_de: 'hoa_don_vat',
          tin_nhan: [{ id: 2, nguoi_gui: 'admin', noi_dung: 'Admin đang hỗ trợ bạn' }]
        }
      ]
    });

    render(<BongChatAI />);
    fireEvent.click(screen.getByLabelText('Mở khung trò chuyện cùng Trợ lý AI SmartDesk'));

    await waitFor(() => {
      expect(screen.getByText('2 ticket hỗ trợ')).toBeInTheDocument();
    });

    // Bấm vào banner để xem danh sách toàn bộ ticket
    fireEvent.click(screen.getByText('Xem danh sách →'));

    // Kiểm tra hiển thị cả 2 ticket
    expect(screen.getByText('Danh Sách Ticket (2)')).toBeInTheDocument();
    expect(screen.getByText('#TK-00001')).toBeInTheDocument();
    expect(screen.getByText('Ticket 1 cần bảo hành')).toBeInTheDocument();
    expect(screen.getByText('#TK-00002')).toBeInTheDocument();
    expect(screen.getByText('Ticket 2 hỏi xuất hóa đơn')).toBeInTheDocument();
  });
});
