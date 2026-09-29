import React from 'react';

export default function ModalSoSanh({
  mo = true,
  on_dong,
  onDong,
  danh_sach = [],
  danh_sach_so_sanh,
  on_xoa_khoi_so_sanh,
  onXoaKhoiSoSanh,
  on_xoa_tat_ca,
  onXoaTatCa,
  on_them_vao_gio,
  onThemVaoGio,
  on_xem_chi_tiet,
  onXemChiTiet
}) {
  const ds = (Array.isArray(danh_sach_so_sanh) && danh_sach_so_sanh.length > 0)
    ? danh_sach_so_sanh
    : (Array.isArray(danh_sach) ? danh_sach : []);

  const fnDong = onDong || on_dong;
  const fnXoa = onXoaKhoiSoSanh || on_xoa_khoi_so_sanh;
  const fnXoaTatCa = onXoaTatCa || on_xoa_tat_ca;
  const fnThemGio = onThemVaoGio || on_them_vao_gio;
  const fnXemChiTiet = onXemChiTiet || on_xem_chi_tiet;

  if (!mo || ds.length === 0) return null;

  const dinh_dang_tien = (so_tien) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(so_tien || 0);
  };

  return (
    <div className="compare-modal-backdrop" onClick={fnDong}>
      <div
        className="compare-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="So sánh chi tiết sản phẩm"
      >
        {/* Header Modal */}
        <div className="compare-modal-header">
          <div className="compare-modal-title">
            <span>⚖️</span>
            <h3>Bảng So Sánh Chi Tiết Sản Phẩm ({ds.length}/3)</h3>
          </div>
          <div className="compare-header-actions">
            {fnXoaTatCa && (
              <button
                type="button"
                className="btn-clear-compare"
                onClick={() => {
                  fnXoaTatCa();
                  if (fnDong) fnDong();
                }}
              >
                Xóa so sánh
              </button>
            )}
            <button
              type="button"
              className="btn-close-compare"
              onClick={fnDong}
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="compare-modal-body">
          <div className="compare-table-wrapper">
            <table className="compare-table">
              <thead>
                <tr>
                  <th style={{ width: '170px', minWidth: '170px', background: '#f8fafc', fontWeight: '700', color: '#334155' }}>
                    Tiêu chí
                  </th>
                  {ds.map((sp) => (
                    <th key={sp.id} style={{ minWidth: '220px', verticalAlign: 'top', background: '#ffffff' }}>
                      <div className="compare-col-header">
                        <button
                          type="button"
                          className="btn-remove-compare-item"
                          onClick={() => fnXoa && fnXoa(sp.id)}
                          title="Bỏ sản phẩm khỏi so sánh"
                        >
                          ✕
                        </button>
                        <div
                          style={{
                            width: '100px',
                            height: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            background: '#f8fafc',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            padding: '4px',
                            overflow: 'hidden',
                            cursor: fnXemChiTiet ? 'pointer' : 'default'
                          }}
                          onClick={() => {
                            if (fnXemChiTiet) {
                              fnXemChiTiet(sp);
                              if (fnDong) fnDong();
                            }
                          }}
                        >
                          <img
                            src={sp.anh_chinh || 'https://placehold.co/100x100?text=San+Pham'}
                            alt={sp.ten_san_pham}
                            className="compare-thumb"
                            style={{ width: '100%', height: '100%', maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', display: 'block' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/100x100?text=San+Pham';
                            }}
                          />
                        </div>
                        <div
                          className="compare-prod-name"
                          style={{ cursor: fnXemChiTiet ? 'pointer' : 'default' }}
                          onClick={() => {
                            if (fnXemChiTiet) {
                              fnXemChiTiet(sp);
                              if (fnDong) fnDong();
                            }
                          }}
                        >
                          {sp.ten_san_pham}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="compare-row-label">💰 Giá bán hiện tại</td>
                  {ds.map((sp) => (
                    <td key={sp.id} className="compare-cell-price">
                      <span className="price-main">{dinh_dang_tien(sp.gia)}</span>
                      {sp.gia_goc && Number(sp.gia_goc) > Number(sp.gia) && (
                        <div className="price-sub">
                          <span className="price-old">{dinh_dang_tien(sp.gia_goc)}</span>
                          <span className="price-discount">
                            (-{Math.round(((sp.gia_goc - sp.gia) / sp.gia_goc) * 100)}%)
                          </span>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="compare-row-label">🏷️ Thương hiệu</td>
                  {ds.map((sp) => (
                    <td key={sp.id}>
                      <span className="compare-tag-brand">{sp.thuong_hieu || 'Chính hãng SmartDesk'}</span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="compare-row-label">📁 Danh mục</td>
                  {ds.map((sp) => (
                    <td key={sp.id}>
                      <span>{sp.ten_danh_muc || 'Văn phòng phẩm'}</span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="compare-row-label">⭐ Đánh giá</td>
                  {ds.map((sp) => (
                    <td key={sp.id}>
                      <span style={{ color: '#f59e0b', fontWeight: '700' }}>
                        ★ {Number(sp.diem_danh_gia || 5).toFixed(1)} / 5
                      </span>
                      {sp.da_ban > 0 && (
                        <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '6px' }}>
                          (Đã bán {sp.da_ban})
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="compare-row-label">📦 Tình trạng kho</td>
                  {ds.map((sp) => {
                    const het = Number(sp.so_luong_ton || 0) <= 0;
                    return (
                      <td key={sp.id}>
                        <span className={`compare-stock-pill ${het ? 'stock-out' : 'stock-in'}`}>
                          {het ? 'Tạm hết hàng' : `Còn hàng (${sp.so_luong_ton} sp)`}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="compare-row-label">📝 Mô tả sản phẩm</td>
                  {ds.map((sp) => (
                    <td key={sp.id} className="compare-desc-cell">
                      {sp.mo_ta ? sp.mo_ta.slice(0, 120) + '...' : 'Sản phẩm chất lượng cao phục vụ học tập và làm việc văn phòng.'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="compare-row-label">🛒 Thao tác mua</td>
                  {ds.map((sp) => {
                    const het = Number(sp.so_luong_ton || 0) <= 0;
                    return (
                      <td key={sp.id}>
                        <button
                          type="button"
                          className="btn-compare-add-cart"
                          disabled={het}
                          onClick={() => {
                            if (fnThemGio && !het) {
                              fnThemGio(sp, 1);
                            }
                          }}
                        >
                          {het ? 'Hết hàng' : '+ Thêm giỏ ngay'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
