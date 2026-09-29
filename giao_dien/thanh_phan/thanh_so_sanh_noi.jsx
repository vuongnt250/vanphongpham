import React from 'react';

export default function ThanhSoSanhNoi({
  danh_sach = [],
  danh_sach_so_sanh,
  on_mo_so_sanh,
  onMoModalSoSanh,
  on_xoa_khoi_so_sanh,
  onXoaKhoiSoSanh,
  on_xoa_tat_ca,
  onXoaTatCa
}) {
  const ds = (Array.isArray(danh_sach_so_sanh) && danh_sach_so_sanh.length > 0)
    ? danh_sach_so_sanh
    : (Array.isArray(danh_sach) ? danh_sach : []);

  const fnMo = onMoModalSoSanh || on_mo_so_sanh;
  const fnXoa = onXoaKhoiSoSanh || on_xoa_khoi_so_sanh;
  const fnXoaHet = onXoaTatCa || on_xoa_tat_ca;

  if (ds.length === 0) return null;

  return (
    <div className="floating-compare-bar" data-testid="thanh-so-sanh-noi">
      <div className="floating-compare-items">
        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)', whiteSpace: 'nowrap', marginRight: '4px' }}>
          ⚖️ So sánh ({ds.length}/3)
        </span>
        {ds.map((sp) => (
          <div key={sp.id} className="floating-compare-thumb-wrap" title={sp.ten_san_pham}>
            <img
              src={sp.anh_chinh || '/images/san_pham/default.png'}
              alt={sp.ten_san_pham}
              className="floating-compare-thumb"
              onError={(e) => { e.target.src = 'https://placehold.co/44x44?text=SP'; }}
            />
            <button
              type="button"
              className="floating-compare-btn-remove"
              onClick={() => fnXoa && fnXoa(sp.id)}
              title="Bỏ chọn sản phẩm này"
            >
              ✕
            </button>
          </div>
        ))}
        {ds.length < 3 && (
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
            (+ chọn thêm {3 - ds.length})
          </span>
        )}
      </div>

      <div className="floating-compare-actions">
        <button
          type="button"
          className="floating-compare-btn-view"
          onClick={fnMo}
        >
          ⚖️ So sánh ngay ({ds.length})
        </button>
        <button
          type="button"
          className="floating-compare-btn-clear"
          onClick={fnXoaHet}
          title="Hủy bỏ toàn bộ so sánh"
        >
          ✕ Bỏ hết
        </button>
      </div>
    </div>
  );
}
