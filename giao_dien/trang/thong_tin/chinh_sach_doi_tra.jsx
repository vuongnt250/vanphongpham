import React from 'react';

export default function ChinhSachDoiTra({ on_quay_lai_trang_chu, on_kham_pha_san_pham }) {
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
        <span style={{ color: 'var(--color-text-main)', fontWeight: '700' }}>Chính sách đổi trả & Hoàn tiền</span>
      </div>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '36px 30px',
        marginBottom: '32px',
        boxShadow: '0 8px 20px rgba(37, 99, 235, 0.2)'
      }}>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '9999px', fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>
          🛡️ Bảo vệ quyền lợi khách hàng
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
          Chính sách Đổi trả & Hoàn tiền trong 7 ngày
        </h1>
        <p style={{ opacity: 0.9, fontSize: '15px', lineHeight: '1.6' }}>
          SmartDesk cam kết mang đến trải nghiệm mua sắm an tâm tuyệt đối. Mọi sản phẩm văn phòng phẩm bị lỗi kỹ thuật hoặc không đúng mô tả đều được hỗ trợ đổi trả miễn phí.
        </p>
      </div>

      {/* Main Content Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Card 1: Điều kiện đổi trả */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>✅</span> 1. Điều kiện chấp nhận đổi trả
          </h2>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: 'var(--color-text-main)', fontSize: '14px' }}>
            <li>Sản phẩm còn nguyên tem, bao bì đóng gói, nhãn mác của nhà sản xuất (Double A, Deli, Thiên Long, Hồng Hà...).</li>
            <li>Sản phẩm giao sai mẫu mã, thiếu số lượng so với đơn đặt hàng trên hệ thống.</li>
            <li>Sản phẩm bị lỗi do quá trình vận chuyển (bẹp dúm, rách vỡ, chảy mực, ướt nhòe).</li>
            <li>Thời gian tiếp nhận yêu cầu đổi trả: <strong>Trong vòng 07 ngày</strong> kể từ ngày khách hàng nhận được kiện hàng.</li>
          </ul>
        </div>

        {/* Card 2: Quy trình 4 bước đổi trả */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔄</span> 2. Quy trình xử lý đổi trả (4 Bước nhanh chóng)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: 'var(--color-surface-muted)', padding: '16px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '16px', marginBottom: '6px' }}>Bước 1</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-main)' }}>Chụp ảnh / quay video sản phẩm lỗi kèm phiếu giao hàng.</div>
            </div>
            <div style={{ backgroundColor: 'var(--color-surface-muted)', padding: '16px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '16px', marginBottom: '6px' }}>Bước 2</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-main)' }}>Liên hệ Hotline <strong>1900 1234</strong> hoặc gửi email <strong>hotro@smartdesk.vn</strong>.</div>
            </div>
            <div style={{ backgroundColor: 'var(--color-surface-muted)', padding: '16px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '16px', marginBottom: '6px' }}>Bước 3</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-main)' }}>Shipper SmartDesk đến tận nơi thu hồi hàng đổi miễn phí.</div>
            </div>
            <div style={{ backgroundColor: 'var(--color-surface-muted)', padding: '16px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '16px', marginBottom: '6px' }}>Bước 4</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-main)' }}>Gửi sản phẩm mới thay thế hoặc hoàn tiền trong 24h làm việc.</div>
            </div>
          </div>
        </div>

        {/* Card 3: Chính sách hoàn tiền */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💳</span> 3. Phương thức hoàn tiền
          </h2>
          <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--color-text-main)', marginBottom: '12px' }}>
            Đối với các trường hợp khách hàng không có nhu cầu đổi sản phẩm tương đương, SmartDesk sẽ thực hiện hoàn trả 100% số tiền đã thanh toán:
          </p>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: 'var(--color-text-main)', fontSize: '14px' }}>
            <li><strong>Chuyển khoản VietQR / Ngân hàng:</strong> Tiền về tài khoản trong 1 - 2 ngày làm việc.</li>
            <li><strong>Hoàn tiền vào ví / Voucher:</strong> Cộng trực tiếp vào tài khoản SmartDesk để trừ vào đơn hàng tiếp theo.</li>
          </ul>
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
          🛍️ Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
}