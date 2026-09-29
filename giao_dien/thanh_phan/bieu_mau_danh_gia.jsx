import React, { useState } from 'react';

export default function BieuMauDanhGia({ on_gui_danh_gia, dang_gui = false, loi_gui = null, thanh_cong = false }) {
  const [so_sao, set_so_sao] = useState(5);
  const [noi_dung, set_noi_dung] = useState('');
  const [loi_noi_bo, set_loi_noi_bo] = useState('');

  const xu_ly_submit = (e) => {
    e.preventDefault();
    set_loi_noi_bo('');

    if (!so_sao || so_sao < 1 || so_sao > 5) {
      set_loi_noi_bo('Vui lòng chọn số sao đánh giá (1 - 5 sao).');
      return;
    }

    if (!noi_dung || noi_dung.trim().length < 3) {
      set_loi_noi_bo('Nội dung đánh giá phải có ít nhất 3 ký tự (Noi dung danh gia phai co it nhat 3 ky tu).');
      return;
    }

    if (on_gui_danh_gia) {
      on_gui_danh_gia({ so_sao, noi_dung: noi_dung.trim() });
    }
  };

  return (
    <form
      onSubmit={xu_ly_submit}
      data-testid="bieu-mau-danh-gia"
      style={{
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        marginTop: '20px'
      }}
    >
      <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1e293b', fontWeight: '700' }}>
        Gửi đánh giá của bạn
      </h4>

      {/* Thong bao thanh cong */}
      {thanh_cong && (
        <div data-testid="thong-bao-thanh-cong" style={{ padding: '10px 14px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '6px', fontSize: '14px', marginBottom: '14px' }}>
          Cảm ơn bạn! Đánh giá đã được gửi thành công.
        </div>
      )}

      {/* Thong bao loi */}
      {(loi_noi_bo || loi_gui) && (
        <div data-testid="thong-bao-loi" style={{ padding: '10px 14px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '14px', marginBottom: '14px' }}>
          {loi_noi_bo || String(loi_gui)}
        </div>
      )}

      {/* Chon so sao */}
      <div style={{ marginBottom: '14px' }}>
        <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '6px' }}>
          Đánh giá số sao:
        </label>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[1, 2, 3, 4, 5].map((sao) => (
            <button
              key={sao}
              type="button"
              data-testid={`chon-sao-${sao}`}
              onClick={() => set_so_sao(sao)}
              style={{
                fontSize: '24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: sao <= so_sao ? '#eab308' : '#cbd5e1',
                padding: '2px'
              }}
            >
              ★
            </button>
          ))}
          <span style={{ marginLeft: '8px', fontSize: '14px', color: '#64748b', alignSelf: 'center' }}>
            ({so_sao} sao)
          </span>
        </div>
      </div>

      {/* Nhap noi dung */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="noi-dung-danh-gia" style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '6px' }}>
          Nội dung đánh giá:
        </label>
        <textarea
          id="noi-dung-danh-gia"
          data-testid="o-nhap-noi-dung"
          rows={3}
          value={noi_dung}
          onChange={(e) => set_noi_dung(e.target.value)}
          placeholder="Chia sẻ cảm nhận về sản phẩm (chất lượng, mẫu mã, đóng gói...)"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <button
        type="submit"
        data-testid="nut-gui-danh-gia"
        disabled={dang_gui}
        style={{
          padding: '10px 20px',
          backgroundColor: dang_gui ? '#94a3b8' : '#2563eb',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: dang_gui ? 'not-allowed' : 'pointer'
        }}
      >
        {dang_gui ? 'Đang gửi...' : 'Gửi đánh giá'}
      </button>
    </form>
  );
}