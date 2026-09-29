import React from 'react';

export default function LocTheoDanhMuc({ danh_muc_list = [], danh_muc_dang_chon = null, on_chon_danh_muc }) {
  return (
    <div className="loc-theo-danh-muc" data-testid="loc-theo-danh-muc" style={{ marginBottom: '20px' }}>
      <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#1e293b' }}>
        Danh mục sản phẩm
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          type="button"
          data-testid="danh-muc-tat-ca"
          onClick={() => on_chon_danh_muc && on_chon_danh_muc(null)}
          style={{
            textAlign: 'left',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: danh_muc_dang_chon === null ? '#eff6ff' : 'transparent',
            color: danh_muc_dang_chon === null ? '#2563eb' : '#475569',
            fontWeight: danh_muc_dang_chon === null ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          Tất cả danh mục
        </button>

        {danh_muc_list.map((dm) => {
          const isSelected = danh_muc_dang_chon === dm.id || String(danh_muc_dang_chon) === String(dm.id);
          return (
            <button
              key={dm.id}
              type="button"
              data-testid={`danh-muc-item-${dm.id}`}
              onClick={() => on_chon_danh_muc && on_chon_danh_muc(dm.id)}
              style={{
                textAlign: 'left',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                color: isSelected ? '#2563eb' : '#475569',
                fontWeight: isSelected ? 'bold' : 'normal',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {dm.ten_danh_muc}
            </button>
          );
        })}
      </div>
    </div>
  );
}