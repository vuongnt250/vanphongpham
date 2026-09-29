import React from 'react';

export default function LocTheoThuongHieu({
  danh_sach_thuong_hieu = [],
  thuong_hieu_dang_chon = '',
  on_chon_thuong_hieu
}) {
  return (
    <div className="loc-theo-thuong-hieu" data-testid="loc-theo-thuong-hieu" style={{ marginBottom: '20px' }}>
      <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#1e293b' }}>
        Thương hiệu
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          type="button"
          data-testid="thuong-hieu-tat-ca"
          onClick={() => on_chon_thuong_hieu && on_chon_thuong_hieu('')}
          style={{
            textAlign: 'left',
            padding: '6px 8px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: !thuong_hieu_dang_chon ? '#eff6ff' : 'transparent',
            color: !thuong_hieu_dang_chon ? '#2563eb' : '#475569',
            fontWeight: !thuong_hieu_dang_chon ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          Tất cả thương hiệu
        </button>

        {danh_sach_thuong_hieu.map((th, idx) => {
          const isSelected = thuong_hieu_dang_chon === th;
          return (
            <button
              key={idx}
              type="button"
              data-testid={`thuong-hieu-item-${idx}`}
              onClick={() => on_chon_thuong_hieu && on_chon_thuong_hieu(th)}
              style={{
                textAlign: 'left',
                padding: '6px 8px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                color: isSelected ? '#2563eb' : '#475569',
                fontWeight: isSelected ? 'bold' : 'normal',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              {th}
            </button>
          );
        })}
      </div>
    </div>
  );
}