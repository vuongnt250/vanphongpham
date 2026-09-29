import React, { useState, useEffect } from 'react';
import api_client from '../../dich_vu_api';

export default function Profile({
  nguoi_dung,
  on_dang_xuat,
  on_cap_nhat_nguoi_dung,
  on_mo_dang_nhap,
  on_chuyen_trang
}) {
  const [tab_hien_tai, set_tab_hien_tai] = useState('thong_tin'); // 'thong_tin' | 'don_hang' | 'dia_chi'
  
  // State thong tin nguoi dung
  const [ho_ten, set_ho_ten] = useState(nguoi_dung ? (nguoi_dung.ho_ten || nguoi_dung.name || '') : '');
  const [email, set_email] = useState(nguoi_dung ? nguoi_dung.email : '');
  const [so_dien_thoai, set_so_dien_thoai] = useState(nguoi_dung ? (nguoi_dung.so_dien_thoai || nguoi_dung.sdt || '') : '');
  const [thong_bao, set_thong_bao] = useState('');
  const [thong_bao_loi, set_thong_bao_loi] = useState('');

  // State doi mat khau
  const [mk_cu, set_mk_cu] = useState('');
  const [mk_moi, set_mk_moi] = useState('');
  const [mk_xac_nhan, set_mk_xac_nhan] = useState('');
  const [dang_doi_mk, set_dang_doi_mk] = useState(false);

  // State Don hang thuc tu API
  const [danh_sach_don_hang, set_danh_sach_don_hang] = useState([]);
  const [dang_tai_don, set_dang_tai_don] = useState(false);

  // State So dia chi thuc tu API
  const [danh_sach_dia_chi, set_danh_sach_dia_chi] = useState([]);
  const [dang_tai_dia_chi, set_dang_tai_dia_chi] = useState(false);
  const [hien_form_dia_chi, set_hien_form_dia_chi] = useState(false);
  const [dc_ten, set_dc_ten] = useState('');
  const [dc_sdt, set_dc_sdt] = useState('');
  const [dc_chi_tiet, set_dc_chi_tiet] = useState('');

  // Dong bo khi nguoi_dung thay doi
  useEffect(() => {
    if (nguoi_dung) {
      set_ho_ten(nguoi_dung.ho_ten || nguoi_dung.name || '');
      set_email(nguoi_dung.email || '');
      set_so_dien_thoai(nguoi_dung.so_dien_thoai || nguoi_dung.sdt || '');
      tai_don_hang();
      tai_dia_chi();
    }
  }, [nguoi_dung]);

  const tai_don_hang = async () => {
    if (!nguoi_dung) return;
    set_dang_tai_don(true);
    try {
      const res = await api_client.lay_don_hang_cua_toi();
      if (res.success) {
        set_danh_sach_don_hang(res.du_lieu || []);
      }
    } catch (e) {
      console.error('Loi tai don hang:', e);
    } finally {
      set_dang_tai_don(false);
    }
  };

  const tai_dia_chi = async () => {
    if (!nguoi_dung) return;
    set_dang_tai_dia_chi(true);
    try {
      const res = await api_client.lay_dia_chi();
      if (res.success) {
        set_danh_sach_dia_chi(res.du_lieu || []);
      }
    } catch (e) {
      console.error('Loi tai dia chi:', e);
    } finally {
      set_dang_tai_dia_chi(false);
    }
  };

  if (!nguoi_dung) {
    return (
      <div className="container" style={{ padding: '60px 16px 80px 16px', maxWidth: '600px', textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '40px 24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
            Vui lòng đăng nhập
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: '1.5' }}>
            Bạn cần đăng nhập vào hệ thống SmartDesk để xem hồ sơ cá nhân, lịch sử đơn hàng và sổ địa chỉ.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              type="button"
              className="hero-cta-btn"
              onClick={on_mo_dang_nhap}
              style={{ padding: '12px 28px', fontSize: '15px' }}
            >
              🔑 Đăng nhập / Đăng ký ngay
            </button>
            <button
              type="button"
              className="hero-secondary-btn"
              onClick={() => on_chuyen_trang && on_chuyen_trang('trang_chu')}
              style={{ padding: '12px 20px', fontSize: '15px' }}
            >
              Về Trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  const la_admin = nguoi_dung.vai_tro === 'admin' || nguoi_dung.role === 'admin';

  const dinh_dang_tien = (so_tien) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(so_tien || 0);
  };

  const xu_ly_luu_thong_tin = async (e) => {
    e.preventDefault();
    set_thong_bao('');
    set_thong_bao_loi('');

    try {
      const res = await api_client.cap_nhat_profile({ ho_ten, so_dien_thoai });
      if (res.success) {
        if (on_cap_nhat_nguoi_dung) {
          on_cap_nhat_nguoi_dung(res.du_lieu);
        }
        set_thong_bao('Cập nhật thông tin tài khoản thành công!');
        setTimeout(() => set_thong_bao(''), 3000);
      }
    } catch (err) {
      set_thong_bao_loi(err.message || 'Lỗi khi cập nhật thông tin.');
    }
  };

  const xu_ly_doi_mat_khau = async (e) => {
    e.preventDefault();
    if (mk_moi !== mk_xac_nhan) {
      alert('Mật khẩu mới và xác nhận mật khẩu không trùng khớp.');
      return;
    }
    set_dang_doi_mk(true);
    try {
      const res = await api_client.doi_mat_khau(mk_cu, mk_moi);
      if (res.success) {
        alert('Đổi mật khẩu thành công! Tài khoản của bạn đã được cập nhật.');
        set_mk_cu('');
        set_mk_moi('');
        set_mk_xac_nhan('');
        if (on_cap_nhat_nguoi_dung) {
          on_cap_nhat_nguoi_dung({ ...nguoi_dung, yeu_cau_doi_mat_khau: false });
        }
      }
    } catch (err) {
      alert(err.message || 'Không thể đổi mật khẩu.');
    } finally {
      set_dang_doi_mk(false);
    }
  };

  const xu_ly_them_dia_chi = async (e) => {
    e.preventDefault();
    if (!dc_ten || !dc_sdt || !dc_chi_tiet) {
      alert('Vui lòng điền đầy đủ thông tin địa chỉ.');
      return;
    }
    try {
      const res = await api_client.them_dia_chi({
        ten_nguoi_nhan: dc_ten,
        so_dien_thoai: dc_sdt,
        dia_chi_chi_tiet: dc_chi_tiet,
        la_mac_dinh: danh_sach_dia_chi.length === 0 ? 1 : 0
      });
      if (res.success) {
        set_hien_form_dia_chi(false);
        set_dc_ten('');
        set_dc_sdt('');
        set_dc_chi_tiet('');
        tai_dia_chi();
      }
    } catch (err) {
      alert(err.message || 'Không thể thêm địa chỉ.');
    }
  };

  const xu_ly_xoa_dia_chi = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    try {
      await api_client.xoa_dia_chi(id);
      tai_dia_chi();
    } catch (err) {
      alert(err.message || 'Không thể xóa địa chỉ.');
    }
  };

  const xu_ly_huy_don = async (don_hang_id) => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này không? Số lượng sản phẩm sẽ được hoàn lại kho.')) return;
    try {
      const res = await api_client.huy_don_hang(don_hang_id);
      if (res.success) {
        alert('Đã hủy đơn hàng thành công.');
        tai_don_hang();
      }
    } catch (err) {
      alert(err.message || 'Không thể hủy đơn hàng.');
    }
  };

  const lay_mau_trang_thai = (stt) => {
    switch (stt) {
      case 'DELIVERED': return '#10b981';
      case 'SHIPPING': return '#3b82f6';
      case 'PROCESSING': return '#8b5cf6';
      case 'CONFIRMED': return '#06b6d4';
      case 'CANCELLED': return '#ef4444';
      default: return '#f59e0b'; // PENDING
    }
  };

  const lay_ten_trang_thai = (stt) => {
    switch (stt) {
      case 'DELIVERED': return 'Đã giao thành công';
      case 'SHIPPING': return 'Đang giao hàng';
      case 'PROCESSING': return 'Đang đóng gói';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'CANCELLED': return 'Đã hủy đơn';
      default: return 'Chờ xác nhận';
    }
  };

  return (
    <div className="container" style={{ padding: '24px 16px 60px 16px', maxWidth: '1100px' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => on_chuyen_trang && on_chuyen_trang('trang_chu')}>Trang chủ</span> / <span style={{ color: '#0f172a', fontWeight: '600' }}>Hồ sơ cá nhân</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'flex-start' }}>
        {/* Sidebar Profile */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '24px 18px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          {/* Avatar & Ten */}
          <div style={{ textAlign: 'center', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '9999px',
              backgroundColor: la_admin ? '#fef3c7' : '#eff6ff',
              color: la_admin ? '#d97706' : '#2563eb',
              fontSize: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              border: la_admin ? '2px solid #fcd34d' : '2px solid #bfdbfe'
            }}>
              {la_admin ? '👑' : '👨‍💼'}
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>{ho_ten || nguoi_dung.tai_khoan}</h3>
            <span style={{
              fontSize: '12px',
              color: la_admin ? '#b45309' : '#2563eb',
              backgroundColor: la_admin ? '#fef3c7' : '#eff6ff',
              padding: '3px 10px',
              borderRadius: '9999px',
              fontWeight: '700'
            }}>
              {la_admin ? '⭐ Quản trị viên (Admin)' : '⭐ Thành viên SmartDesk'}
            </span>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
              Tài khoản: <strong>{nguoi_dung.ten_dang_nhap || nguoi_dung.tai_khoan}</strong>
            </div>
          </div>

          {/* Menu dieu huong Profile */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {la_admin && (
              <button
                type="button"
                onClick={() => on_chuyen_trang && on_chuyen_trang('admin')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid #f59e0b',
                  backgroundColor: '#fffbeb',
                  color: '#b45309',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}
              >
                <span>⚙️</span> Trang Quản Trị Admin
              </button>
            )}

            <button
              type="button"
              onClick={() => set_tab_hien_tai('thong_tin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: tab_hien_tai === 'thong_tin' ? '#eff6ff' : 'transparent',
                color: tab_hien_tai === 'thong_tin' ? '#2563eb' : '#475569',
                fontWeight: tab_hien_tai === 'thong_tin' ? '700' : '500',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px'
              }}
            >
              <span>👤</span> Thông tin tài khoản
            </button>

            <button
              type="button"
              onClick={() => set_tab_hien_tai('don_hang')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: tab_hien_tai === 'don_hang' ? '#eff6ff' : 'transparent',
                color: tab_hien_tai === 'don_hang' ? '#2563eb' : '#475569',
                fontWeight: tab_hien_tai === 'don_hang' ? '700' : '500',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px'
              }}
            >
              <span>📦</span> Lịch sử đơn hàng ({danh_sach_don_hang.length})
            </button>

            <button
              type="button"
              onClick={() => set_tab_hien_tai('dia_chi')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: tab_hien_tai === 'dia_chi' ? '#eff6ff' : 'transparent',
                color: tab_hien_tai === 'dia_chi' ? '#2563eb' : '#475569',
                fontWeight: tab_hien_tai === 'dia_chi' ? '700' : '500',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px'
              }}
            >
              <span>📍</span> Sổ địa chỉ ({danh_sach_dia_chi.length})
            </button>

            {/* Nut Dang Xuat */}
            <button
              type="button"
              onClick={on_dang_xuat}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#fff1f2',
                color: '#e11d48',
                fontWeight: '700',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                marginTop: '12px'
              }}
            >
              <span>🚪</span> Đăng xuất
            </button>
          </nav>
        </div>

        {/* Noi dung Tab */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '28px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          {/* TAB 1: THONG TIN TAI KHOAN */}
          {tab_hien_tai === 'thong_tin' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                Thông tin hồ sơ cá nhân
              </h2>

              {thong_bao && (
                <div style={{ padding: '12px 16px', backgroundColor: '#ecfdf5', color: '#047857', borderRadius: '8px', marginBottom: '18px', fontSize: '14px', border: '1px solid #a7f3d0' }}>
                  ✓ {thong_bao}
                </div>
              )}
              {thong_bao_loi && (
                <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '8px', marginBottom: '18px', fontSize: '14px', border: '1px solid #fecaca' }}>
                  ✕ {thong_bao_loi}
                </div>
              )}

              <form onSubmit={xu_ly_luu_thong_tin} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Họ và tên</label>
                  <input
                    type="text"
                    value={ho_ten}
                    onChange={(e) => set_ho_ten(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Số điện thoại</label>
                  <input
                    type="text"
                    value={so_dien_thoai}
                    onChange={(e) => set_so_dien_thoai(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Email (không thể thay đổi)</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', fontSize: '14px' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                  <button type="submit" className="hero-cta-btn" style={{ padding: '10px 24px', fontSize: '14px' }}>
                    💾 Lưu cập nhật
                  </button>
                </div>
              </form>

              {/* Form Doi mat khau */}
              <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
                {Boolean(nguoi_dung?.yeu_cau_doi_mat_khau) && (
                  <div style={{ padding: '12px 16px', backgroundColor: '#fff1f2', color: '#9f1239', borderRadius: '8px', marginBottom: '16px', fontSize: '13.5px', border: '1px solid #fecdd3' }}>
                    🚨 <strong>Yêu cầu bảo mật cấp thiết:</strong> Tài khoản này hiện đang sử dụng mật khẩu khởi tạo mặc định. Bạn bắt buộc phải đổi sang mật khẩu riêng tư mới bên dưới!
                  </div>
                )}
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>
                  Đổi mật khẩu tài khoản
                </h3>
                <form onSubmit={xu_ly_doi_mat_khau} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', alignItems: 'flex-end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      value={mk_cu}
                      onChange={(e) => set_mk_cu(e.target.value)}
                      required
                      placeholder="••••••"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Mật khẩu mới</label>
                    <input
                      type="password"
                      value={mk_moi}
                      onChange={(e) => set_mk_moi(e.target.value)}
                      required
                      placeholder="Ít nhất 6 ký tự"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      value={mk_xac_nhan}
                      onChange={(e) => set_mk_xac_nhan(e.target.value)}
                      required
                      placeholder="••••••"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1', marginTop: '6px' }}>
                    <button type="submit" disabled={dang_doi_mk} className="hero-secondary-btn" style={{ padding: '8px 18px', fontSize: '13px' }}>
                      {dang_doi_mk ? 'Đang xử lý...' : '🔑 Cập nhật mật khẩu'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: LICH SU DON HANG THUC */}
          {tab_hien_tai === 'don_hang' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Lịch sử đơn hàng của bạn
                </h2>
                <button type="button" onClick={tai_don_hang} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                  🔄 Tải lại
                </button>
              </div>

              {dang_tai_don ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>Đang tải danh sách đơn hàng...</div>
              ) : danh_sach_don_hang.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
                  <p style={{ color: '#64748b', fontSize: '15px' }}>Bạn chưa có đơn hàng nào tại SmartDesk.</p>
                  <button type="button" className="hero-cta-btn" onClick={() => on_chuyen_trang && on_chuyen_trang('cua_hang')} style={{ marginTop: '14px', padding: '10px 20px', fontSize: '14px' }}>
                    Khám phá cửa hàng ngay
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {danh_sach_don_hang.map(dh => (
                    <div key={dh.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', backgroundColor: '#f8fafc' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0' }}>
                        <div>
                          <strong style={{ fontSize: '15px', color: '#1e293b' }}>{dh.ma_don_hang}</strong>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                            Đặt ngày: {new Date(dh.ngay_tao).toLocaleString('vi-VN')}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#ffffff',
                            backgroundColor: lay_mau_trang_thai(dh.trang_thai)
                          }}>
                            {lay_ten_trang_thai(dh.trang_thai)}
                          </span>
                        </div>
                      </div>

                      {/* Danh sach san pham trong don */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                        {(dh.danh_sach_san_pham || []).map(sp => (
                          <div key={sp.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#334155' }}>
                            <span>{sp.ten_san_pham} <strong>× {sp.so_luong}</strong></span>
                            <span style={{ fontWeight: '600' }}>{dinh_dang_tien(sp.thanh_tien)}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                          Thanh toán: <strong style={{ color: '#1e293b' }}>{dh.phuong_thuc_thanh_toan}</strong> ({dh.trang_thai_thanh_toan === 'da_thanh_toan' ? 'Đã thanh toán' : 'Chưa thanh toán'})
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <div style={{ fontSize: '15px', fontWeight: '800', color: '#ef4444' }}>
                            Tổng: {dinh_dang_tien(dh.tong_thanh_toan)}
                          </div>
                          {dh.trang_thai === 'PENDING' && (
                            <button
                              type="button"
                              onClick={() => xu_ly_huy_don(dh.id)}
                              style={{
                                padding: '5px 12px',
                                backgroundColor: '#fee2e2',
                                color: '#b91c1c',
                                border: '1px solid #fca5a5',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              Hủy đơn
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SO DIA CHI NHAN HANG THUC */}
          {tab_hien_tai === 'dia_chi' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Sổ địa chỉ nhận hàng
                </h2>
                <button
                  type="button"
                  className="hero-cta-btn"
                  onClick={() => set_hien_form_dia_chi(!hien_form_dia_chi)}
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  {hien_form_dia_chi ? '✕ Đóng' : '+ Thêm địa chỉ mới'}
                </button>
              </div>

              {hien_form_dia_chi && (
                <form onSubmit={xu_ly_them_dia_chi} style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700' }}>Thêm địa chỉ giao hàng mới</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      placeholder="Tên người nhận"
                      value={dc_ten}
                      onChange={(e) => set_dc_ten(e.target.value)}
                      required
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                    <input
                      type="text"
                      placeholder="Số điện thoại"
                      value={dc_sdt}
                      onChange={(e) => set_dc_sdt(e.target.value)}
                      required
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Địa chỉ chi tiết (Số nhà, đường, phường, quận/huyện, tỉnh/thành)"
                    value={dc_chi_tiet}
                    onChange={(e) => set_dc_chi_tiet(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', marginBottom: '12px' }}
                  />
                  <button type="submit" className="hero-cta-btn" style={{ padding: '8px 18px', fontSize: '13px' }}>
                    Thêm địa chỉ
                  </button>
                </form>
              )}

              {dang_tai_dia_chi ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>Đang tải sổ địa chỉ...</div>
              ) : danh_sach_dia_chi.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>Bạn chưa lưu địa chỉ nào. Nhấn "+ Thêm địa chỉ mới" ở trên để tạo.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {danh_sach_dia_chi.map(dc => (
                    <div key={dc.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <strong style={{ fontSize: '14.5px', color: '#0f172a' }}>{dc.ten_nguoi_nhan}</strong>
                          <span style={{ fontSize: '13px', color: '#64748b' }}>({dc.so_dien_thoai})</span>
                          {dc.la_mac_dinh === 1 && (
                            <span style={{ fontSize: '11px', backgroundColor: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '9999px', fontWeight: '700' }}>
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p style={{ margin: '6px 0 0 0', fontSize: '13.5px', color: '#475569' }}>
                          📍 {dc.dia_chi_chi_tiet}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => xu_ly_xoa_dia_chi(dc.id)}
                        style={{ padding: '6px 12px', background: 'none', border: '1px solid #fee2e2', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}