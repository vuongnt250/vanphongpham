import React from 'react';

export default function BaoHanhChungTu({ on_quay_lai_trang_chu, on_kham_pha_san_pham }) {
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
        <span>Hỗ trợ khách hàng</span>
        <span>/</span>
        <span style={{ color: 'var(--color-text-main)', fontWeight: '700' }}>Cam kết bảo hành & Chứng từ chính hãng</span>
      </div>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '36px 30px',
        marginBottom: '32px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '9999px', fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>
          ⭐ 100% Phân phối chính thức
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
          Cam Kết Bảo Hành & Chứng Từ Xuất Xứ (CO/CQ)
        </h1>
        <p style={{ opacity: 0.9, fontSize: '15px', lineHeight: '1.6' }}>
          Tất cả sản phẩm tại SmartDesk đều có nguồn gốc rõ ràng từ các nhà sản xuất uy tín hàng đầu. Cam kết đền bù 200% nếu phát hiện hàng giả, hàng nhái.
        </p>
      </div>

      {/* Content Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Section 1: Đối tác thương hiệu */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🏢</span> 1. Mạng lưới thương hiệu đối tác chính thức
          </h2>
          <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--color-text-main)', marginBottom: '12px' }}>
            SmartDesk là đối tác phân phối được ủy quyền chính thức từ:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '12px', textAlign: 'center', backgroundColor: 'var(--color-surface-muted)', borderRadius: '8px', border: '1px solid var(--color-border)', fontWeight: '700' }}>Double A (Thái Lan)</div>
            <div style={{ padding: '12px', textAlign: 'center', backgroundColor: 'var(--color-surface-muted)', borderRadius: '8px', border: '1px solid var(--color-border)', fontWeight: '700' }}>Deli Global</div>
            <div style={{ padding: '12px', textAlign: 'center', backgroundColor: 'var(--color-surface-muted)', borderRadius: '8px', border: '1px solid var(--color-border)', fontWeight: '700' }}>Thiên Long (Việt Nam)</div>
            <div style={{ padding: '12px', textAlign: 'center', backgroundColor: 'var(--color-surface-muted)', borderRadius: '8px', border: '1px solid var(--color-border)', fontWeight: '700' }}>Hồng Hà</div>
            <div style={{ padding: '12px', textAlign: 'center', backgroundColor: 'var(--color-surface-muted)', borderRadius: '8px', border: '1px solid var(--color-border)', fontWeight: '700' }}>Casio Japan</div>
            <div style={{ padding: '12px', textAlign: 'center', backgroundColor: 'var(--color-surface-muted)', borderRadius: '8px', border: '1px solid var(--color-border)', fontWeight: '700' }}>Plus Japan</div>
          </div>
        </div>

        {/* Section 2: Chính sách bảo hành thiết bị */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🛠️</span> 2. Thời hạn bảo hành các nhóm thiết bị
          </h2>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: 'var(--color-text-main)', fontSize: '14px' }}>
            <li><strong>Máy tính cầm tay Casio / Deli:</strong> Bảo hành chính hãng <strong>02 đến 07 năm</strong> theo tiêu chuẩn hãng.</li>
            <li><strong>Máy in, Hộp mực Laser HP / Canon:</strong> Bảo hành theo số lượng trang in hoặc <strong>12 tháng</strong>.</li>
            <li><strong>Máy bấm kim, máy ép plastic, máy hủy tài liệu:</strong> Bảo hành <strong>12 - 24 tháng</strong> tận nơi.</li>
          </ul>
        </div>

        {/* Section 3: Hóa đơn chứng từ */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📑</span> 3. Chứng từ CO/CQ và Hóa đơn điện tử
          </h2>
          <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--color-text-main)' }}>
            Mọi đơn hàng xuất kho đều đi kèm <strong>Hóa đơn Giá trị gia tăng (VAT điện tử)</strong>, phiếu xuất kho kiêm bảo hành, và chứng chỉ xuất xứ hàng hóa CO/CQ (nếu doanh nghiệp có yêu cầu tham gia đấu thầu).
          </p>
        </div>
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
          🛍️ Mua sắm sản phẩm chính hãng
        </button>
      </div>
    </div>
  );
}