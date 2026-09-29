import React, { useState, useRef } from 'react';
import { bat_dau_nghe_giong_noi, kiem_tra_ho_tro_giong_noi } from '../tien_ich/tro_ly_giong_noi';

export default function TimKiemSanPham({ gia_tri_khoi_tao = '', on_tim_kiem, goi_y = 'Tìm kiếm bút, giấy, sổ tay, văn phòng phẩm...' }) {
  const [tu_khoa, set_tu_khoa] = useState(gia_tri_khoi_tao);
  const [dang_nghe, set_dang_nghe] = useState(false);
  const recognitionRef = useRef(null);

  const xu_ly_submit = (e) => {
    e.preventDefault();
    if (on_tim_kiem) {
      on_tim_kiem(tu_khoa.trim());
    }
  };

  const xu_ly_xoa = () => {
    set_tu_khoa('');
    if (on_tim_kiem) {
      on_tim_kiem('');
    }
  };

  const xu_ly_giong_noi = () => {
    if (dang_nghe) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      set_dang_nghe(false);
      return;
    }

    set_tu_khoa('');
    set_dang_nghe(true);

    recognitionRef.current = bat_dau_nghe_giong_noi({
      onStart: () => set_dang_nghe(true),
      onInterim: (text) => {
        // Khi may vua nghe duoc am thanh, chu hien thi ngay lap tuc
        set_tu_khoa(text);
      },
      onResult: (text, isFinal) => {
        set_tu_khoa(text);
        if (isFinal && text.trim() && on_tim_kiem) {
          // Khi nguoi dung ngung noi thi thuc hien tim kiem
          on_tim_kiem(text.trim());
        }
      },
      onError: (err) => {
        set_dang_nghe(false);
        recognitionRef.current = null;
        if (err && err.message) {
          alert(err.message);
        }
      },
      onEnd: () => {
        set_dang_nghe(false);
        recognitionRef.current = null;
      }
    });
  };

  return (
    <form onSubmit={xu_ly_submit} data-testid="form-tim-kiem" style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '540px' }}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={tu_khoa}
          onChange={(e) => set_tu_khoa(e.target.value)}
          placeholder={dang_nghe ? '🎙️ Đang lắng nghe bạn nói...' : goi_y}
          data-testid="o-nhap-tim-kiem"
          style={{
            width: '100%',
            padding: '10px 70px 10px 14px',
            border: dang_nghe ? '2px solid #ef4444' : '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
            backgroundColor: dang_nghe ? '#fff1f2' : '#ffffff',
            transition: 'all 0.2s'
          }}
        />
        <div style={{ position: 'absolute', right: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {tu_khoa && (
            <button
              type="button"
              onClick={xu_ly_xoa}
              data-testid="nut-xoa-tim-kiem"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                fontSize: '14px',
                padding: '4px'
              }}
            >
              ✕
            </button>
          )}
          <button
            type="button"
            className={`btn-voice-search ${dang_nghe ? 'is-listening' : ''}`}
            onClick={xu_ly_giong_noi}
            title={dang_nghe ? 'Đang nghe...' : 'Tìm kiếm bằng giọng nói'}
            style={{
              background: dang_nghe ? '#ef4444' : 'none',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            {dang_nghe ? '🔴' : '🎙️'}
          </button>
        </div>
      </div>
      <button
        type="submit"
        data-testid="nut-tim-kiem"
        style={{
          padding: '10px 20px',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: '600',
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        Tìm kiếm
      </button>
    </form>
  );
}