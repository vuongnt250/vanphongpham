import React, { useState, useEffect, useRef } from 'react';
import TrangChu from './trang/trang_chu/trang_chu';
import TrangCuaHang from './trang/trang_cua_hang/trang_cua_hang';
import TrangChiTietSanPham from './trang/trang_chi_tiet_san_pham/trang_chi_tiet_san_pham';
import TrangGioHang from './trang/trang_gio_hang/trang_gio_hang';
import Profile from './trang/profile/profile';
import DangNhapDangKy from './trang/xac_thuc/dang_nhap_dang_ky';
import AdminDashboard from './trang/admin/admin_dashboard';
import ChinhSachDoiTra from './trang/thong_tin/chinh_sach_doi_tra';
import ChinhSachGiaoHang from './trang/thong_tin/chinh_sach_giao_hang';
import MuaHangDoanhNghiep from './trang/thong_tin/mua_hang_doanh_nghiep';
import BaoHanhChungTu from './trang/thong_tin/bao_hanh_chung_tu';
import BongChatAI from './thanh_phan/bong_chat_ai';
import BannerLaVai from './thanh_phan/banner_la_vai';
import ModalWishlist from './thanh_phan/modal_wishlist';
import ModalSoSanh from './thanh_phan/modal_so_sanh';
import ThanhSoSanhNoi from './thanh_phan/thanh_so_sanh_noi';
import { bat_dau_nghe_giong_noi } from './tien_ich/tro_ly_giong_noi';
import api_client from './dich_vu_api';
import {
  IconSearch,
  IconCart,
  IconSun,
  IconMoon,
  IconUser,
  IconPhone,
  IconMail,
  IconHeart
} from './thanh_phan/bieu_tuong';

