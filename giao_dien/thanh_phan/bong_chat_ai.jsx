import React, { useState, useEffect, useRef } from 'react';
import api_client from '../dich_vu_api';
import RobotTroLy3D from './robot_tro_ly_3d';


export default function BongChatAI({ onXemChiTietSanPham, onThemVaoGio, onChuyenTrang, an_khi_o_admin = false, nguoi_dung = null }) {
  if (an_khi_o_admin) return null;

  const [dang_mo, set_dang_mo] = useState(false);
  const [tin_nhan_moi, set_tin_nhan_moi] = useState('');
  const [dang_gui, set_dang_gui] = useState(false);
  const [da_thong_bao_chao, set_da_thong_bao_chao] = useState(true);

  // Che do hien thi: 'ai' | 'danh_sach_ticket' | 'tao_ticket' | 'ticket'
  const [che_do, set_che_do] = useState('ai');
  const [danh_sach_ticket, set_danh_sach_ticket] = useState([]);
  const [active_ticket, set_active_ticket] = useState(null);
  const [active_ticket_code, set_active_ticket_code] = useState(() => {
    try {
      return sessionStorage.getItem('smartdesk_active_ticket_code') || '';
    } catch (e) {
      return '';
    }
  });

  // Form tao ticket
  const [form_ticket, set_form_ticket] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    email: '',
    chu_de: 'tu_van_san_pham',
    tieu_de: '',
    noi_dung: ''
  });
  const [dang_tao_ticket, set_dang_tao_ticket] = useState(false);
  const [loi_tao_ticket, set_loi_tao_ticket] = useState('');

  // Tin nhan trong ticket
  const [tin_nhan_ticket_moi, set_tin_nhan_ticket_moi] = useState('');
  const [dang_gui_tin_ticket, set_dang_gui_tin_ticket] = useState(false);

  // Tin nhan mac dinh khoi tao
  const tin_nhan_khoi_tao = [
    {
      id: 1,
      nguoi_gui: 'ai',
      noi_dung: '👋 Xin chào! Tôi là **Trợ lý AI SmartDesk** 🤖.\n\nTôi có thể giúp bạn tìm kiếm văn phòng phẩm, tư vấn mã giảm giá hoặc kiểm tra các chính sách giao hàng, bảo hành và hóa đơn VAT. Ngoài ra bạn có thể bấm nút **"Chat với Admin"** để gặp trực tiếp nhân viên hỗ trợ nhé!',
      thoi_gian: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      san_pham: []
    }
  ];

  const [danh_sach_tin_nhan, set_danh_sach_tin_nhan] = useState(() => {
    try {
      const luu = sessionStorage.getItem('smartdesk_ai_chat_history');
      return luu ? JSON.parse(luu) : tin_nhan_khoi_tao;
    } catch (e) {
      return tin_nhan_khoi_tao;
    }
  });

  // Trang thai hoat hoa & bieu cam cua Robot Mascot 3D (khi null se de robot tu dong chay chu ky ngau nhien sinh dong)
  const [robot_hanh_dong, set_robot_hanh_dong] = useState(null);
  const [robot_bieu_cam, set_robot_bieu_cam] = useState(null);

  const cuon_tin_nhan_ref = useRef(null);
  const cuon_ticket_ref = useRef(null);
  const o_nhap_ref = useRef(null);
  const o_nhap_ticket_ref = useRef(null);

  // Tu dong dien thong tin nguoi dung vao form ticket
  useEffect(() => {
    if (nguoi_dung) {
      set_form_ticket(prev => ({
        ...prev,
        ho_ten: prev.ho_ten || nguoi_dung.ho_ten || nguoi_dung.tai_khoan || '',
        so_dien_thoai: prev.so_dien_thoai || nguoi_dung.so_dien_thoai || '',
        email: prev.email || nguoi_dung.email || ''
      }));
    }
  }, [nguoi_dung]);

  // Tu dong cuon xuong duoi khi co tin nhan moi
  useEffect(() => {
    if (cuon_tin_nhan_ref.current) {
      cuon_tin_nhan_ref.current.scrollTop = cuon_tin_nhan_ref.current.scrollHeight;
    }
  }, [danh_sach_tin_nhan, dang_gui, dang_mo, che_do]);

  useEffect(() => {
    if (cuon_ticket_ref.current) {
      cuon_ticket_ref.current.scrollTop = cuon_ticket_ref.current.scrollHeight;
    }
  }, [active_ticket?.tin_nhan, dang_gui_tin_ticket, che_do]);

  // Luu lich su vao sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('smartdesk_ai_chat_history', JSON.stringify(danh_sach_tin_nhan));
    } catch (e) {}
  }, [danh_sach_tin_nhan]);

  // Luu ma ticket vao sessionStorage
  useEffect(() => {
    try {
      if (active_ticket_code) {
        sessionStorage.setItem('smartdesk_active_ticket_code', active_ticket_code);
      }
    } catch (e) {}
  }, [active_ticket_code]);

  // Focus vao o nhap khi mo cua so
  useEffect(() => {
    if (dang_mo) {
      set_da_thong_bao_chao(false);
      setTimeout(() => {
        if (che_do === 'ai' && o_nhap_ref.current) o_nhap_ref.current.focus();
        if (che_do === 'ticket' && o_nhap_ticket_ref.current) o_nhap_ticket_ref.current.focus();
      }, 200);
    }
  }, [dang_mo, che_do]);

  // Ham tai chi tiet 1 ticket
  const tai_chi_tiet_ticket = async (ma) => {
    if (!ma) return;
    try {
      const res = await api_client.lay_chi_tiet_ticket(ma);
      if (res.success && res.du_lieu) {
        set_active_ticket(res.du_lieu);
      }
    } catch (err) {}
  };

  // Ham tai toan bo danh sach ticket cua khach hang
  const tai_tat_ca_ticket = async () => {
    try {
      let localCodes = [];
      try {
        const stored = localStorage.getItem('smartdesk_my_tickets');
        if (stored) localCodes = JSON.parse(stored);
      } catch (e) {}
      if (active_ticket_code && !localCodes.includes(active_ticket_code)) {
        localCodes.push(active_ticket_code);
      }

      const params = {};
      if (localCodes.length > 0) params.ma = localCodes.join(',');
      if (nguoi_dung?.so_dien_thoai) params.sdt = nguoi_dung.so_dien_thoai;
      if (nguoi_dung?.email) params.email = nguoi_dung.email;

      const res = await api_client.lay_danh_sach_ticket_khach(params);
      if (res?.success && Array.isArray(res.du_lieu)) {
        set_danh_sach_ticket(res.du_lieu);
        try {
          const allCodes = Array.from(new Set([...res.du_lieu.map(t => t.ma_ticket), ...localCodes]));
          localStorage.setItem('smartdesk_my_tickets', JSON.stringify(allCodes));
        } catch (e) {}
      }
    } catch (err) {}
  };

  useEffect(() => {
    tai_tat_ca_ticket();
  }, [nguoi_dung]);

  useEffect(() => {
    if (dang_mo) {
      tai_tat_ca_ticket();
    }
  }, [dang_mo]);

  useEffect(() => {
    if (active_ticket_code) {
      tai_chi_tiet_ticket(active_ticket_code);
    }
  }, [active_ticket_code]);

  // Polling cap nhat tin nhan tu Admin dinh ky moi 4 giay khi dang mo ticket
  useEffect(() => {
    if (!dang_mo) return;
    const timer = setInterval(() => {
      if (che_do === 'ticket' && active_ticket_code) {
        tai_chi_tiet_ticket(active_ticket_code);
      }
      if (che_do === 'danh_sach_ticket' || che_do === 'ai') {
        tai_tat_ca_ticket();
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [dang_mo, che_do, active_ticket_code]);

  // Cac goi y cau hoi nhanh
  const goi_y_cau_hoi = [
    { nhan: '🎫 Chat với Admin', action: 'ticket' },
    { nhan: '🔥 Bán chạy nhất', cau_hoi: 'Sản phẩm bán chạy nhất' },
    { nhan: '🏷️ Mã giảm giá', cau_hoi: 'Có mã giảm giá nào?' },
    { nhan: '🚚 Phí giao hàng', cau_hoi: 'Phí giao hàng thế nào?' },
    { nhan: '🔄 Đổi trả hàng', cau_hoi: 'Chính sách đổi trả' },
    { nhan: '📝 Sổ tay & Bút bi', cau_hoi: 'Tìm sổ tay & bút bi' },
    { nhan: '🏢 Hóa đơn VAT B2B', cau_hoi: 'Xuất hóa đơn VAT B2B' }
  ];

  const gui_tin_nhan = async (noi_dung_gui) => {
    const cau_hoi = (noi_dung_gui || tin_nhan_moi).trim();
    if (!cau_hoi || dang_gui) return;

    const tinNhanUser = {
      id: Date.now(),
      nguoi_gui: 'user',
      noi_dung: cau_hoi,
      thoi_gian: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const dsMoi = [...danh_sach_tin_nhan, tinNhanUser];
    set_danh_sach_tin_nhan(dsMoi);
    set_tin_nhan_moi('');
    set_dang_gui(true);
    // Robot chạy bộ hăng say tìm kiếm dữ liệu
    set_robot_hanh_dong('chay_bo');
    set_robot_bieu_cam('vui_ve');

    try {
      // Chuan bi lich su rut gon gui len backend
      const lichSuGui = dsMoi.slice(-6).map(t => ({
        nguoi_gui: t.nguoi_gui,
        noi_dung: t.noi_dung
      }));

      const res = await api_client.gui_tin_nhan_ai(cau_hoi, lichSuGui);
      
      const tinNhanAI = {
        id: Date.now() + 1,
        nguoi_gui: 'ai',
        noi_dung: res?.du_lieu?.tin_nhan_ai || 'Cảm ơn bạn đã hỏi. Tôi có thể hỗ trợ thêm thông tin gì khác cho bạn không?',
        san_pham: res?.du_lieu?.san_pham_goi_y || [],
        thoi_gian: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      set_danh_sach_tin_nhan(prev => [...prev, tinNhanAI]);
      // Trả lời xong: Robot nhảy cẫng lên ăn mừng vui vẻ!
      set_robot_hanh_dong('nhay_nhay');
      set_robot_bieu_cam('vui_ve');
      setTimeout(() => {
        // Tra ve null de mascot tu dong tiep tuc chu ky ngau nhien
        set_robot_hanh_dong(null);
        set_robot_bieu_cam(null);
      }, 3500);
    } catch (err) {
      console.error('Lỗi khi chat AI:', err);
      const tinNhanLoi = {
        id: Date.now() + 1,
        nguoi_gui: 'ai',
        noi_dung: '⚠️ Rất tiếc, trợ lý AI đang bận xử lý dữ liệu. Bạn vui lòng thử lại hoặc gọi tổng đài **1900 1234** để được hỗ trợ trực tiếp.',
        san_pham: [],
        thoi_gian: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      set_danh_sach_tin_nhan(prev => [...prev, tinNhanLoi]);
      // Gặp sự cố: Robot tức giận rung lắc giận dữ
      set_robot_hanh_dong('idle');
      set_robot_bieu_cam('tuc_gian');
      setTimeout(() => {
        set_robot_hanh_dong(null);
        set_robot_bieu_cam(null);
      }, 3500);
    } finally {
      set_dang_gui(false);
    }
  };

  const xu_ly_enter = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      gui_tin_nhan();
    }
  };

  const xoa_lich_su = () => {
    set_danh_sach_tin_nhan(tin_nhan_khoi_tao);
    try {
      sessionStorage.removeItem('smartdesk_ai_chat_history');
    } catch (e) {}
  };

  const chon_ticket_xem = (t) => {
    set_active_ticket(t);
    set_active_ticket_code(t.ma_ticket);
    set_che_do('ticket');
    tai_chi_tiet_ticket(t.ma_ticket);
  };

  // Xu ly chuyen sang man hinh tao ticket hoac xem toan bo ticket
  const mo_giao_dien_ticket = () => {
    tai_tat_ca_ticket();
    if (danh_sach_ticket.length > 0) {
      set_che_do('danh_sach_ticket');
    } else {
      set_che_do('tao_ticket');
    }
  };

  // Xu ly gui form tao ticket
  const xu_ly_tao_ticket = async (e) => {
    e.preventDefault();
    set_loi_tao_ticket('');

    if (!form_ticket.ho_ten.trim()) {
      set_loi_tao_ticket('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!form_ticket.tieu_de.trim()) {
      set_loi_tao_ticket('Vui lòng nhập tiêu đề yêu cầu hỗ trợ.');
      return;
    }

    set_dang_tao_ticket(true);
    try {
      const res = await api_client.tao_ticket_ho_tro(form_ticket);
      if (res.success && res.du_lieu) {
        const ma = res.du_lieu.ma_ticket;
        try {
          let localCodes = [];
          const stored = localStorage.getItem('smartdesk_my_tickets');
          if (stored) localCodes = JSON.parse(stored);
          if (!localCodes.includes(ma)) localCodes.unshift(ma);
          localStorage.setItem('smartdesk_my_tickets', JSON.stringify(localCodes));
        } catch (e) {}

        set_active_ticket(res.du_lieu);
        set_active_ticket_code(ma);
        set_danh_sach_ticket(prev => [res.du_lieu, ...prev.filter(x => x.ma_ticket !== ma)]);
        set_che_do('ticket');
        set_form_ticket(prev => ({ ...prev, tieu_de: '', noi_dung: '' }));
      }
    } catch (err) {
      set_loi_tao_ticket(err.message || 'Không thể gửi yêu cầu hỗ trợ. Vui lòng thử lại.');
    } finally {
      set_dang_tao_ticket(false);
    }
  };

  // Xu ly khach gui tin nhan trong ticket
  const xu_ly_gui_tin_ticket = async (e) => {
    if (e) e.preventDefault();
    const nd = tin_nhan_ticket_moi.trim();
    if (!nd || !active_ticket || dang_gui_tin_ticket) return;

    set_dang_gui_tin_ticket(true);
    set_tin_nhan_ticket_moi('');

    const tinOptimistic = {
      id: Date.now(),
      ticket_id: active_ticket.id,
      nguoi_gui: 'khach_hang',
      ten_nguoi_gui: active_ticket.ho_ten,
      noi_dung: nd,
      thoi_gian: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    set_active_ticket(prev => ({
      ...prev,
      trang_thai: prev.trang_thai === 'da_dong' ? 'dang_xu_ly' : prev.trang_thai,
      tin_nhan: [...(prev.tin_nhan || []), tinOptimistic]
    }));

    try {
      await api_client.gui_tin_nhan_ticket(active_ticket.id, nd, active_ticket.ho_ten);
      tai_chi_tiet_ticket(active_ticket.ma_ticket);
    } catch (err) {
      console.error('Lỗi khi gửi tin nhắn ticket:', err);
    } finally {
      set_dang_gui_tin_ticket(false);
    }
  };

  // Dinh dang tien te VND
  const dinh_dang_tien = (tien) => {
    return Number(tien || 0).toLocaleString('vi-VN') + ' đ';
  };

  // Chuyen doi don gian noi dung markdown (**bold**, \n)
  const render_noi_dung = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={idx} style={{ minHeight: line.trim() === '' ? '8px' : 'auto' }}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="ai-chat-root">
      {/* 1. Nút bóng chat nổi (Floating Bubble Button) */}
      {!dang_mo && (
        <div className="ai-bubble-container">
          {da_thong_bao_chao && (
            <div className="ai-bubble-tooltip" onClick={() => set_dang_mo(true)}>
              <span className="tooltip-sparkle">💬</span>
              <span>Cần tư vấn mua sắm? Chat cùng SmartDesk!</span>
              <button 
                type="button" 
                className="tooltip-close" 
                onClick={(e) => { e.stopPropagation(); set_da_thong_bao_chao(false); }}
              >
                ✕
              </button>
            </div>
          )}
          <button
            type="button"
            className="ai-bubble-trigger-btn"
            onClick={() => set_dang_mo(true)}
            aria-label="Mở khung trò chuyện cùng Trợ lý AI SmartDesk"
            title="Trợ lý SmartDesk (Bấm để trò chuyện)"
            style={{
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              width: 'auto',
              height: 'auto',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <RobotTroLy3D
              kich_thuoc={82}
              co_bong={true}
              hanh_dong_ngoai={robot_hanh_dong}
              bieu_cam_ngoai={robot_bieu_cam}
            />
            <span
              className="ai-online-status-dot"
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '4px',
                zIndex: 10
              }}
            ></span>
          </button>
        </div>
      )}

      {/* 2. Cửa sổ chat AI (Chat Window) */}
      {dang_mo && (
        <div className="ai-chat-window" role="dialog" aria-label="Cửa sổ trò chuyện SmartDesk AI">
          {/* Header */}
          <div className="ai-chat-header">
            {che_do === 'ai' ? (
              <>
                <div className="ai-header-left">
                  <div
                    className="ai-header-avatar"
                    style={{
                      background: 'transparent',
                      boxShadow: 'none',
                      border: 'none',
                      width: '42px',
                      height: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0
                    }}
                  >
                    <RobotTroLy3D
                      kich_thuoc={40}
                      co_bong={false}
                      hanh_dong_ngoai={robot_hanh_dong}
                      bieu_cam_ngoai={robot_bieu_cam}
                    />
                    <span className="ai-avatar-badge"></span>
                  </div>
                  <div className="ai-header-info">
                    <div className="ai-header-title">
                      SmartDesk AI
                      <span className="ai-badge-tag">AI Agent</span>
                    </div>
                    <div className="ai-header-status">
                      <span className="status-indicator"></span>
                      Trực tuyến 24/7 • Tư vấn tức thì
                    </div>
                  </div>
                </div>

                <div className="ai-header-actions">
                  <button
                    type="button"
                    className="ai-btn-ticket-header"
                    onClick={mo_giao_dien_ticket}
                    title="Mở giao diện gửi Ticket / Chat trực tiếp với Quản trị viên"
                  >
                    🎫 Chat Admin
                  </button>
                  <button
                    type="button"
                    className="ai-btn-action"
                    onClick={xoa_lich_su}
                    title="Làm mới đoạn hội thoại"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                      <path d="M8 16H3v5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="ai-btn-action"
                    onClick={() => set_dang_mo(false)}
                    title="Thu nhỏ khung chat"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </>
            ) : che_do === 'danh_sach_ticket' ? (
              <>
                <div className="ai-header-left">
                  <button
                    type="button"
                    className="ai-btn-back"
                    onClick={() => set_che_do('ai')}
                    title="Quay lại trò chuyện với AI"
                  >
                    ← AI
                  </button>
                  <div className="ai-header-info">
                    <div className="ai-header-title">
                      Danh Sách Ticket ({danh_sach_ticket.length})
                      <span className="ai-badge-tag tag-admin">Hỗ trợ</span>
                    </div>
                    <div className="ai-header-status">
                      Toàn bộ yêu cầu hỗ trợ của bạn
                    </div>
                  </div>
                </div>
                <div className="ai-header-actions">
                  <button
                    type="button"
                    className="ai-btn-action"
                    onClick={tai_tat_ca_ticket}
                    title="Cập nhật danh sách ticket"
                  >
                    🔄
                  </button>
                  <button
                    type="button"
                    className="ai-btn-action"
                    onClick={() => set_che_do('tao_ticket')}
                    title="Tạo thêm ticket mới"
                  >
                    ➕
                  </button>
                  <button
                    type="button"
                    className="ai-btn-action"
                    onClick={() => set_dang_mo(false)}
                    title="Thu nhỏ khung chat"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </>
            ) : che_do === 'tao_ticket' ? (
              <>
                <div className="ai-header-left">
                  <button
                    type="button"
                    className="ai-btn-back"
                    onClick={() => danh_sach_ticket.length > 0 ? set_che_do('danh_sach_ticket') : set_che_do('ai')}
                    title="Quay lại"
                  >
                    ←
                  </button>
                  <div className="ai-header-info">
                    <div className="ai-header-title">
                      Tạo Ticket Hỗ Trợ
                      <span className="ai-badge-tag tag-admin">Admin</span>
                    </div>
                    <div className="ai-header-status">
                      Kết nối chuyên viên CSKH SmartDesk
                    </div>
                  </div>
                </div>
                <div className="ai-header-actions">
                  <button
                    type="button"
                    className="ai-btn-action"
                    onClick={() => set_dang_mo(false)}
                    title="Thu nhỏ khung chat"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              /* CHE DO: TICKET HO TRO DANG MO */
              <>
                <div className="ai-header-left">
                  <button
                    type="button"
                    className="ai-btn-back"
                    onClick={() => {
                      if (danh_sach_ticket.length > 1) {
                        tai_tat_ca_ticket();
                        set_che_do('danh_sach_ticket');
                      } else {
                        set_che_do('ai');
                      }
                    }}
                    title={danh_sach_ticket.length > 1 ? "Quay lại danh sách ticket" : "Quay lại trợ lý AI"}
                  >
                    {danh_sach_ticket.length > 1 ? '← DS' : '← AI'}
                  </button>
                  <div className="ai-header-info">
                    <div className="ai-header-title" style={{ fontSize: '13.5px' }}>
                      #{active_ticket?.ma_ticket}
                      <span className={`ai-ticket-status-pill pill-${active_ticket?.trang_thai}`}>
                        {active_ticket?.trang_thai === 'cho_xu_ly' && 'Chờ phản hồi'}
                        {active_ticket?.trang_thai === 'dang_xu_ly' && 'Đang hỗ trợ'}
                        {active_ticket?.trang_thai === 'da_dong' && 'Đã giải quyết'}
                      </span>
                    </div>
                    <div className="ai-header-status" style={{ fontSize: '11px' }}>
                      {active_ticket?.tieu_de?.slice(0, 30)}...
                    </div>
                  </div>
                </div>
                <div className="ai-header-actions">
                  <button
                    type="button"
                    className="ai-btn-action"
                    onClick={() => {
                      tai_tat_ca_ticket();
                      set_che_do('danh_sach_ticket');
                    }}
                    title="Xem tất cả ticket của bạn"
                  >
                    📋
                  </button>
                  <button
                    type="button"
                    className="ai-btn-action"
                    onClick={() => tai_chi_tiet_ticket(active_ticket_code)}
                    title="Làm mới tin nhắn ticket"
                  >
                    🔄
                  </button>
                  <button
                    type="button"
                    className="ai-btn-action"
                    onClick={() => set_che_do('tao_ticket')}
                    title="Tạo thêm ticket mới"
                  >
                    ➕
                  </button>
                  <button
                    type="button"
                    className="ai-btn-action"
                    onClick={() => set_dang_mo(false)}
                    title="Thu nhỏ khung chat"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* BODY: CHE DO 1 - AI CHAT */}
          {che_do === 'ai' && (
            <>
              <div className="ai-chat-body" ref={cuon_tin_nhan_ref}>
                {danh_sach_ticket.length > 1 ? (
                  <div className="ai-ticket-banner-alert" onClick={() => { tai_tat_ca_ticket(); set_che_do('danh_sach_ticket'); }}>
                    <span>🎫 Bạn đang có <strong>{danh_sach_ticket.length} ticket hỗ trợ</strong></span>
                    <button type="button" className="btn-xem-ticket-nhanh">Xem danh sách →</button>
                  </div>
                ) : danh_sach_ticket.length === 1 ? (
                  <div className="ai-ticket-banner-alert" onClick={() => chon_ticket_xem(danh_sach_ticket[0])}>
                    <span>🎫 Bạn đang có ticket hỗ trợ <strong>#{danh_sach_ticket[0].ma_ticket}</strong></span>
                    <button type="button" className="btn-xem-ticket-nhanh">Mở chat Admin →</button>
                  </div>
                ) : active_ticket_code ? (
                  <div className="ai-ticket-banner-alert" onClick={() => set_che_do('ticket')}>
                    <span>🎫 Bạn đang có ticket hỗ trợ <strong>#{active_ticket_code}</strong></span>
                    <button type="button" className="btn-xem-ticket-nhanh">Mở chat Admin →</button>
                  </div>
                ) : null}

                {danh_sach_tin_nhan.map((msg) => (
                  <div
                    key={msg.id}
                    className={`ai-message-row ${msg.nguoi_gui === 'user' ? 'row-user' : 'row-ai'}`}
                  >
                    {msg.nguoi_gui === 'ai' && (
                      <div
                        className="ai-msg-avatar"
                        style={{
                          background: 'transparent',
                          width: '32px',
                          height: '32px',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'visible'
                        }}
                      >
                        <RobotTroLy3D kich_thuoc={30} co_bong={false} />
                      </div>
                    )}

                    <div className="ai-message-content-wrapper">
                      <div className={`ai-message-bubble ${msg.nguoi_gui === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                        <div className="ai-bubble-text">
                          {render_noi_dung(msg.noi_dung)}
                        </div>

                        {/* Danh sách thẻ sản phẩm đính kèm nếu có */}
                        {Array.isArray(msg.san_pham) && msg.san_pham.length > 0 && (
                          <div className="ai-product-suggestions">
                            <div className="ai-product-suggestions-title">
                              🛒 Sản phẩm gợi ý phù hợp:
                            </div>
                            <div className="ai-product-grid">
                              {msg.san_pham.map((sp) => (
                                <div key={sp.id} className="ai-product-card">
                                  <div className="ai-product-card-img">
                                    <img
                                      src={sp.anh_chinh || '/images/san_pham/default.png'}
                                      alt={sp.ten_san_pham}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://placehold.co/100x100?text=SmartDesk';
                                      }}
                                    />
                                  </div>
                                  <div className="ai-product-card-details">
                                    <div className="ai-product-card-brand">{sp.thuong_hieu}</div>
                                    <div className="ai-product-card-name" title={sp.ten_san_pham}>
                                      {sp.ten_san_pham}
                                    </div>
                                    <div className="ai-product-card-price">
                                      <span className="current-price">{dinh_dang_tien(sp.gia)}</span>
                                      {sp.gia_goc > sp.gia && (
                                        <span className="old-price">{dinh_dang_tien(sp.gia_goc)}</span>
                                      )}
                                    </div>
                                    <div className="ai-product-card-actions">
                                      <button
                                        type="button"
                                        className="ai-card-btn detail-btn"
                                        onClick={() => {
                                          if (onXemChiTietSanPham) {
                                            onXemChiTietSanPham(sp.id);
                                          }
                                        }}
                                      >
                                        Xem chi tiết
                                      </button>
                                      <button
                                        type="button"
                                        className="ai-card-btn cart-btn"
                                        onClick={() => {
                                          if (onThemVaoGio) {
                                            onThemVaoGio(sp, 1);
                                          }
                                        }}
                                        title="Thêm vào giỏ hàng"
                                      >
                                        + Giỏ
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="ai-message-time">{msg.thoi_gian}</div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {dang_gui && (
                  <div className="ai-message-row row-ai">
                    <div className="ai-msg-avatar">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="8" width="18" height="12" rx="4" />
                        <circle cx="9" cy="13" r="1.5" fill="currentColor" />
                        <circle cx="15" cy="13" r="1.5" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="ai-message-bubble bubble-ai typing-bubble">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="typing-label">SmartDesk AI đang phân tích...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Prompts */}
              <div className="ai-quick-prompts-wrapper">
                <div className="ai-quick-prompts-scroll">
                  {goi_y_cau_hoi.map((item, index) => {
                    if (item.action === 'ticket') {
                      return (
                        <button
                          key={index}
                          type="button"
                          className="ai-chip-prompt chip-ticket-highlight"
                          onClick={mo_giao_dien_ticket}
                          title="Tạo ticket hỗ trợ để chat cùng Admin"
                        >
                          {item.nhan}
                        </button>
                      );
                    }
                    const nhan = typeof item === 'object' ? item.nhan : item;
                    const cauHoi = typeof item === 'object' ? item.cau_hoi : item;
                    return (
                      <button
                        key={index}
                        type="button"
                        className="ai-chip-prompt"
                        disabled={dang_gui}
                        onClick={() => gui_tin_nhan(cauHoi)}
                        title={cauHoi}
                      >
                        {nhan}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Bar */}
              <div className="ai-chat-footer">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    gui_tin_nhan();
                  }}
                  className="ai-input-form"
                >
                  <input
                    ref={o_nhap_ref}
                    type="text"
                    className="ai-chat-input"
                    placeholder="Hỏi AI về sản phẩm, giá, voucher..."
                    value={tin_nhan_moi}
                    onChange={(e) => set_tin_nhan_moi(e.target.value)}
                    onKeyDown={xu_ly_enter}
                    disabled={dang_gui}
                  />
                  <button
                    type="submit"
                    className="ai-chat-send-btn"
                    disabled={dang_gui || !tin_nhan_moi.trim()}
                    aria-label="Gửi câu hỏi"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </form>
              </div>
            </>
          )}

          {/* BODY: CHE DO DANH SACH TICKET */}
          {che_do === 'danh_sach_ticket' && (
            <div className="ai-ticket-list-body">
              {danh_sach_ticket.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  <div style={{ fontSize: '38px', marginBottom: '12px' }}>🎫</div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>
                    Chưa có ticket hỗ trợ nào
                  </p>
                  <p style={{ margin: '6px 0 16px 0', fontSize: '12.5px', color: '#64748b' }}>
                    Bạn có thể tạo yêu cầu mới để chuyên viên CSKH kết nối và hỗ trợ trực tiếp.
                  </p>
                  <button
                    type="button"
                    className="ai-btn-create-new-ticket"
                    onClick={() => set_che_do('tao_ticket')}
                  >
                    ➕ Tạo ticket hỗ trợ mới
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {danh_sach_ticket.map((tk) => {
                    const lastMsg = Array.isArray(tk.tin_nhan) && tk.tin_nhan.length > 0
                      ? tk.tin_nhan[tk.tin_nhan.length - 1]
                      : null;
                    return (
                      <div
                        key={tk.id || tk.ma_ticket}
                        className="ai-ticket-list-item"
                        onClick={() => chon_ticket_xem(tk)}
                      >
                        <div className="ai-ticket-item-top">
                          <span className="ai-ticket-item-code">#{tk.ma_ticket}</span>
                          <span className={`ai-ticket-status-pill pill-${tk.trang_thai}`}>
                            {tk.trang_thai === 'cho_xu_ly' && 'Chờ phản hồi'}
                            {tk.trang_thai === 'dang_xu_ly' && 'Đang hỗ trợ'}
                            {tk.trang_thai === 'da_dong' && 'Đã giải quyết'}
                          </span>
                        </div>
                        <div className="ai-ticket-item-title">{tk.tieu_de}</div>
                        {lastMsg && (
                          <div className="ai-ticket-item-preview">
                            <strong>{lastMsg.nguoi_gui === 'admin' ? '🛡️ Admin' : 'Bạn'}:</strong> {lastMsg.noi_dung}
                          </div>
                        )}
                        <div className="ai-ticket-item-bottom">
                          <span>
                            {tk.chu_de === 'tu_van_san_pham' && '💡 Tư vấn'}
                            {tk.chu_de === 'don_hang_van_chuyen' && '🚚 Đơn hàng'}
                            {tk.chu_de === 'bao_hanh_doi_tra' && '🔄 Bảo hành'}
                            {tk.chu_de === 'hoa_don_vat' && '📄 VAT'}
                            {tk.chu_de === 'khac' && '❓ Khác'}
                          </span>
                          <span className="ai-ticket-item-action">
                            {Array.isArray(tk.tin_nhan) ? `${tk.tin_nhan.length} tin nhắn` : ''} • Nhấn để chat →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="ai-ticket-list-footer">
                <button
                  type="button"
                  className="ai-btn-create-new-ticket"
                  onClick={() => set_che_do('tao_ticket')}
                >
                  ➕ Gửi thêm yêu cầu hỗ trợ mới
                </button>
              </div>
            </div>
          )}

          {/* BODY: CHE DO 2 - FORM TAO TICKET */}
          {che_do === 'tao_ticket' && (
            <div className="ai-ticket-form-container">
              <div className="ai-ticket-form-header-box">
                <div className="ticket-form-icon">🎧</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>
                    Yêu Cầu Hỗ Trợ Chuyên Viên
                  </h4>
                  <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                    Nhân viên kỹ thuật & tư vấn SmartDesk sẽ tiếp nhận và phản hồi ngay cho bạn.
                  </p>
                </div>
              </div>

              {loi_tao_ticket && (
                <div className="ai-form-error-banner">
                  ⚠️ {loi_tao_ticket}
                </div>
              )}

              <form onSubmit={xu_ly_tao_ticket} className="ai-ticket-form">
                <div className="ai-form-group">
                  <label>Họ và tên của bạn <span className="req">*</span></label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={form_ticket.ho_ten}
                    onChange={(e) => set_form_ticket({ ...form_ticket, ho_ten: e.target.value })}
                    required
                  />
                </div>

                <div className="ai-form-row">
                  <div className="ai-form-group" style={{ flex: 1 }}>
                    <label>Số điện thoại / Zalo</label>
                    <input
                      type="tel"
                      placeholder="09xx xxx xxx"
                      value={form_ticket.so_dien_thoai}
                      onChange={(e) => set_form_ticket({ ...form_ticket, so_dien_thoai: e.target.value })}
                    />
                  </div>
                  <div className="ai-form-group" style={{ flex: 1 }}>
                    <label>Email liên hệ</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={form_ticket.email}
                      onChange={(e) => set_form_ticket({ ...form_ticket, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="ai-form-group">
                  <label>Chủ đề yêu cầu</label>
                  <select
                    value={form_ticket.chu_de}
                    onChange={(e) => set_form_ticket({ ...form_ticket, chu_de: e.target.value })}
                  >
                    <option value="tu_van_san_pham">💡 Tư vấn chọn sản phẩm & Báo giá</option>
                    <option value="don_hang_van_chuyen">🚚 Tra cứu đơn hàng & Vận chuyển</option>
                    <option value="bao_hanh_doi_tra">🔄 Chính sách đổi trả & Bảo hành</option>
                    <option value="hoa_don_vat">📄 Xuất hóa đơn VAT Doanh nghiệp B2B</option>
                    <option value="khac">❓ Vấn đề khác</option>
                  </select>
                </div>

                <div className="ai-form-group">
                  <label>Tiêu đề yêu cầu <span className="req">*</span></label>
                  <input
                    type="text"
                    placeholder="Tóm tắt ngắn gọn vấn đề cần hỗ trợ..."
                    value={form_ticket.tieu_de}
                    onChange={(e) => set_form_ticket({ ...form_ticket, tieu_de: e.target.value })}
                    required
                  />
                </div>

                <div className="ai-form-group">
                  <label>Mô tả chi tiết nội dung</label>
                  <textarea
                    rows={3}
                    placeholder="Cung cấp thông tin chi tiết (mã đơn hàng, tên sản phẩm, câu hỏi...)"
                    value={form_ticket.noi_dung}
                    onChange={(e) => set_form_ticket({ ...form_ticket, noi_dung: e.target.value })}
                  />
                </div>

                <div className="ai-form-actions">
                  <button
                    type="button"
                    className="ai-btn-cancel-ticket"
                    onClick={() => set_che_do('ai')}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="ai-btn-submit-ticket"
                    disabled={dang_tao_ticket}
                  >
                    {dang_tao_ticket ? 'Đang gửi...' : 'Gửi yêu cầu & Mở chat'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* BODY: CHE DO 3 - LIVE CHAT TICKET VOI ADMIN */}
          {che_do === 'ticket' && active_ticket && (
            <>
              <div className="ai-ticket-chat-body" ref={cuon_ticket_ref}>
                {/* Thong tin tom tat ticket */}
                <div className="ai-ticket-info-card">
                  <div className="ticket-card-row">
                    <span className="ticket-code">Mã: {active_ticket.ma_ticket}</span>
                    <span className="ticket-subject">
                      {active_ticket.chu_de === 'tu_van_san_pham' && '💡 Tư vấn'}
                      {active_ticket.chu_de === 'don_hang_van_chuyen' && '🚚 Đơn hàng'}
                      {active_ticket.chu_de === 'bao_hanh_doi_tra' && '🔄 Bảo hành'}
                      {active_ticket.chu_de === 'hoa_don_vat' && '📄 VAT'}
                      {active_ticket.chu_de === 'khac' && '❓ Khác'}
                    </span>
                  </div>
                  <div className="ticket-card-title">{active_ticket.tieu_de}</div>
                  <div className="ticket-card-meta">
                    <span>Khách: {active_ticket.ho_ten}</span>
                    {active_ticket.so_dien_thoai && <span> • SĐT: {active_ticket.so_dien_thoai}</span>}
                  </div>
                </div>

                {/* Danh sach tin nhan ticket */}
                <div className="ai-ticket-messages-list">
                  {Array.isArray(active_ticket.tin_nhan) && active_ticket.tin_nhan.map((tn) => {
                    const laAdmin = tn.nguoi_gui === 'admin';
                    return (
                      <div
                        key={tn.id}
                        className={`ai-ticket-msg-row ${laAdmin ? 'row-admin' : 'row-khach'}`}
                      >
                        {laAdmin && (
                          <div className="admin-msg-avatar">
                            🛡️
                          </div>
                        )}
                        <div className="ai-ticket-msg-bubble">
                          <div className="ticket-msg-header">
                            <span className="ticket-msg-author">
                              {laAdmin ? 'Chuyên viên SmartDesk' : tn.ten_nguoi_gui || 'Bạn'}
                            </span>
                            {laAdmin && <span className="admin-verified-tag">Admin</span>}
                            <span className="ticket-msg-time">
                              {new Date(tn.thoi_gian).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="ticket-msg-text">
                            {render_noi_dung(tn.noi_dung)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {active_ticket.trang_thai === 'da_dong' && (
                  <div className="ai-ticket-closed-notice">
                    ✓ Ticket này đã được giải quyết. Gửi thêm tin nhắn để mở lại ticket nếu bạn cần hỗ trợ thêm.
                  </div>
                )}
              </div>

              {/* Input chat ticket */}
              <div className="ai-chat-footer">
                <form onSubmit={xu_ly_gui_tin_ticket} className="ai-input-form">
                  <input
                    ref={o_nhap_ticket_ref}
                    type="text"
                    className="ai-chat-input"
                    placeholder="Nhập tin nhắn gửi chuyên viên..."
                    value={tin_nhan_ticket_moi}
                    onChange={(e) => set_tin_nhan_ticket_moi(e.target.value)}
                    disabled={dang_gui_tin_ticket}
                  />
                  <button
                    type="submit"
                    className="ai-chat-send-btn btn-ticket-send"
                    disabled={dang_gui_tin_ticket || !tin_nhan_ticket_moi.trim()}
                    aria-label="Gửi tin nhắn cho admin"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
