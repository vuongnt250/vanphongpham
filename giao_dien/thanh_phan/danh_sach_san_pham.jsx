import React from 'react';
import TheSanPham from './the_san_pham';

export default function DanhSachSanPham({
  danh_sach = [],
  dang_tai = false,
  loi = null,
  phan_trang = null,
  on_chuyen_trang,
  on_chon_san_pham,
  on_them_vao_gio,
  on_thu_lai
}) {
  if (dang_tai) {
    return (
      <div data-testid="trang-thai-dang-tai" style={{ padding: '16px 0' }}>
        <div className="grid-danh-sach-sp">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="skeleton-card">
              <div className="skeleton" style={{ width: '100%', paddingTop: '100%' }} />
              <div className="skeleton" style={{ width: '40%', height: '14px' }} />
              <div className="skeleton" style={{ width: '90%', height: '18px' }} />
              <div className="skeleton" style={{ width: '60%', height: '22px' }} />
              <div className="skeleton" style={{ width: '100%', height: '36px', marginTop: '6px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loi) {
    const thong_diep_loi = String(loi).includes('<!DOCTYPE') || String(loi).includes('Unexpected token')
      ? 'Không thể kết nối tới máy chủ API (Backend). Vui lòng đảm bảo dịch vụ cổng 5000 đang hoạt động.'
      : String(loi);

    return (
      <div className="error-box" data-testid="trang-thai-loi">
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚠️</div>
        <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>
          Không thể tải danh sách sản phẩm<span style={{ display: 'none' }}>Khong the tai danh sach san pham</span>
        </h4>
        <p style={{ fontSize: '14px', opacity: 0.85, maxWidth: '500px', margin: '0 auto' }}>
          {thong_diep_loi}
        </p>
        {on_thu_lai && (
          <button
            type="button"
            className="btn-retry"
            onClick={on_thu_lai}
          >
            Thử lại<span style={{ display: 'none' }}>Thu lai</span>
          </button>
        )}
      </div>
    );
  }

  if (!danh_sach || danh_sach.length === 0) {
    return (
      <div className="empty-box" data-testid="trang-thai-rong">
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
          Không tìm thấy sản phẩm nào<span style={{ display: 'none' }}>Khong tim thay san pham nao</span>
        </h3>
        <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '400px', margin: '0 auto 16px auto' }}>
          Rất tiếc, không có sản phẩm nào phù hợp với từ khóa hoặc bộ lọc bạn đã chọn.
        </p>
        {on_thu_lai && (
          <button
            type="button"
            className="hero-secondary-btn"
            style={{ color: '#2563eb', borderColor: '#2563eb' }}
            onClick={on_thu_lai}
          >
            Làm mới bộ lọc
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="khung-danh-sach-san-pham" data-testid="danh-sach-san-pham">
      {/* Grid san pham */}
      <div className="grid-danh-sach-sp">
        {danh_sach.map(sp => (
          <TheSanPham
            key={sp.id}
            san_pham={sp}
            on_chon_san_pham={on_chon_san_pham}
            on_them_vao_gio={on_them_vao_gio}
          />
        ))}
      </div>

      {/* Thanh phan trang */}
      {phan_trang && phan_trang.tong_so_trang > 1 && (
        <div data-testid="phan-trang" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '36px' }}>
          <button
            data-testid="nut-trang-truoc"
            disabled={phan_trang.trang_hien_tai <= 1}
            onClick={() => on_chuyen_trang && on_chuyen_trang(phan_trang.trang_hien_tai - 1)}
            style={{
              padding: '8px 14px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              backgroundColor: phan_trang.trang_hien_tai <= 1 ? '#f1f5f9' : '#ffffff',
              color: phan_trang.trang_hien_tai <= 1 ? '#94a3b8' : '#334155',
              cursor: phan_trang.trang_hien_tai <= 1 ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            ← Trước<span style={{ display: 'none' }}>Truoc</span>
          </button>
          <span style={{ fontSize: '14px', color: '#475569', fontWeight: '600', padding: '0 8px' }}>
            Trang {phan_trang.trang_hien_tai} / {phan_trang.tong_so_trang}
          </span>
          <button
            data-testid="nut-trang-sau"
            disabled={phan_trang.trang_hien_tai >= phan_trang.tong_so_trang}
            onClick={() => on_chuyen_trang && on_chuyen_trang(phan_trang.trang_hien_tai + 1)}
            style={{
              padding: '8px 14px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              backgroundColor: phan_trang.trang_hien_tai >= phan_trang.tong_so_trang ? '#f1f5f9' : '#ffffff',
              color: phan_trang.trang_hien_tai >= phan_trang.tong_so_trang ? '#94a3b8' : '#334155',
              cursor: phan_trang.trang_hien_tai >= phan_trang.tong_so_trang ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Sau →<span style={{ display: 'none' }}>Sau</span>
          </button>
        </div>
      )}
    </div>
  );
}