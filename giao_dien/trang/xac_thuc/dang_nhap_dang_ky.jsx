import React, { useState } from 'react';
import api_client from '../../dich_vu_api';

export default function DangNhapDangKy({
  on_dang_nhap_thanh_cong,
  on_dong,
  che_do_khoi_tao = 'dang_nhap'
}) {
  const [tab, set_tab] = useState(che_do_khoi_tao); // 'dang_nhap' | 'dang_ky'

  // Form dang nhap
  const [dn_tai_khoan, set_dn_tai_khoan] = useState('');
  const [dn_mat_khau, set_dn_mat_khau] = useState('');

  // Form dang ky
  const [dk_ho_ten, set_dk_ho_ten] = useState('');
  const [dk_tai_khoan, set_dk_tai_khoan] = useState('');
  const [dk_email, set_dk_email] = useState('');
  const [dk_sdt, set_dk_sdt] = useState('');
  const [dk_mat_khau, set_dk_mat_khau] = useState('');
  const [dk_xac_nhan_mk, set_dk_xac_nhan_mk] = useState('');

  const [dang_xu_ly, set_dang_xu_ly] = useState(false);
  const [thong_bao_loi, set_thong_bao_loi] = useState('');
  const [thong_bao_thanh_cong, set_thong_bao_thanh_cong] = useState('');

  // Xu ly dang nhap truc tiep voi Backend API & JWT Token
  const xu_ly_dang_nhap = async (e) => {
    e.preventDefault();
    set_thong_bao_loi('');

    const tk = dn_tai_khoan.trim();
    const mk = dn_mat_khau;

    if (!tk || !mk) {
      set_thong_bao_loi('Vui lòng nhập tên đăng nhập và mật khẩu.');
      return;
    }

    set_dang_xu_ly(true);

    try {
      const res = await api_client.dang_nhap(tk, mk);
      if (res.success && res.du_lieu) {
        const { user, token } = res.du_lieu;
        localStorage.setItem('smartdesk_token', token);
        localStorage.setItem('smartdesk_current_user', JSON.stringify(user));

        set_thong_bao_thanh_cong(`Đăng nhập thành công! Chào mừng ${user.ho_ten || user.ten_dang_nhap}.`);
        setTimeout(() => {
          if (on_dang_nhap_thanh_cong) on_dang_nhap_thanh_cong(user);
        }, 400);
      } else {
        set_thong_bao_loi(res.message || 'Đăng nhập không thành công.');
      }
    } catch (err) {
      set_thong_bao_loi(err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
    } finally {
      set_dang_xu_ly(false);
    }
  };

  // Xu ly dang ky truc tiep voi Backend API & SQLite Database
  const xu_ly_dang_ky = async (e) => {
    e.preventDefault();
    set_thong_bao_loi('');

    if (!dk_ho_ten.trim() || !dk_tai_khoan.trim() || !dk_email.trim() || !dk_mat_khau) {
      set_thong_bao_loi('Vui lòng điền đầy đủ tất cả các trường bắt buộc.');
      return;
    }

    if (dk_mat_khau !== dk_xac_nhan_mk) {
      set_thong_bao_loi('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    if (dk_mat_khau.length < 6) {
      set_thong_bao_loi('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    set_dang_xu_ly(true);

    try {
      const res = await api_client.dang_ky({
        ten_dang_nhap: dk_tai_khoan.trim(),
        email: dk_email.trim(),
        mat_khau: dk_mat_khau,
        ho_ten: dk_ho_ten.trim(),
        so_dien_thoai: dk_sdt.trim()
      });

      if (res.success && res.du_lieu) {
        const { user, token } = res.du_lieu;
        localStorage.setItem('smartdesk_token', token);
        localStorage.setItem('smartdesk_current_user', JSON.stringify(user));

        set_thong_bao_thanh_cong('Đăng ký tài khoản thành công! Đang tự động đăng nhập...');
        setTimeout(() => {
          if (on_dang_nhap_thanh_cong) on_dang_nhap_thanh_cong(user);
        }, 600);
      } else {
        set_thong_bao_loi(res.message || 'Đăng ký không thành công.');
      }
    } catch (err) {
      set_thong_bao_loi(err.message || 'Có lỗi xảy ra khi tạo tài khoản.');
    } finally {
      set_dang_xu_ly(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Nut Dong Modal */}
        {on_dong && (
          <button
            type="button"
            onClick={on_dong}
            style={{
              position: 'absolute',
              right: '16px',
              top: '16px',
              border: 'none',
              background: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#94a3b8',
              zIndex: 10
            }}
          >
            ✕
          </button>
        )}

        {/* Header Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <button
            type="button"
            onClick={() => { set_tab('dang_nhap'); set_thong_bao_loi(''); set_thong_bao_thanh_cong(''); }}
            style={{
              flex: 1,
              padding: '16px 0',
              border: 'none',
              background: 'none',
              fontSize: '15px',
              fontWeight: '700',
              color: tab === 'dang_nhap' ? '#2563eb' : '#64748b',
              borderBottom: tab === 'dang_nhap' ? '3px solid #2563eb' : '3px solid transparent',
              cursor: 'pointer'
            }}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => { set_tab('dang_ky'); set_thong_bao_loi(''); set_thong_bao_thanh_cong(''); }}
            style={{
              flex: 1,
              padding: '16px 0',
              border: 'none',
              background: 'none',
              fontSize: '15px',
              fontWeight: '700',
              color: tab === 'dang_ky' ? '#2563eb' : '#64748b',
              borderBottom: tab === 'dang_ky' ? '3px solid #2563eb' : '3px solid transparent',
              cursor: 'pointer'
            }}
          >
            Đăng ký
          </button>
        </div>

        {/* Main Body */}
        <div style={{ padding: '28px 24px' }}>
          {/* Thong bao loi */}
          {thong_bao_loi && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              ⚠️ {thong_bao_loi}
            </div>
          )}

          {/* Thong bao thanh cong */}
          {thong_bao_thanh_cong && (
            <div style={{
              backgroundColor: '#ecfdf5',
              color: '#065f46',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              ✓ {thong_bao_thanh_cong}
            </div>
          )}

          {/* 1. FORM ĐĂNG NHẬP */}
          {tab === 'dang_nhap' && (
            <form onSubmit={xu_ly_dang_nhap} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Tên đăng nhập hoặc Email
                </label>
                <input
                  type="text"
                  value={dn_tai_khoan}
                  onChange={(e) => set_dn_tai_khoan(e.target.value)}
                  placeholder="Nhập tên đăng nhập hoặc email..."
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={dn_mat_khau}
                  onChange={(e) => set_dn_mat_khau(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={dang_xu_ly}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: dang_xu_ly ? 'not-allowed' : 'pointer',
                  marginTop: '6px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                }}
              >
                {dang_xu_ly ? 'Đang xác thực bảo mật...' : 'Đăng nhập ngay'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => { set_tab('dang_ky'); set_thong_bao_loi(''); }}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '700', cursor: 'pointer' }}
                >
                  Đăng ký tài khoản mới
                </button>
              </div>
            </form>
          )}

          {/* 2. FORM ĐĂNG KÝ */}
          {tab === 'dang_ky' && (
            <form onSubmit={xu_ly_dang_ky} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Họ và tên *
                </label>
                <input
                  type="text"
                  value={dk_ho_ten}
                  onChange={(e) => set_dk_ho_ten(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Tên đăng nhập *
                  </label>
                  <input
                    type="text"
                    value={dk_tai_khoan}
                    onChange={(e) => set_dk_tai_khoan(e.target.value)}
                    placeholder="nguyenan98"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={dk_sdt}
                    onChange={(e) => set_dk_sdt(e.target.value)}
                    placeholder="0987 654 321"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Địa chỉ Email *
                </label>
                <input
                  type="email"
                  value={dk_email}
                  onChange={(e) => set_dk_email(e.target.value)}
                  placeholder="nguyenan@example.com"
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    value={dk_mat_khau}
                    onChange={(e) => set_dk_mat_khau(e.target.value)}
                    placeholder="Ít nhất 6 ký tự"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Xác nhận mật khẩu *
                  </label>
                  <input
                    type="password"
                    value={dk_xac_nhan_mk}
                    onChange={(e) => set_dk_xac_nhan_mk(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={dang_xu_ly}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: dang_xu_ly ? 'not-allowed' : 'pointer',
                  marginTop: '8px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                }}
              >
                {dang_xu_ly ? 'Đang tạo tài khoản bảo mật...' : 'Tạo tài khoản mới'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => { set_tab('dang_nhap'); set_thong_bao_loi(''); }}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '700', cursor: 'pointer' }}
                >
                  Đăng nhập tại đây
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}