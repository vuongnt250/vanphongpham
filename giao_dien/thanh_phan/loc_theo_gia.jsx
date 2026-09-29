import React, { useState } from 'react';

const CAC_KHOANG_GIA_GOI_Y = [
  { nhan: 'Dưới 50.000đ', tu: '', den: 50000 },
  { nhan: '50.000đ - 100.000đ', tu: 50000, den: 100000 },
  { nhan: '100.000đ - 200.000đ', tu: 100000, den: 200000 },
  { nhan: 'Trên 200.000đ', tu: 200000, den: '' }
];

export default function LocTheoGia({ gia_tu_khoi_tao = '', gia_den_khoi_tao = '', on_ap_dung_gia }) {
  const [gia_tu, set_gia_tu] = useState(gia_tu_khoi_tao);
  const [gia_den, set_gia_den] = useState(gia_den_khoi_tao);

  const xu_ly_ap_dung = (e) => {
    e.preventDefault();
    if (on_ap_dung_gia) {
      on_ap_dung_gia(gia_tu, gia_den);
    }
  };

  const xu_ly_chon_khoang_gia = (tu, den) => {
    set_gia_tu(tu);
    set_gia_den(den);
    if (on_ap_dung_gia) {
      on_ap_dung_gia(tu, den);
    }
  };

  return (
    <div className="loc-theo-gia" data-testid="loc-theo-gia" style={{ marginBottom: '20px' }}>
      <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#1e293b' }}>
        Khoảng giá
      </h4>

      {/* Cac nut khoang gia co san */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
        {CAC_KHOANG_GIA_GOI_Y.map((k, idx) => (
          <button
            key={idx}
            type="button"
            data-testid={`khoang-gia-goi-y-${idx}`}
            onClick={() => xu_ly_chon_khoang_gia(k.tu, k.den)}
            style={{
              textAlign: 'left',
              padding: '6px 8px',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              backgroundColor: '#f8fafc',
              color: '#334155',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            {k.nhan}
          </button>
        ))}
      </div>

      {/* Form nhap khoang gia tuy chinh */}
      <form onSubmit={xu_ly_ap_dung} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="number"
            placeholder="Từ"
            value={gia_tu}
            onChange={(e) => set_gia_tu(e.target.value)}
            data-testid="o-nhap-gia-tu"
            style={{ width: '48%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Đến"
            value={gia_den}
            onChange={(e) => set_gia_den(e.target.value)}
            data-testid="o-nhap-gia-den"
            style={{ width: '48%', padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
          />
        </div>
        <button
          type="submit"
          data-testid="nut-ap-dung-gia"
          style={{
            padding: '6px 12px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600'
          }}
        >
          Áp dụng
        </button>
      </form>
    </div>
  );
}