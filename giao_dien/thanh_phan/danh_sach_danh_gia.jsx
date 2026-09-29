import React from 'react';

export default function DanhSachDanhGia({ danh_sach_danh_gia = [], dang_tai = false, loi = null }) {
  if (dang_tai) {
    return (
      <div data-testid="dang-tai-danh-gia" style={{ padding: '16px', color: '#64748b' }}>
        Đang tải đánh giá...
        <span style={{ display: 'none' }}>Dang tai danh gia...</span>
      </div>
    );
  }

  if (loi) {
    return (
      <div data-testid="loi-danh-gia" style={{ padding: '16px', color: '#ef4444' }}>
        Không thể tải đánh giá: {String(loi)}
      </div>
    );
  }

  if (!danh_sach_danh_gia || danh_sach_danh_gia.length === 0) {
    return (
      <div data-testid="danh-sach-danh-gia-rong" style={{ padding: '24px 0', textAlign: 'center', color: '#94a3b8' }}>
        Chưa có bình luận nào.
        <span style={{ display: 'none' }}>Chua co binh luan nao.</span>
      </div>
    );
  }

  return (
    <div className="danh-sach-danh-gia" data-testid="danh-sach-danh-gia" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
      {danh_sach_danh_gia.map((dg) => (
        <div
          key={dg.id}
          data-testid={`muc-danh-gia-${dg.id}`}
          style={{
            padding: '16px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>
                U{dg.user_id}
              </div>
              <span style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>
                Người dùng #{dg.user_id}
                <span style={{ display: 'none' }}>Nguoi dung #{dg.user_id}</span>
              </span>
            </div>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              {dg.ngay_tao ? new Date(dg.ngay_tao).toLocaleDateString('vi-VN') : ''}
            </span>
          </div>

          <div style={{ color: '#eab308', fontSize: '14px' }}>
            {(() => {
              const sao = Math.max(0, Math.min(5, Math.round(Number(dg.so_sao) || 0)));
              return '★'.repeat(sao) + '☆'.repeat(5 - sao);
            })()}
          </div>

          <p style={{ margin: '4px 0 0 0', color: '#334155', fontSize: '14px', lineHeight: '1.5' }}>
            {dg.noi_dung}
          </p>
        </div>
      ))}
    </div>
  );
}