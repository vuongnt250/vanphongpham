import React from 'react';

export default function ChinhSachGiaoHang({ on_quay_lai_trang_chu, on_kham_pha_san_pham }) {
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
        <span style={{ color: 'var(--color-text-main)', fontWeight: '700' }}>Chính sách giao hàng & Vận chuyển</span>
      </div>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '36px 30px',
        marginBottom: '32px',
        boxShadow: '0 8px 20px rgba(13, 148, 136, 0.2)'
      }}>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '9999px', fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>
          🚚 Hỏa tốc & Toàn quốc
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
          Chính sách Giao Hàng & Biểu Phí Vận Chuyển
        </h1>
        <p style={{ opacity: 0.9, fontSize: '15px', lineHeight: '1.6' }}>
          Giao hàng hỏa tốc trong 2H tại nội thành và vận chuyển toàn quốc nhanh chóng qua mạng lưới đối tác logistics uy tín.
        </p>
      </div>

      {/* Main Content Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Card 1: Hỏa tốc 2H */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0d9488', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡</span> 1. Dịch vụ Giao Hàng Hỏa Tốc (2 Giờ)
          </h2>
          <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--color-text-main)', marginBottom: '12px' }}>
            Áp dụng cho khách hàng tại các quận nội thành Hà Nội và TP. Hồ Chí Minh cần gấp văn phòng phẩm, giấy in hoặc mực in phục vụ công việc và hội họp.
          </p>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: 'var(--color-text-main)', fontSize: '14px' }}>
            <li>Thời gian nhận đơn: Từ 8h00 đến 17h00 các ngày trong tuần.</li>
            <li>Thời gian cam kết nhận hàng: <strong>Trong vòng 2 giờ</strong> kể từ lúc xác nhận đơn hàng thành công.</li>
          </ul>
        </div>

        {/* Card 2: Biểu phí & Miễn phí vận chuyển */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0d9488', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💰</span> 2. Biểu phí & Ưu đãi Miễn phí vận chuyển
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-muted)', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '12px', fontWeight: '700' }}>Giá trị đơn hàng</th>
                <th style={{ padding: '12px', fontWeight: '700' }}>Khu vực giao</th>
                <th style={{ padding: '12px', fontWeight: '700' }}>Phí vận chuyển</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px', fontWeight: '700', color: '#10b981' }}>Từ 300.000đ trở lên</td>
                <td style={{ padding: '12px' }}>Toàn quốc</td>
                <td style={{ padding: '12px', fontWeight: '800', color: '#10b981' }}>MIỄN PHÍ (0đ)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px' }}>Dưới 300.000đ</td>
                <td style={{ padding: '12px' }}>Nội thành</td>
                <td style={{ padding: '12px', fontWeight: '700' }}>30.000đ đồng giá</td>
              </tr>
              <tr>
                <td style={{ padding: '12px' }}>Đơn hàng doanh nghiệp / Số lượng lớn</td>
                <td style={{ padding: '12px' }}>Theo hợp đồng</td>
                <td style={{ padding: '12px', fontWeight: '800', color: '#0d9488' }}>Miễn phí bốc xếp tận văn phòng</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Card 3: Kiểm hàng trước khi thanh toán */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0d9488', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📦</span> 3. Quy định đồng kiểm hàng
          </h2>
          <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--color-text-main)' }}>
            Khách hàng được quyền <strong>mở hộp đồng kiểm tra số lượng và quy cách</strong> sản phẩm trước sự chứng kiến của nhân viên giao nhận trước khi thanh toán tiền mặt (COD).
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
            backgroundColor: '#0d9488',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          🛍️ Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
}