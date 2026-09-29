import React, { useState } from 'react';

export default function MuaHangDoanhNghiep({ on_quay_lai_trang_chu, on_kham_pha_san_pham }) {
  const [ten_cty, set_ten_cty] = useState('');
  const [mst, set_mst] = useState('');
  const [sdt, set_sdt] = useState('');
  const [email, set_email] = useState('');
  const [nhu_cau, set_nhu_cau] = useState('');
  const [gui_thanh_cong, set_gui_thanh_cong] = useState(false);

  const xu_ly_gui_yeu_cau = (e) => {
    e.preventDefault();
    if (!ten_cty.trim() || !sdt.trim()) {
      alert('Vui lòng nhập Tên công ty và Số điện thoại liên hệ.');
      return;
    }
    set_gui_thanh_cong(true);
  };

  return (
    <div className="container" style={{ padding: '36px 16px 80px 16px', maxWidth: '900px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={on_quay_lai_trang_chu}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '600' }}
        >
          Trang chủ
        </button>
        <span>/</span>
        <span>Dịch vụ B2B</span>
        <span>/</span>
        <span style={{ color: 'var(--color-text-main)', fontWeight: '700' }}>Cung cấp Văn phòng phẩm cho Doanh nghiệp</span>
      </div>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '36px 30px',
        marginBottom: '32px',
        boxShadow: '0 8px 20px rgba(67, 56, 202, 0.2)'
      }}>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '9999px', fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>
          🏢 Dành riêng cho Doanh nghiệp & Trường học
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
          Giải pháp Cung ứng Văn phòng phẩm Toàn diện
        </h1>
        <p style={{ opacity: 0.9, fontSize: '15px', lineHeight: '1.6' }}>
          Chiết khấu lên đến 25% cho đơn hàng số lượng lớn, hỗ trợ công nợ 30 ngày và xuất đầy đủ hóa đơn điện tử VAT trong ngày.
        </p>
      </div>

      {/* 4 Ưu điểm dành cho B2B */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'var(--color-surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏷️</div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>Chiết khấu bậc thang</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Tiết kiệm ngân sách đến 25% cho công ty.</p>
        </div>
        <div style={{ backgroundColor: 'var(--color-surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📑</div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>Hóa đơn VAT hợp lệ</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Xuất hóa đơn điện tử ngay khi hoàn tất giao hàng.</p>
        </div>
        <div style={{ backgroundColor: 'var(--color-surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🗓️</div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>Công nợ linh hoạt</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Hỗ trợ kỳ hạn thanh toán 15 - 30 ngày cho đối tác ký hợp đồng.</p>
        </div>
        <div style={{ backgroundColor: 'var(--color-surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>👨‍💼</div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>Chuyên viên phụ trách</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Nhân viên hỗ trợ báo giá và giao hàng định kỳ 1:1.</p>
        </div>
      </div>

      {/* Form đăng ký nhận báo giá doanh nghiệp */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '8px' }}>
          📋 Yêu cầu Báo giá & Tư vấn Doanh nghiệp
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
          Điền thông tin doanh nghiệp dưới đây, đội ngũ B2B SmartDesk sẽ liên hệ gửi bảng báo giá chiết khấu trong vòng 30 phút.
        </p>

        {gui_thanh_cong ? (
          <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎉</div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>Gửi yêu cầu thành công!</h3>
            <p style={{ fontSize: '14px' }}>Chuyên viên B2B của SmartDesk sẽ liên hệ qua số điện thoại <strong>{sdt}</strong> ngay hôm nay.</p>
          </div>
        ) : (
          <form onSubmit={xu_ly_gui_yeu_cau} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Tên công ty / Trường học *</label>
                <input
                  type="text"
                  required
                  value={ten_cty}
                  onChange={(e) => set_ten_cty(e.target.value)}
                  placeholder="Công ty Cổ phần..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-text-main)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Mã số thuế</label>
                <input
                  type="text"
                  value={mst}
                  onChange={(e) => set_mst(e.target.value)}
                  placeholder="0101234567..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-text-main)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Số điện thoại liên hệ *</label>
                <input
                  type="tel"
                  required
                  value={sdt}
                  onChange={(e) => set_sdt(e.target.value)}
                  placeholder="0987 654 321"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-text-main)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Email nhận báo giá</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => set_email(e.target.value)}
                  placeholder="purchasing@company.vn"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-text-main)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Nhu cầu định kỳ / Danh mục cần mua</label>
              <textarea
                rows={3}
                value={nhu_cau}
                onChange={(e) => set_nhu_cau(e.target.value)}
                placeholder="Ví dụ: Giấy A4 Double A 50 thùng/tháng, 100 bút bi Thiên Long..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-text-main)' }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: '#4338ca',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '15px',
                cursor: 'pointer',
                alignSelf: 'flex-start'
              }}
            >
              🚀 Nhận báo giá chiết khấu ngay
            </button>
          </form>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '36px' }}>
        <button
          type="button"
          onClick={on_quay_lai_trang_chu}
          style={{
            padding: '12px 24px',
            backgroundColor: 'var(--color-surface-hover)',
            color: 'var(--color-text-main)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ← Về Trang chủ
        </button>
        <button
          type="button"
          onClick={on_kham_pha_san_pham}
          style={{
            padding: '12px 28px',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          🛍️ Khám phá sản phẩm
        </button>
      </div>
    </div>
  );
}