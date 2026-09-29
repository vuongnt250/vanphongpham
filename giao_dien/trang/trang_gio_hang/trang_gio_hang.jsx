import React, { useState, useEffect } from 'react';
import api_client from '../../dich_vu_api';

export default function TrangGioHang({
  gio_hang = [],
  nguoi_dung = null,
  on_thay_doi_so_luong,
  on_xoa_san_pham,
  on_xoa_toan_bo,
  on_tiep_tuc_mua_sam
}) {
  const [ho_ten, set_ho_ten] = useState(nguoi_dung ? (nguoi_dung.ho_ten || nguoi_dung.name || '') : '');
  const [so_dien_thoai, set_so_dien_thoai] = useState(nguoi_dung ? (nguoi_dung.so_dien_thoai || nguoi_dung.sdt || '') : '');
  const [dia_chi, set_dia_chi] = useState('');
  const [ghi_chu, set_ghi_chu] = useState('');
  const [phuong_thuc, set_phuong_thuc] = useState('chuyen_khoan'); // 'chuyen_khoan' | 'cod' | 'the'

  // Voucher
  const [ma_voucher_input, set_ma_voucher_input] = useState('');
  const [voucher_da_ap_dung, set_voucher_da_ap_dung] = useState(null);
  const [loi_voucher, set_loi_voucher] = useState('');

  const [dang_xu_ly, set_dang_xu_ly] = useState(false);
  const [don_hang_thanh_cong, set_don_hang_thanh_cong] = useState(null);
  const [da_sao_chep, set_da_sao_chep] = useState('');

  // Tự động điền địa chỉ mặc định từ Database nếu người dùng đã đăng nhập
  useEffect(() => {
    if (nguoi_dung) {
      set_ho_ten(nguoi_dung.ho_ten || nguoi_dung.name || '');
      set_so_dien_thoai(nguoi_dung.so_dien_thoai || nguoi_dung.sdt || '');
      api_client.lay_dia_chi().then(res => {
        if (res.success && res.du_lieu && res.du_lieu.length > 0) {
          const def = res.du_lieu.find(a => a.la_mac_dinh === 1) || res.du_lieu[0];
          set_ho_ten(def.ten_nguoi_nhan);
          set_so_dien_thoai(def.so_dien_thoai);
          set_dia_chi(def.dia_chi_chi_tiet);
        }
      }).catch(() => {});
    }
  }, [nguoi_dung]);

  const dinh_dang_tien = (so_tien) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(so_tien || 0);
  };

  const tam_tinh = gio_hang.reduce((tong, item) => tong + (Number(item.san_pham.gia) * Number(item.so_luong)), 0);
  const phi_van_chuyen = tam_tinh >= 300000 || gio_hang.length === 0 ? 0 : 30000;
  const so_tien_giam = voucher_da_ap_dung ? voucher_da_ap_dung.so_tien_giam : 0;
  const tong_thanh_toan = Math.max(0, tam_tinh + phi_van_chuyen - so_tien_giam);

  const sao_chep_noi_dung = (chuoi, nhan) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(chuoi);
      set_da_sao_chep(nhan);
      setTimeout(() => set_da_sao_chep(''), 2500);
    }
  };

  const xu_ly_ap_dung_voucher = async (e) => {
    e.preventDefault();
    set_loi_voucher('');
    if (!ma_voucher_input.trim()) return;

    try {
      const res = await api_client.kiem_tra_voucher(ma_voucher_input.trim(), tam_tinh);
      if (res.success && res.du_lieu) {
        set_voucher_da_ap_dung(res.du_lieu);
      }
    } catch (err) {
      set_voucher_da_ap_dung(null);
      set_loi_voucher(err.message || 'Mã giảm giá không hợp lệ.');
    }
  };

  const xu_ly_dat_hang = async (e) => {
    e.preventDefault();
    if (gio_hang.length === 0) return;

    if (!ho_ten.trim() || !so_dien_thoai.trim() || !dia_chi.trim()) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng.');
      return;
    }

    set_dang_xu_ly(true);

    try {
      const items = gio_hang.map(item => ({
        san_pham_id: item.san_pham.id,
        so_luong: item.so_luong
      }));

      const res = await api_client.tao_don_hang({
        ten_nguoi_nhan: ho_ten.trim(),
        so_dien_thoai: so_dien_thoai.trim(),
        dia_chi_giao_hang: dia_chi.trim(),
        ghi_chu: ghi_chu.trim(),
        ma_voucher: voucher_da_ap_dung ? voucher_da_ap_dung.ma_voucher : null,
        phuong_thuc_thanh_toan: phuong_thuc === 'chuyen_khoan' ? 'BANKING' : (phuong_thuc === 'the' ? 'ATM' : 'COD'),
        danh_sach_san_pham: items
      });

      if (res.success && res.du_lieu) {
        const dh = res.du_lieu;
        set_don_hang_thanh_cong({
          ma_don: dh.ma_don_hang,
          ho_ten: dh.ten_nguoi_nhan,
          so_dien_thoai: dh.so_dien_thoai,
          dia_chi: dh.dia_chi_giao_hang,
          ghi_chu: dh.ghi_chu,
          phuong_thuc: dh.phuong_thuc_thanh_toan,
          san_pham: [...gio_hang],
          tong_tien: dh.tong_thanh_toan,
          tam_tinh: dh.tam_tinh,
          phi_van_chuyen: dh.phi_van_chuyen,
          giam_gia: dh.giam_gia,
          ngay_dat: new Date(dh.ngay_tao).toLocaleDateString('vi-VN')
        });

        if (on_xoa_toan_bo) on_xoa_toan_bo();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      alert(err.message || 'Lỗi xử lý đặt hàng từ máy chủ.');
    } finally {
      set_dang_xu_ly(false);
    }
  };

  // MÀN HÌNH ĐẶT HÀNG THÀNH CÔNG
  if (don_hang_thanh_cong) {
    return (
      <div className="container" style={{ padding: '40px 16px 80px 16px', maxWidth: '720px', textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '40px 24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#10b981', marginBottom: '8px' }}>
            Đặt hàng thành công!
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '24px' }}>
            Cảm ơn bạn đã tin tưởng mua sắm tại <strong>SmartDesk</strong>. Đơn hàng của bạn đã được ghi nhận vào hệ thống.
          </p>

          {/* Chi tiet don hang */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            textAlign: 'left',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#64748b', fontSize: '14px' }}>Mã đơn hàng:</span>
              <strong style={{ color: '#2563eb', fontSize: '16px' }}>{don_hang_thanh_cong.ma_don}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#64748b', fontSize: '14px' }}>Người nhận:</span>
              <span style={{ fontWeight: '600', color: '#1e293b' }}>{don_hang_thanh_cong.ho_ten} ({don_hang_thanh_cong.so_dien_thoai})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#64748b', fontSize: '14px' }}>Địa chỉ giao hàng:</span>
              <span style={{ fontWeight: '500', color: '#1e293b', textAlign: 'right', maxWidth: '380px' }}>{don_hang_thanh_cong.dia_chi}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#64748b', fontSize: '14px' }}>Phương thức:</span>
              <span style={{ fontWeight: '600', color: '#1e293b' }}>
                {don_hang_thanh_cong.phuong_thuc === 'cod' ? 'Thanh toán tiền mặt khi nhận hàng (COD)' : 'Chuyển khoản VietQR (Ngân hàng ACB)'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '12px' }}>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Tổng tiền thanh toán:</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#ef4444' }}>{dinh_dang_tien(don_hang_thanh_cong.tong_tien)}</span>
            </div>
          </div>

          {/* Neu chon chuyen khoan VietQR -> Hien thi QR ACB de quet thanh toan */}
          {don_hang_thanh_cong.phuong_thuc === 'chuyen_khoan' && (
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px 20px',
              marginBottom: '28px',
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '14px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Thông tin thanh toán qua VietQR (Napas 247)
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 0 0' }}>
                  Quét mã QR dưới đây hoặc chuyển khoản theo thông tin tài khoản
                </p>
              </div>

              <div style={{
                display: 'inline-block',
                backgroundColor: '#ffffff',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                marginBottom: '16px'
              }}>
                <img
                  src="/images/qr/acb-vietqr.jpg"
                  alt="Mã QR ACB VietQR - NGUYEN TIEN VUONG"
                  style={{ width: '200px', height: 'auto', display: 'block', borderRadius: '6px' }}
                />
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                padding: '14px 18px',
                border: '1px solid #e2e8f0',
                maxWidth: '480px',
                margin: '0 auto',
                textAlign: 'left',
                fontSize: '13px',
                lineHeight: '1.8'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Ngân hàng thụ hưởng:</span>
                  <strong style={{ color: '#0f172a' }}>ACB (TMCP Á Châu)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', padding: '6px 0' }}>
                  <span style={{ color: '#64748b' }}>Số tài khoản:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: '#2563eb' }}>11732161</strong>
                    <button
                      type="button"
                      onClick={() => sao_chep_noi_dung('11732161', 'stk')}
                      style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', cursor: 'pointer', color: '#2563eb', fontWeight: '600' }}
                    >
                      {da_sao_chep === 'stk' ? '✓ Đã sao chép' : 'Sao chép'}
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', padding: '6px 0' }}>
                  <span style={{ color: '#64748b' }}>Chủ tài khoản:</span>
                  <strong style={{ color: '#0f172a' }}>NGUYEN TIEN VUONG</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', padding: '6px 0' }}>
                  <span style={{ color: '#64748b' }}>Số tiền:</span>
                  <strong style={{ color: '#dc2626', fontSize: '14.5px' }}>{dinh_dang_tien(don_hang_thanh_cong.tong_tien)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px' }}>
                  <span style={{ color: '#64748b' }}>Nội dung chuyển khoản:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: '#2563eb' }}>SMARTDESK {don_hang_thanh_cong.ma_don.replace('#', '')}</strong>
                    <button
                      type="button"
                      onClick={() => sao_chep_noi_dung(`SMARTDESK ${don_hang_thanh_cong.ma_don.replace('#', '')}`, 'nd')}
                      style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', cursor: 'pointer', color: '#2563eb', fontWeight: '600' }}
                    >
                      {da_sao_chep === 'nd' ? '✓ Đã sao chép' : 'Sao chép'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            className="hero-cta-btn"
            style={{ padding: '14px 36px', fontSize: '16px' }}
            onClick={on_tiep_tuc_mua_sam}
          >
            🛍️ Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  // GIỎ HÀNG TRỐNG
  if (gio_hang.length === 0) {
    return (
      <div className="container" style={{ padding: '48px 16px 80px 16px', maxWidth: '640px', textAlign: 'center' }}>
        <div className="empty-box" style={{ padding: '50px 24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
            Giỏ hàng của bạn đang trống
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '420px', margin: '0 auto 24px auto' }}>
            Hiện chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá ngay các mặt hàng văn phòng phẩm chất lượng cao của chúng tôi!
          </p>
          <button
            type="button"
            className="hero-cta-btn"
            style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 30px' }}
            onClick={on_tiep_tuc_mua_sam}
          >
            Khám phá cửa hàng ngay →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '36px 16px 80px 16px', maxWidth: '1200px' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
        <span style={{ cursor: 'pointer' }} onClick={on_tiep_tuc_mua_sam}>Trang chủ</span> / <span style={{ color: '#0f172a', fontWeight: '600' }}>Giỏ hàng & Thanh toán</span>
      </div>

      <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '24px' }}>
        Giỏ hàng của bạn ({gio_hang.reduce((s, i) => s + i.so_luong, 0)} sản phẩm)
      </h1>

      <div className="cart-page-grid">
        {/* 1. DANH SÁCH SẢN PHẨM TRONG GIỎ HÀNG */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Chi tiết sản phẩm</span>
            <button
              type="button"
              onClick={on_xoa_toan_bo}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}
            >
              Xóa tất cả
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {gio_hang.map((item) => {
              const { san_pham, so_luong } = item;
              const anhHienThi = san_pham.anh_chinh || `/images/products/product-${san_pham.id}.jpg`;
              const thanhTien = Number(san_pham.gia) * Number(so_luong);

              return (
                <div
                  key={san_pham.id}
                  className="cart-item-row"
                >
                  {/* Hinh anh */}
                  <img
                    src={anhHienThi}
                    alt={san_pham.ten_san_pham}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'contain',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      padding: '4px'
                    }}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%23f1f5f9" width="80" height="80"/><text fill="%2394a3b8" font-size="10" x="50%" y="50%" text-anchor="middle">SmartDesk</text></svg>';
                    }}
                  />

                  {/* Thong tin */}
                  <div>
                    {san_pham.thuong_hieu && (
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', marginBottom: '2px' }}>
                        {san_pham.thuong_hieu}
                      </div>
                    )}
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: '0 0 6px 0', lineHeight: '1.4' }}>
                      {san_pham.ten_san_pham}
                    </h4>
                    <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: '700' }}>
                      {dinh_dang_tien(san_pham.gia)}
                    </div>
                  </div>

                  {/* Vung thao tac (so luong, thanh tien, nut xoa) */}
                  <div className="cart-item-actions">
                    {/* Bo tang giam so luong */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                      <button
                        type="button"
                        onClick={() => on_thay_doi_so_luong && on_thay_doi_so_luong(san_pham.id, so_luong - 1)}
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          backgroundColor: '#f8fafc',
                          cursor: 'pointer',
                          fontSize: '15px',
                          fontWeight: '700',
                          color: '#475569'
                        }}
                      >
                        -
                      </button>
                      <span style={{ padding: '6px 12px', minWidth: '32px', textAlign: 'center', fontSize: '14px', fontWeight: '700', backgroundColor: '#ffffff' }}>
                        {so_luong}
                      </span>
                      <button
                        type="button"
                        onClick={() => on_thay_doi_so_luong && on_thay_doi_so_luong(san_pham.id, so_luong + 1)}
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          backgroundColor: '#f8fafc',
                          cursor: 'pointer',
                          fontSize: '15px',
                          fontWeight: '700',
                          color: '#475569'
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Thanh tien va nut xoa */}
                    <div style={{ textAlign: 'right', minWidth: '100px' }}>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                        {dinh_dang_tien(thanhTien)}
                      </div>
                      <button
                        type="button"
                        onClick={() => on_xoa_san_pham && on_xoa_san_pham(san_pham.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          fontSize: '16px',
                          cursor: 'pointer',
                          transition: 'color 0.2s'
                        }}
                        title="Xóa khỏi giỏ hàng"
                        onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                        onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '20px' }}>
            <button
              type="button"
              onClick={on_tiep_tuc_mua_sam}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ← Tiếp tục chọn thêm sản phẩm khác
            </button>
          </div>
        </div>

        {/* 2. KHỐI THANH TOÁN (CHECKOUT FORM & VIETQR ACB) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '24px 22px',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '14px',
            marginBottom: '18px'
          }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>
                Thông tin thanh toán
              </h3>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 0 0' }}>
                Vui lòng điền thông tin để hoàn tất đặt hàng
              </p>
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#2563eb',
              backgroundColor: '#eff6ff',
              padding: '4px 10px',
              borderRadius: '20px',
              border: '1px solid #dbeafe'
            }}>
              Đặt hàng
            </span>
          </div>

          <form onSubmit={xu_ly_dat_hang} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Phân mục 1: Thông tin nhận hàng */}
            <div>
              <div style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#1e293b',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '4px', height: '14px', backgroundColor: '#2563eb', borderRadius: '2px', display: 'inline-block' }} />
                Thông tin nhận hàng
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={ho_ten}
                    onChange={(e) => set_ho_ten(e.target.value)}
                    required
                    placeholder="Nguyễn Văn A"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={so_dien_thoai}
                    onChange={(e) => set_so_dien_thoai(e.target.value)}
                    required
                    placeholder="0912 345 678"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
                  Địa chỉ giao hàng *
                </label>
                <textarea
                  rows={2}
                  value={dia_chi}
                  onChange={(e) => set_dia_chi(e.target.value)}
                  required
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'none',
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box',
                    lineHeight: '1.4'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
                  Ghi chú đơn hàng <span style={{ fontWeight: '400', color: '#94a3b8' }}>(Tùy chọn)</span>
                </label>
                <input
                  type="text"
                  value={ghi_chu}
                  onChange={(e) => set_ghi_chu(e.target.value)}
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Phân mục 2: Phương thức thanh toán */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#1e293b',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '4px', height: '14px', backgroundColor: '#2563eb', borderRadius: '2px', display: 'inline-block' }} />
                Phương thức thanh toán
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Lựa chọn 1: VietQR */}
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: phuong_thuc === 'chuyen_khoan' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: phuong_thuc === 'chuyen_khoan' ? '#f8faff' : '#ffffff',
                  transition: 'all 0.15s ease'
                }}>
                  <input
                    type="radio"
                    name="phuong_thuc"
                    value="chuyen_khoan"
                    checked={phuong_thuc === 'chuyen_khoan'}
                    onChange={() => set_phuong_thuc('chuyen_khoan')}
                    style={{ marginTop: '3px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>
                        Chuyển khoản VietQR qua Mobile Banking
                      </span>
                      <span style={{
                        fontSize: '10.5px',
                        fontWeight: '700',
                        color: '#1d4ed8',
                        backgroundColor: '#dbeafe',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        Napas 247
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                      Quét mã QR tự động qua tất cả ngân hàng & ví điện tử
                    </div>
                  </div>
                </label>

                {/* Lựa chọn 2: COD */}
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: phuong_thuc === 'cod' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: phuong_thuc === 'cod' ? '#f8faff' : '#ffffff',
                  transition: 'all 0.15s ease'
                }}>
                  <input
                    type="radio"
                    name="phuong_thuc"
                    value="cod"
                    checked={phuong_thuc === 'cod'}
                    onChange={() => set_phuong_thuc('cod')}
                    style={{ marginTop: '3px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>
                        Thanh toán khi nhận hàng (COD)
                      </span>
                      <span style={{
                        fontSize: '10.5px',
                        fontWeight: '700',
                        color: '#475569',
                        backgroundColor: '#f1f5f9',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        Tiền mặt
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                      Kiểm tra hàng và thanh toán tiền mặt cho nhân viên giao vận
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Khung thông tin VietQR ACB (chuẩn giao diện ngân hàng Napas) */}
            {phuong_thuc === 'chuyen_khoan' && (
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #f1f5f9',
                  paddingBottom: '10px',
                  marginBottom: '14px'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                    Mã QR thanh toán đơn hàng
                  </span>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: '600', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                    Xác nhận tự động
                  </span>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: '#ffffff',
                    padding: '8px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    <img
                      src="/images/qr/acb-vietqr.jpg"
                      alt="Mã VietQR ACB - NGUYEN TIEN VUONG"
                      style={{ width: '175px', height: 'auto', display: 'block', borderRadius: '6px' }}
                    />
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '6px' }}>
                    Mở ứng dụng ngân hàng hoặc ví điện tử để quét mã
                  </div>
                </div>

                {/* Bảng thông tin chuyển khoản phẳng, không dùng icon emoji */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  border: '1px solid #f1f5f9',
                  fontSize: '12.5px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b' }}>Ngân hàng thụ hưởng:</span>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>ACB (TMCP Á Châu)</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b' }}>Số tài khoản:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '700', color: '#2563eb', fontSize: '13.5px', letterSpacing: '0.03em' }}>11732161</span>
                      <button
                        type="button"
                        onClick={() => sao_chep_noi_dung('11732161', 'stk_cart')}
                        style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          color: '#2563eb',
                          fontWeight: '600'
                        }}
                      >
                        {da_sao_chep === 'stk_cart' ? 'Đã sao chép' : 'Sao chép'}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b' }}>Chủ tài khoản:</span>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>NGUYEN TIEN VUONG</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #e2e8f0', paddingTop: '8px', marginTop: '2px' }}>
                    <span style={{ color: '#64748b' }}>Số tiền cần chuyển:</span>
                    <span style={{ fontWeight: '800', color: '#dc2626', fontSize: '15px' }}>{dinh_dang_tien(tong_thanh_toan)}</span>
                  </div>
                </div>

                <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '10px', textAlign: 'center', lineHeight: '1.4' }}>
                  Hệ thống ghi nhận thanh toán tức thì qua cổng Napas 247.
                </div>
              </div>
            )}

            {/* Nhập mã voucher giảm giá */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
                Mã ưu đãi / Voucher
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Nhập mã (VD: WELCOME10, SMART20K)..."
                  value={ma_voucher_input}
                  onChange={(e) => set_ma_voucher_input(e.target.value.toUpperCase())}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={xu_ly_ap_dung_voucher}
                  style={{
                    padding: '9px 16px',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Áp dụng
                </button>
              </div>
              {voucher_da_ap_dung && (
                <div style={{ fontSize: '12px', color: '#166534', marginTop: '6px', fontWeight: '600', backgroundColor: '#f0fdf4', padding: '6px 10px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                  Đã áp dụng mã {voucher_da_ap_dung.ten_voucher} (-{dinh_dang_tien(voucher_da_ap_dung.so_tien_giam)})
                </div>
              )}
              {loi_voucher && (
                <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '6px', backgroundColor: '#fef2f2', padding: '6px 10px', borderRadius: '6px', border: '1px solid #fecaca' }}>
                  {loi_voucher}
                </div>
              )}
            </div>

            {/* Chi tiết chi phí */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#64748b', marginBottom: '8px' }}>
                <span>Tạm tính</span>
                <span style={{ fontWeight: '600', color: '#1e293b' }}>{dinh_dang_tien(tam_tinh)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#64748b', marginBottom: '8px' }}>
                <span>Phí vận chuyển</span>
                <span style={{ fontWeight: '600', color: phi_van_chuyen === 0 ? '#059669' : '#1e293b' }}>
                  {phi_van_chuyen === 0 ? 'Miễn phí' : dinh_dang_tien(phi_van_chuyen)}
                </span>
              </div>
              {voucher_da_ap_dung && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#059669', marginBottom: '8px' }}>
                  <span>Giảm giá</span>
                  <span style={{ fontWeight: '700' }}>-{dinh_dang_tien(voucher_da_ap_dung.so_tien_giam)}</span>
                </div>
              )}
              {tam_tinh < 300000 && (
                <div style={{ fontSize: '11.5px', color: '#d97706', backgroundColor: '#fffbeb', padding: '6px 10px', borderRadius: '6px', marginBottom: '10px', border: '1px solid #fef3c7' }}>
                  Mua thêm <strong>{dinh_dang_tien(300000 - tam_tinh)}</strong> để nhận <strong>Miễn phí vận chuyển</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '6px' }}>
                <div>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', display: 'block' }}>Tổng thanh toán</span>
                  <span style={{ fontSize: '11.5px', color: '#64748b' }}>(Đã bao gồm VAT)</span>
                </div>
                <span style={{ fontSize: '22px', fontWeight: '800', color: '#dc2626' }}>{dinh_dang_tien(tong_thanh_toan)}</span>
              </div>
            </div>

            {/* Nút đặt hàng */}
            <button
              type="submit"
              disabled={dang_xu_ly}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: dang_xu_ly ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                marginTop: '6px'
              }}
            >
              {dang_xu_ly ? 'Đang xử lý đơn hàng...' : (phuong_thuc === 'chuyen_khoan' ? 'Xác nhận & Đặt hàng VietQR' : 'Xác nhận & Đặt hàng COD')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}