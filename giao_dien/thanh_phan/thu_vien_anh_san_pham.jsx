import React, { useState, useEffect } from 'react';

const ANH_MAC_DINH = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="%23f1f5f9" width="400" height="400"/><text fill="%2394a3b8" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%" y="50%" text-anchor="middle">Hinh anh chi tiet</text></svg>';

export default function ThuVienAnhSanPham({ danh_sach_anh = [], ten_san_pham = '', anh_chinh_mac_dinh = '' }) {
  const anh_dau_tien = anh_chinh_mac_dinh || (danh_sach_anh[0] ? danh_sach_anh[0].duong_dan_anh : ANH_MAC_DINH);
  const [anh_hien_tai, set_anh_hien_tai] = useState(anh_dau_tien);
  const [anh_loi, set_anh_loi] = useState(false);

  useEffect(() => {
    const anh_moi = anh_chinh_mac_dinh || (danh_sach_anh[0] ? danh_sach_anh[0].duong_dan_anh : ANH_MAC_DINH);
    set_anh_hien_tai(anh_moi);
    set_anh_loi(false);
  }, [anh_chinh_mac_dinh, danh_sach_anh]);

  return (
    <div className="thu-vien-anh-san-pham" data-testid="thu-vien-anh-san-pham" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Anh chinh lon */}
      <div
        style={{
          width: '100%',
          height: '380px',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          overflow: 'hidden'
        }}
      >
        <img
          src={anh_loi ? ANH_MAC_DINH : anh_hien_tai}
          alt={ten_san_pham || 'Chi tiet san pham'}
          data-testid="anh-chinh-hien-thi"
          onError={() => set_anh_loi(true)}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Danh sach thumbnail */}
      {danh_sach_anh && danh_sach_anh.length > 1 && (
        <div data-testid="danh-sach-thumbnail" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {danh_sach_anh.map((item, idx) => {
            const isSelected = (anh_hien_tai === item.duong_dan_anh);
            return (
              <button
                key={item.id || idx}
                type="button"
                data-testid={`thumbnail-${idx}`}
                onClick={() => {
                  set_anh_hien_tai(item.duong_dan_anh);
                  set_anh_loi(false);
                }}
                style={{
                  width: '64px',
                  height: '64px',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '2px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={item.duong_dan_anh}
                  alt={`Thumbnail ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.src = ANH_MAC_DINH;
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}