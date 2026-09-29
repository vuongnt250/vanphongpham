import React from 'react';

export default function HienThiDanhGia({ thong_ke }) {
  if (!thong_ke || thong_ke.tong_so_danh_gia === 0) {
    return (
      <div data-testid="danh-gia-chua-co" style={{ padding: '24px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
        <p style={{ color: '#64748b', margin: 0 }}>
          Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!
          <span style={{ display: 'none' }}>Chua co danh gia nao</span>
        </p>
      </div>
    );
  }

  const { diem_trung_binh = 0, tong_so_danh_gia = 0, chi_tiet_sao = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } } = thong_ke;

  return (
    <div className="tong-quan-danh-gia" data-testid="tong-quan-danh-gia" style={{ display: 'flex', gap: '32px', alignItems: 'center', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', flexWrap: 'wrap' }}>
      {/* Cot diem trung binh */}
      <div style={{ textAlign: 'center', minWidth: '120px' }}>
        <div data-testid="diem-so-tb" style={{ fontSize: '40px', fontWeight: 'bold', color: '#1e293b', lineHeight: '1' }}>
          {Number(diem_trung_binh).toFixed(1)}
        </div>
        <div style={{ color: '#eab308', fontSize: '20px', margin: '6px 0' }}>
          {(() => {
            const sao = Math.max(0, Math.min(5, Math.round(Number(diem_trung_binh) || 0)));
            return '★'.repeat(sao) + '☆'.repeat(5 - sao);
          })()}
        </div>
        <div data-testid="tong-so-danh-gia" style={{ fontSize: '13px', color: '#64748b' }}>
          {tong_so_danh_gia} đánh giá
          <span style={{ display: 'none' }}>{tong_so_danh_gia} danh gia</span>
        </div>
      </div>

      {/* Cac thanh ty le sao */}
      <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {[5, 4, 3, 2, 1].map((sao) => {
          const so_luong = chi_tiet_sao[sao] || 0;
          const ty_le = tong_so_danh_gia > 0 ? (so_luong / tong_so_danh_gia) * 100 : 0;
          return (
            <div key={sao} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <span style={{ width: '40px', color: '#475569' }}>{sao} sao</span>
              <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${ty_le}%`,
                    height: '100%',
                    backgroundColor: '#eab308',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <span style={{ width: '32px', textAlign: 'right', color: '#64748b' }}>{so_luong}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}