export default function App() {
  const [trang_hien_tai, set_trang_hien_tai] = useState('trang_chu'); 
  const [san_pham_dang_xem_id, set_san_pham_dang_xem_id] = useState(null);
  const [bo_loc_cua_hang, set_bo_loc_cua_hang] = useState({});
  const [tu_khoa_header, set_tu_khoa_header] = useState('');
  const [dang_nghe_header, set_dang_nghe_header] = useState(false);
  const [hien_modal_auth, set_hien_modal_auth] = useState(false);
  const [hien_menu_user, set_hien_menu_user] = useState(false);

  // Quan ly Danh sach yeu thich (Wishlist) & So sanh san pham (Product Compare)
  const [danh_sach_wishlist, set_danh_sach_wishlist] = useState(() => {
    try {
      const raw = localStorage.getItem('smartdesk_wishlist');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [hien_modal_wishlist, set_hien_modal_wishlist] = useState(false);

  const [danh_sach_so_sanh, set_danh_sach_so_sanh] = useState(() => {
    try {
      const raw = localStorage.getItem('smartdesk_compare');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [hien_modal_so_sanh, set_hien_modal_so_sanh] = useState(false);

  // Dong bo Wishlist & Compare khi thay doi tu the_san_pham hoac cac trang khac
  useEffect(() => {
    const dongBoWishlist = () => {
      try {
        const raw = localStorage.getItem('smartdesk_wishlist');
        set_danh_sach_wishlist(raw ? JSON.parse(raw) : []);
      } catch (e) {}
    };
    const dongBoSoSanh = () => {
      try {
        const raw = localStorage.getItem('smartdesk_compare');
        set_danh_sach_so_sanh(raw ? JSON.parse(raw) : []);
      } catch (e) {}
    };

    window.addEventListener('smartdesk_wishlist_updated', dongBoWishlist);
    window.addEventListener('smartdesk_compare_updated', dongBoSoSanh);
    window.addEventListener('storage', dongBoWishlist);
    window.addEventListener('storage', dongBoSoSanh);

    return () => {
      window.removeEventListener('smartdesk_wishlist_updated', dongBoWishlist);
      window.removeEventListener('smartdesk_compare_updated', dongBoSoSanh);
      window.removeEventListener('storage', dongBoWishlist);
      window.removeEventListener('storage', dongBoSoSanh);
    };
  }, []);

  const menuRef = useRef(null);

  // Quan ly Dark Mode (Che do toi)
  const [che_do_toi, set_che_do_toi] = useState(() => {
    try {
      return localStorage.getItem('smartdesk_theme') === 'dark';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (che_do_toi) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [che_do_toi]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        set_hien_menu_user(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const chuyen_che_do_toi = () => {
    set_che_do_toi(prev => {
      const next = !prev;
      try {
        localStorage.setItem('smartdesk_theme', next ? 'dark' : 'light');
      } catch (e) {}
      return next;
    });
  };

  // Quan ly nguoi dung dang nhap
  const [nguoi_dung, set_nguoi_dung] = useState(() => {
    try {
      const luu = localStorage.getItem('smartdesk_current_user');
      return luu ? JSON.parse(luu) : null;
    } catch (e) {
      return null;
    }
  });

  // State gio hang: Database la nguon su that duy nhat khi da dang nhap, localStorage cho khach vang lai
  const [gio_hang, set_gio_hang] = useState(() => {
    try {
      const luu = localStorage.getItem('smartdesk_cart');
      return luu ? JSON.parse(luu) : [];
    } catch (e) {
      return [];
    }
  });

  // Ham dong bo gio hang tu database
  const tai_gio_hang_tu_db = async () => {
    try {
      const res = await api_client.lay_gio_hang();
      if (res.success && res.du_lieu && Array.isArray(res.du_lieu.danh_sach)) {
        set_gio_hang(res.du_lieu.danh_sach);
      }
    } catch (e) {
      console.error('Lỗi tải giỏ hàng từ máy chủ:', e);
    }
  };

  // Dong bo va merge gio hang khi trang thai nguoi dung thay doi
  useEffect(() => {
    if (nguoi_dung) {
      const dong_bo_khi_dang_nhap = async () => {
        try {
          const cartKhachStr = localStorage.getItem('smartdesk_cart');
          if (cartKhachStr) {
            const itemsKhach = JSON.parse(cartKhachStr);
            if (Array.isArray(itemsKhach) && itemsKhach.length > 0) {
              for (const item of itemsKhach) {
                const spId = item.san_pham?.id || item.san_pham_id;
                const sl = item.so_luong || 1;
                if (spId) {
                  await api_client.them_vao_gio(spId, sl).catch(() => {});
                }
              }
              localStorage.removeItem('smartdesk_cart');
            }
          }
          await tai_gio_hang_tu_db();
        } catch (e) {
          console.error('Lỗi hợp nhất giỏ hàng:', e);
        }
      };
      dong_bo_khi_dang_nhap();
    } else {
      // Khach vang lai: doc tu localStorage
      try {
        const luu = localStorage.getItem('smartdesk_cart');
        set_gio_hang(luu ? JSON.parse(luu) : []);
      } catch (e) {
        set_gio_hang([]);
      }
    }
  }, [nguoi_dung]);

  // Luu localStorage chi ap dung cho khach vang lai (chua dang nhap)
  useEffect(() => {
    if (!nguoi_dung) {
      try {
        localStorage.setItem('smartdesk_cart', JSON.stringify(gio_hang));
      } catch (e) {}
    }
  }, [gio_hang, nguoi_dung]);

  const so_luong_gio_hang = gio_hang.reduce((tong, item) => tong + (item.so_luong || 1), 0);

  const xu_ly_dang_nhap_thanh_cong = (user) => {
    set_nguoi_dung(user);
    try {
      localStorage.setItem('smartdesk_current_user', JSON.stringify(user));
    } catch (e) {}
    set_hien_modal_auth(false);
  };

  const xu_ly_dang_xuat = () => {
    set_nguoi_dung(null);
    set_hien_menu_user(false);
    try {
      localStorage.removeItem('smartdesk_current_user');
      localStorage.removeItem('smartdesk_token');
      localStorage.removeItem('smartdesk_cart');
    } catch (e) {}
    set_gio_hang([]);
    if (trang_hien_tai === 'profile') {
      set_trang_hien_tai('trang_chu');
    }
  };

  const xu_ly_cap_nhat_nguoi_dung = (userMoi) => {
    set_nguoi_dung(userMoi);
    try {
      localStorage.setItem('smartdesk_current_user', JSON.stringify(userMoi));
    } catch (e) {}
  };

  const xem_chi_tiet = (sp) => {
    const spId = typeof sp === 'object' && sp !== null ? sp.id : sp;
    set_san_pham_dang_xem_id(spId);
    set_trang_hien_tai('chi_tiet');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dieu_huong_cua_hang = (bo_loc = {}) => {
    set_bo_loc_cua_hang(bo_loc);
    set_trang_hien_tai('cua_hang');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [thong_bao_gio_hang, set_thong_bao_gio_hang] = useState(null);

  useEffect(() => {
    if (thong_bao_gio_hang) {
      const timer = setTimeout(() => {
        set_thong_bao_gio_hang(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [thong_bao_gio_hang]);

  const them_vao_gio = async (tham_so, so_luong_phu = 1) => {
    let san_pham = tham_so?.san_pham || tham_so;
    while (san_pham && san_pham.san_pham) {
      san_pham = san_pham.san_pham;
    }
    const so_luong = Number(tham_so?.so_luong || so_luong_phu || 1);
    if (!san_pham || !san_pham.id) return;

    if (nguoi_dung) {
      try {
        const res = await api_client.them_vao_gio(san_pham.id, so_luong);
        if (res.success && res.du_lieu && Array.isArray(res.du_lieu.danh_sach)) {
          set_gio_hang(res.du_lieu.danh_sach);
        } else {
          await tai_gio_hang_tu_db();
        }
      } catch (e) {
        console.error('Lỗi thêm giỏ hàng DB:', e);
      }
    } else {
      set_gio_hang(prev => {
        const idx = prev.findIndex(item => item.san_pham.id === san_pham.id);
        if (idx >= 0) {
          const moi = [...prev];
          moi[idx] = { ...moi[idx], so_luong: moi[idx].so_luong + so_luong };
          return moi;
        }
        return [...prev, { san_pham, so_luong }];
      });
    }

    set_thong_bao_gio_hang({
      san_pham,
      so_luong,
      id_toast: Date.now()
    });
  };

  const thay_doi_so_luong = async (san_pham_id, so_luong_moi) => {
    if (so_luong_moi <= 0) {
      await xoa_khoi_gio(san_pham_id);
      return;
    }

    if (nguoi_dung) {
      try {
        const res = await api_client.sua_so_luong_gio(san_pham_id, so_luong_moi);
        if (res.success && res.du_lieu && Array.isArray(res.du_lieu.danh_sach)) {
          set_gio_hang(res.du_lieu.danh_sach);
        } else {
          await tai_gio_hang_tu_db();
        }
      } catch (e) {
        console.error('Lỗi sửa số lượng DB:', e);
      }
    } else {
      set_gio_hang(prev => prev.map(item => 
        item.san_pham.id === san_pham_id ? { ...item, so_luong: so_luong_moi } : item
      ));
    }
  };

  const xoa_khoi_gio = async (san_pham_id) => {
    if (nguoi_dung) {
      try {
        const res = await api_client.xoa_khoi_gio(san_pham_id);
        if (res.success && res.du_lieu && Array.isArray(res.du_lieu.danh_sach)) {
          set_gio_hang(res.du_lieu.danh_sach);
        } else {
          await tai_gio_hang_tu_db();
        }
      } catch (e) {
        console.error('Lỗi xóa khỏi giỏ DB:', e);
      }
    } else {
      set_gio_hang(prev => prev.filter(item => item.san_pham.id !== san_pham_id));
    }
  };

  const xoa_toan_bo_gio = async () => {
    if (nguoi_dung) {
      try {
        await api_client.xoa_het_gio();
        set_gio_hang([]);
      } catch (e) {
        console.error('Lỗi dọn sạch giỏ DB:', e);
      }
    } else {
      set_gio_hang([]);
      try { localStorage.removeItem('smartdesk_cart'); } catch (e) {}
    }
  };

  const xu_ly_tim_kiem_header = (e) => {
    e.preventDefault();
    if (tu_khoa_header.trim()) {
      dieu_huong_cua_hang({ tu_khoa: tu_khoa_header.trim() });
      set_tu_khoa_header('');
    }
  };

  const recognitionHeaderRef = useRef(null);

  const xu_ly_giong_noi_header = () => {
    if (dang_nghe_header) {
      if (recognitionHeaderRef.current) {
        try { recognitionHeaderRef.current.stop(); } catch (e) {}
      }
      set_dang_nghe_header(false);
      return;
    }

    set_tu_khoa_header('');
    set_dang_nghe_header(true);

    recognitionHeaderRef.current = bat_dau_nghe_giong_noi({
      onStart: () => {
        set_dang_nghe_header(true);
      },
      onInterim: (vanBanTrucTiep) => {
        // Khi máy vừa nghe được âm thanh, chữ sẽ lập tức hiện ra ô tìm kiếm
        set_tu_khoa_header(vanBanTrucTiep);
      },
      onKetQua: (vanBanChot, isFinal) => {
        set_tu_khoa_header(vanBanChot);
        if (isFinal && vanBanChot.trim()) {
          // Khi người dùng ngưng nói, tự động thực hiện tìm kiếm
          dieu_huong_cua_hang({ tu_khoa: vanBanChot.trim() });
        }
      },
      onKetThuc: () => {
        set_dang_nghe_header(false);
        recognitionHeaderRef.current = null;
      },
      onError: (err) => {
        set_dang_nghe_header(false);
        recognitionHeaderRef.current = null;
        if (err && err.message) {
          alert(err.message);
        }
      }
    });
  };

  return (
    <div data-theme={che_do_toi ? 'dark' : 'light'} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-main)' }}>
      {/* 1. Top Ribbon */}
      <div style={{ backgroundColor: '#0b0f19', color: '#94a3b8', fontSize: '13px', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container top-ribbon-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Miễn phí giao hàng toàn quốc cho đơn từ 300.000đ · Hotline B2B: <strong>1900 1234</strong></span>
          <div className="top-ribbon-contacts" style={{ display: 'flex', gap: '22px', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <IconPhone size={13} color="#94a3b8" />
              1900 1234
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <IconMail size={13} color="#94a3b8" />
              hotro@smartdesk.vn
            </span>
          </div>
        </div>
      </div>

      {/* Security Alert: Yeu cau doi mat khau mac dinh */}
      {nguoi_dung && Boolean(nguoi_dung.yeu_cau_doi_mat_khau) && (
        <div style={{ backgroundColor: '#fff1f2', borderBottom: '1px solid #fecdd3', color: '#9f1239', padding: '10px 16px', fontSize: '13.5px', fontWeight: '500' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>🚨</span>
              <span><strong>Cảnh báo bảo mật:</strong> Bạn đang sử dụng mật khẩu mặc định/tạm thời. Vui lòng đổi mật khẩu ngay để kích hoạt đầy đủ chính sách an toàn.</span>
            </div>
            <button
              onClick={() => {
                set_trang_hien_tai('profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                backgroundColor: '#e11d48',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Đổi mật khẩu ngay →
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Header (Height 68px, 1320px Wide) */}
      <header className="header-wrapper">
        <div className="container">
          <div className="header-top">
            {/* Logo */}
            <div
              className="brand-logo"
              onClick={() => {
                set_trang_hien_tai('trang_chu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="brand-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </div>
              <div className="brand-title">
                Smart<span>Desk</span>
              </div>
            </div>

            {/* Quick Search in Header (540px Max) */}
            <form onSubmit={xu_ly_tim_kiem_header} className="header-search" style={{ position: 'relative' }}>
              <input
                type="text"
                value={tu_khoa_header}
                onChange={(e) => set_tu_khoa_header(e.target.value)}
                placeholder={dang_nghe_header ? "🎙️ Đang nghe... Hãy nói tên sản phẩm..." : "Tìm kiếm giấy Double A, bút Thiên Long, máy tính Casio, file Deli..."}
                style={{
                  width: '100%',
                  padding: '10px 72px 10px 18px',
                  borderRadius: '9999px',
                  border: dang_nghe_header ? '2px solid #ef4444' : '1px solid var(--color-border)',
                  backgroundColor: dang_nghe_header ? '#fff1f2' : 'var(--color-surface-muted)',
                  color: 'var(--color-text-main)',
                  fontSize: '14px',
                  outline: 'none',
                  boxShadow: dang_nghe_header ? '0 0 0 4px rgba(239, 68, 68, 0.18)' : 'none',
                  transition: 'all 0.2s'
                }}
              />
              <div style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <button
                  type="button"
                  onClick={xu_ly_giong_noi_header}
                  className={`btn-voice-search ${dang_nghe_header ? 'is-listening' : ''}`}
                  title={dang_nghe_header ? 'Bấm để dừng nghe và tìm kiếm ngay' : 'Tìm kiếm bằng giọng nói tiếng Việt'}
                  style={{
                    background: dang_nghe_header ? '#fee2e2' : 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px'
                  }}
                >
                  {dang_nghe_header ? '🔴' : '🎙️'}
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconSearch size={17} />
                </button>
              </div>

              {/* Tag huong dan truc quan khi dang lang nghe */}
              {dang_nghe_header && (
                <div style={{
                  position: 'absolute',
                  top: '108%',
                  left: '18px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  padding: '5px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
                  zIndex: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffffff' }}></span>
                  <span>Đang lắng nghe... Nói tên sản phẩm (ngưng nói để tìm kiếm tự động)</span>
                </div>
              )}
            </form>

            {/* Navigation links & Actions */}
            <nav className="header-nav">
              <button
                type="button"
                className={`nav-link ${trang_hien_tai === 'trang_chu' ? 'active' : ''}`}
                onClick={() => {
                  set_trang_hien_tai('trang_chu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Trang chủ
              </button>

              <button
                type="button"
                className={`nav-link ${trang_hien_tai === 'cua_hang' ? 'active' : ''}`}
                onClick={() => dieu_huong_cua_hang({})}
              >
                Cửa hàng
              </button>

              {/* Nút Quản trị trực tiếp trên Header cho Quản trị viên */}
              {Boolean(nguoi_dung && (nguoi_dung.vai_tro === 'admin' || nguoi_dung.role === 'admin' || nguoi_dung.tai_khoan === 'admin')) && (
                <button
                  type="button"
                  className={`admin-nav-badge-btn ${trang_hien_tai === 'admin' ? 'active' : ''}`}
                  onClick={() => {
                    set_trang_hien_tai('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  title="Khu vực Quản trị hệ thống"
                >
                  <span style={{ fontSize: '14px' }}>📊</span>
                  <span>Quản trị</span>
                </button>
              )}

              {/* Nut chuyen doi Dark Mode */}
              <button
                type="button"
                className="theme-toggle-btn"
                onClick={chuyen_che_do_toi}
                title={che_do_toi ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
              >
                {che_do_toi ? <IconSun size={17} color="#f59e0b" /> : <IconMoon size={17} color="#64748b" />}
              </button>

              {/* Nut Wishlist (Yeu thich) */}
              <button
                type="button"
                className="wishlist-header-btn"
                onClick={() => set_hien_modal_wishlist(true)}
                title="Danh sách sản phẩm yêu thích"
              >
                <IconHeart size={17} filled={danh_sach_wishlist.length > 0} color={danh_sach_wishlist.length > 0 ? '#ef4444' : 'currentColor'} />
                <span className="wishlist-btn-label">Yêu thích</span>
                {danh_sach_wishlist.length > 0 && (
                  <span className="wishlist-badge">{danh_sach_wishlist.length}</span>
                )}
              </button>

              {/* Nut Gio Hang */}
              <button
                type="button"
                className="cart-btn"
                onClick={() => {
                  set_trang_hien_tai('gio_hang');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <IconCart size={17} />
                <span className="cart-btn-label">Giỏ hàng</span>
                <span className="cart-badge">{so_luong_gio_hang}</span>
              </button>

              {/* Nut Tai khoan voi Dropdown Menu chuan E-Commerce */}
              {nguoi_dung ? (
                <div className="user-dropdown-container" ref={menuRef}>
                  <button
                    type="button"
                    className="user-profile-btn"
                    onClick={() => set_hien_menu_user(!hien_menu_user)}
                  >
                    <IconUser size={16} />
                    <span>{nguoi_dung.tai_khoan}</span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>▼</span>
                  </button>

                  {hien_menu_user && (
                    <div className="user-dropdown-menu">
                      <div style={{ padding: '8px 16px 10px', borderBottom: '1px solid var(--color-border)' }}>
                        <div style={{ fontWeight: '700', fontSize: '13.5px' }}>{nguoi_dung.ho_ten || nguoi_dung.tai_khoan}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                          {nguoi_dung.vai_tro === 'admin' ? 'Quản trị viên hệ thống' : 'Khách hàng SmartDesk'}
                        </div>
                      </div>

                      {(nguoi_dung.vai_tro === 'admin' || nguoi_dung.role === 'admin') && (
                        <button
                          type="button"
                          className="user-dropdown-item"
                          style={{ color: '#b45309', fontWeight: '700', backgroundColor: '#fffbeb' }}
                          onClick={() => {
                            set_trang_hien_tai('admin');
                            set_hien_menu_user(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          ⚡ Quản trị Admin Console
                        </button>
                      )}

                      <button
                        type="button"
                        className="user-dropdown-item"
                        onClick={() => {
                          set_trang_hien_tai('profile');
                          set_hien_menu_user(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        Hồ sơ & Đơn hàng
                      </button>

                      <button
                        type="button"
                        className="user-dropdown-item"
                        onClick={() => {
                          dieu_huong_cua_hang({});
                          set_hien_menu_user(false);
                        }}
                      >
                        Tiếp tục mua sắm
                      </button>

                      <div className="user-dropdown-divider" />

                      <button
                        type="button"
                        className="user-dropdown-item"
                        style={{ color: '#ef4444' }}
                        onClick={xu_ly_dang_xuat}
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => set_hien_modal_auth(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-main)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: '600',
                    fontSize: '13.5px',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <IconUser size={15} />
                  <span>Đăng nhập</span>
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* 3. Main Content Area */}
      <main style={{ flex: 1, position: 'relative' }}>
        {/* Banner khuyến mại 2 bên sườn chỉ hiển thị ở Trang chủ để không che khuất nội dung mua sắm/thanh toán */}
        {trang_hien_tai === 'trang_chu' && (
          <BannerLaVai
            on_dieu_huong_cua_hang={dieu_huong_cua_hang}
            on_chuyen_trang={(trang) => {
              set_trang_hien_tai(trang);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {trang_hien_tai === 'trang_chu' && (
          <TrangChu
            on_dieu_huong_cua_hang={dieu_huong_cua_hang}
            on_chon_san_pham={xem_chi_tiet}
            on_chon_danh_muc={(id) => dieu_huong_cua_hang({ danh_muc_id: id })}
            on_them_vao_gio={them_vao_gio}
          />
        )}

        {trang_hien_tai === 'cua_hang' && (
          <TrangCuaHang
            bo_loc_khoi_tao={bo_loc_cua_hang}
            on_chon_san_pham={xem_chi_tiet}
            on_them_vao_gio={them_vao_gio}
          />
        )}

        {trang_hien_tai === 'chi_tiet' && (
          <TrangChiTietSanPham
            san_pham_id={san_pham_dang_xem_id}
            on_quay_lai={() => set_trang_hien_tai('cua_hang')}
            on_them_vao_gio={them_vao_gio}
          />
        )}

        {trang_hien_tai === 'gio_hang' && (
          <TrangGioHang
            gio_hang={gio_hang}
            nguoi_dung={nguoi_dung}
            on_thay_doi_so_luong={thay_doi_so_luong}
            on_xoa_san_pham={xoa_khoi_gio}
            on_xoa_toan_bo={xoa_toan_bo_gio}
            on_tiep_tuc_mua_sam={() => dieu_huong_cua_hang({})}
          />
        )}

        {trang_hien_tai === 'profile' && (
          <Profile
            nguoi_dung={nguoi_dung}
            on_dang_xuat={xu_ly_dang_xuat}
            on_cap_nhat_nguoi_dung={xu_ly_cap_nhat_nguoi_dung}
            on_mo_dang_nhap={() => set_hien_modal_auth(true)}
            on_chuyen_trang={(trang) => {
              set_trang_hien_tai(trang);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {trang_hien_tai === 'admin' && (
          <AdminDashboard
            on_ve_trang_chu={() => {
              set_trang_hien_tai('trang_chu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* CÁC TRANG CHÍNH SÁCH & HỖ TRỢ DOANH NGHIỆP */}
        {trang_hien_tai === 'doi_tra' && (
          <ChinhSachDoiTra
            on_quay_lai_trang_chu={() => { set_trang_hien_tai('trang_chu'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            on_kham_pha_san_pham={() => dieu_huong_cua_hang({})}
          />
        )}

        {trang_hien_tai === 'giao_hang' && (
          <ChinhSachGiaoHang
            on_quay_lai_trang_chu={() => { set_trang_hien_tai('trang_chu'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            on_kham_pha_san_pham={() => dieu_huong_cua_hang({})}
          />
        )}

        {trang_hien_tai === 'doanh_nghiep' && (
          <MuaHangDoanhNghiep
            on_quay_lai_trang_chu={() => { set_trang_hien_tai('trang_chu'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            on_kham_pha_san_pham={() => dieu_huong_cua_hang({})}
          />
        )}

        {trang_hien_tai === 'bao_hanh' && (
          <BaoHanhChungTu
            on_quay_lai_trang_chu={() => { set_trang_hien_tai('trang_chu'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            on_kham_pha_san_pham={() => dieu_huong_cua_hang({})}
          />
        )}
      </main>

      {/* 4. Modal Dang Nhap / Dang Ky */}
      {hien_modal_auth && (
        <DangNhapDangKy
          on_dang_nhap_thanh_cong={xu_ly_dang_nhap_thanh_cong}
          on_dong={() => set_hien_modal_auth(false)}
        />
      )}

      {/* 5. Toast Thong bao them vao gio hang thanh cong */}
      {thong_bao_gio_hang && (
        <div className="cart-toast-notification" data-testid="thong-bao-them-gio">
          <div className="cart-toast-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <img
            src={thong_bao_gio_hang.san_pham.anh_chinh || '/images/products/product-1.jpg'}
            alt={thong_bao_gio_hang.san_pham.ten_san_pham}
            className="cart-toast-thumb"
            onError={(e) => { e.target.src = '/images/products/product-1.jpg'; }}
          />
          <div className="cart-toast-content">
            <div className="cart-toast-title">Đã thêm vào giỏ hàng</div>
            <div className="cart-toast-name">{thong_bao_gio_hang.san_pham.ten_san_pham}</div>
            <div className="cart-toast-meta">
              <span>Số lượng: +{thong_bao_gio_hang.so_luong}</span>
              <span style={{ color: 'var(--color-price)', fontWeight: '700' }}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(thong_bao_gio_hang.san_pham.gia)}
              </span>
            </div>
          </div>
          <div className="cart-toast-actions">
            <button
              type="button"
              className="cart-toast-btn-view"
              onClick={() => {
                set_trang_hien_tai('gio_hang');
                set_thong_bao_gio_hang(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Xem giỏ hàng
            </button>
            <button
              type="button"
              className="cart-toast-btn-close"
              onClick={() => set_thong_bao_gio_hang(null)}
              title="Đóng thông báo"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 6. Trợ lý AI SmartDesk (Bóng Chat & AI Shopping Assistant) */}
      <BongChatAI
        onXemChiTietSanPham={xem_chi_tiet}
        onThemVaoGio={(sp, sl) => them_vao_gio({ san_pham: sp, so_luong: sl || 1 })}
        onChuyenTrang={(trang) => {
          set_trang_hien_tai(trang);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        an_khi_o_admin={trang_hien_tai === 'admin'}
        nguoi_dung={nguoi_dung}
      />

      {/* 7. Modal Danh sách yêu thích (Wishlist) */}
      {hien_modal_wishlist && (
        <ModalWishlist
          mo={true}
          danh_sach={danh_sach_wishlist}
          onDong={() => set_hien_modal_wishlist(false)}
          onThemVaoGio={(arg) => {
            const sp = arg?.san_pham ? arg.san_pham : arg;
            const sl = arg?.so_luong ? arg.so_luong : 1;
            them_vao_gio({ san_pham: sp, so_luong: sl });
          }}
          onXemChiTiet={xem_chi_tiet}
          onXoaKhoiWishlist={(spId) => {
            const moi = danh_sach_wishlist.filter(x => (typeof x === 'object' ? x.id !== spId : x !== spId));
            set_danh_sach_wishlist(moi);
            localStorage.setItem('smartdesk_wishlist', JSON.stringify(moi));
            window.dispatchEvent(new CustomEvent('smartdesk_wishlist_updated', { detail: moi }));
          }}
          onXoaTatCa={() => {
            set_danh_sach_wishlist([]);
            localStorage.removeItem('smartdesk_wishlist');
            window.dispatchEvent(new CustomEvent('smartdesk_wishlist_updated', { detail: [] }));
          }}
          onKhamPha={() => {
            set_hien_modal_wishlist(false);
            dieu_huong_cua_hang({});
          }}
        />
      )}

      {/* 8. Thanh So Sánh Nổi (Floating Bar) */}
      <ThanhSoSanhNoi
        danh_sach_so_sanh={danh_sach_so_sanh}
        onMoModalSoSanh={() => set_hien_modal_so_sanh(true)}
        onXoaKhoiSoSanh={(spId) => {
          const moi = danh_sach_so_sanh.filter(x => x.id !== spId);
          set_danh_sach_so_sanh(moi);
          localStorage.setItem('smartdesk_compare', JSON.stringify(moi));
          window.dispatchEvent(new Event('smartdesk_compare_updated'));
        }}
        onXoaTatCa={() => {
          set_danh_sach_so_sanh([]);
          localStorage.removeItem('smartdesk_compare');
          window.dispatchEvent(new Event('smartdesk_compare_updated'));
        }}
      />

      {/* 9. Modal Bảng So Sánh Chi Tiết (Product Comparison Matrix) */}
      {hien_modal_so_sanh && (
        <ModalSoSanh
          danh_sach_so_sanh={danh_sach_so_sanh}
          onThemVaoGio={(sp, sl) => {
            const target = sp?.san_pham || sp;
            const qty = sp?.so_luong || sl || 1;
            them_vao_gio({ san_pham: target, so_luong: qty });
          }}
          onXemChiTiet={xem_chi_tiet}
          onXoaKhoiSoSanh={(spId) => {
            const moi = danh_sach_so_sanh.filter(x => x.id !== spId);
            set_danh_sach_so_sanh(moi);
            localStorage.setItem('smartdesk_compare', JSON.stringify(moi));
            window.dispatchEvent(new Event('smartdesk_compare_updated'));
          }}
        />
      )}

      {/* 7. High-End E-Commerce Footer */}
      <footer className="footer-wrapper">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="brand-logo" style={{ marginBottom: '16px' }}>
                <div className="brand-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </div>
                <div className="brand-title">Smart<span>Desk</span></div>
              </div>
              <p style={{ marginBottom: '14px' }}>
                Hệ sinh thái văn phòng phẩm và giải pháp đồ dùng học tập trực tuyến hàng đầu. Cung cấp văn phòng phẩm chính hãng, xuất hóa đơn VAT trong ngày cho hơn 10.000 doanh nghiệp.
              </p>
              <p>📍 Tầng 5, Tòa nhà Văn phòng SmartDesk, Hà Nội</p>
            </div>

            <div className="footer-col">
              <h4>Khám phá</h4>
              <ul className="footer-links">
                <li><button type="button" onClick={() => { set_trang_hien_tai('trang_chu'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Trang chủ</button></li>
                <li><button type="button" onClick={() => dieu_huong_cua_hang({})}>Tất cả sản phẩm</button></li>
                <li><button type="button" onClick={() => dieu_huong_cua_hang({ noi_bat: 1 })}>Sản phẩm nổi bật</button></li>
                <li><button type="button" onClick={() => dieu_huong_cua_hang({ sap_xep: 'ban_chay' })}>Sản phẩm bán chạy</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Hỗ trợ khách hàng</h4>
              <ul className="footer-links">
                <li><button type="button" onClick={() => { set_trang_hien_tai('doi_tra'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Chính sách đổi trả</button></li>
                <li><button type="button" onClick={() => { set_trang_hien_tai('giao_hang'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Chính sách giao hàng</button></li>
                <li><button type="button" onClick={() => { set_trang_hien_tai('doanh_nghiep'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Mua hàng doanh nghiệp (B2B)</button></li>
                <li><button type="button" onClick={() => { set_trang_hien_tai('bao_hanh'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Bảo hành & Chứng từ CO/CQ</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Tổng đài hỗ trợ</h4>
              <p style={{ fontWeight: '800', fontSize: '20px', color: '#60a5fa', marginBottom: '4px' }}>
                1900 1234
              </p>
              <p style={{ fontSize: '12.5px', marginBottom: '16px' }}>Tất cả các ngày trong tuần (8:00 - 21:00)</p>
              <h4 style={{ marginBottom: '10px' }}>Phương thức thanh toán</h4>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="payment-badge">VietQR ACB</span>
                <span className="payment-badge">Thẻ ATM</span>
                <span className="payment-badge">Visa/Master</span>
                <span className="payment-badge">COD</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            © 2026 SmartDesk. Hệ sinh thái thương mại điện tử văn phòng phẩm (TV1 — Sản phẩm & Mua sắm).
          </div>
        </div>
      </footer>
    </div>
  );
}