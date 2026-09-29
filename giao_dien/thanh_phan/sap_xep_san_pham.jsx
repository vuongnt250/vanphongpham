import React from 'react';

const CAC_LUA_CHON_SAP_XEP = [
  { gia_tri: 'moi_nhat', nhan: 'Mới nhất' },
  { gia_tri: 'gia_tang', nhan: 'Giá: Thấp đến Cao' },
  { gia_tri: 'gia_giam', nhan: 'Giá: Cao đến Thấp' },
  { gia_tri: 'ban_chay', nhan: 'Bán chạy nhất' },
  { gia_tri: 'danh_gia_cao', nhan: 'Đánh giá cao nhất' }
];

export default function SapXepSanPham({ sap_xep_hien_tai = 'moi_nhat', on_thay_doi_sap_xep }) {
  return (
    <div className="sap-xep-san-pham" data-testid="sap-xep-san-pham" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label htmlFor="select-sap-xep" style={{ fontSize: '14px', color: '#475569', whiteSpace: 'nowrap' }}>
        Sắp xếp theo:
      </label>
      <select
        id="select-sap-xep"
        data-testid="select-sap-xep"
        value={sap_xep_hien_tai}
        onChange={(e) => on_thay_doi_sap_xep && on_thay_doi_sap_xep(e.target.value)}
        style={{
          padding: '8px 12px',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          fontSize: '14px',
          backgroundColor: '#ffffff',
          color: '#1e293b',
          cursor: 'pointer'
        }}
      >
        {CAC_LUA_CHON_SAP_XEP.map((opt) => (
          <option key={opt.gia_tri} value={opt.gia_tri}>
            {opt.nhan}
          </option>
        ))}
      </select>
    </div>
  );
}