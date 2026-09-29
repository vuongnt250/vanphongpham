import React, { useState, useEffect } from 'react';

export default function ModalWishlist(props) {
  // Ho tro linh hoat ca naming snake_case va camelCase
  const mo = props.mo !== undefined ? props.mo : (props.isOpen !== undefined ? props.isOpen : true);
  const onDong = props.on_dong || props.onDong || props.onClose;
  const onXemChiTiet = props.on_xem_chi_tiet || props.onXemChiTiet;
  const onThemVaoGio = props.on_them_vao_gio || props.onThemVaoGio;
  const onXoaKhoiWishlist = props.on_xoa_khoi_wishlist || props.onXoaKhoiWishlist;
  const onXoaTatCa = props.on_xoa_tat_ca || props.onXoaTatCa;
  const onKhamPha = props.on_kham_pha || props.onKhamPha;

  // Lay danh sach tu props hoac fallback tu localStorage
  const [danh_sach_noi_bo, set_danh_sach_noi_bo] = useState(() => {
    if (Array.isArray(props.danh_sach) && props.danh_sach.length > 0) {
      return props.danh_sach;
    }
    if (Array.isArray(props.danhSach) && props.danhSach.length > 0) {
      return props.danhSach;
    }
    try {
      const raw = localStorage.getItem('smartdesk_wishlist');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // Cap nhat khi props thay doi
  useEffect(() => {
    if (Array.isArray(props.danh_sach)) {
      set_danh_sach_noi_bo(props.danh_sach);
    } else if (Array.isArray(props.danhSach)) {
      set_danh_sach_noi_bo(props.danhSach);
    } else {
      try {
        const raw = localStorage.getItem('smartdesk_wishlist');
        set_danh_sach_noi_bo(raw ? JSON.parse(raw) : []);
      } catch (e) {}
    }
  }, [props.danh_sach, props.danhSach]);

  if (!mo) return null;

  const dinh_dang_tien = (so_tien) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(so_tien) || 0);
  };

  const xu_ly_xoa_khoi_wishlist = (e, spId) => {
    e.stopPropagation();
    const moi = danh_sach_noi_bo.filter(item => {
      const id = typeof item === 'object' && item !== null ? item.id : item;
      return id !== spId;
    });
    set_danh_sach_noi_bo(moi);
    try {
      localStorage.setItem('smartdesk_wishlist', JSON.stringify(moi));
      window.dispatchEvent(new CustomEvent('smartdesk_wishlist_updated', { detail: moi }));
    } catch (err) {}

    if (onXoaKhoiWishlist) {
      onXoaKhoiWishlist(spId);
    }
  };

  const xu_ly_xoa_tat_ca = (e) => {
    e.stopPropagation();
    set_danh_sach_noi_bo([]);
    try {
      localStorage.removeItem('smartdesk_wishlist');
      window.dispatchEvent(new CustomEvent('smartdesk_wishlist_updated', { detail: [] }));
    } catch (err) {}

    if (onXoaTatCa) {
      onXoaTatCa();
    }
  };

  const xu_ly_xem_chi_tiet = (sp) => {
    if (onXemChiTiet) {
      onXemChiTiet(sp);
    }
    if (onDong) {
      onDong();
    }
  };

  const xu_ly_them_gio = (e, sp) => {
    e.stopPropagation();
    if (onThemVaoGio) {
      // Ho tro ca truyen sp don thuan va { san_pham, so_luong }
      onThemVaoGio({ san_pham: sp, so_luong: 1 });
    }
  };

  const xu_ly_kham_pha = () => {
    if (onKhamPha) {
      onKhamPha();
    }
    if (onDong) {
      onDong();
    }
  };

  return (
    <div className="wishlist-modal-backdrop" onClick={onDong}>
      <div
        className="wishlist-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Danh sách sản phẩm yêu thích"
      >
        {/* Header Modal */}
        <div className="wishlist-modal-header">
          <div className="wishlist-modal-title">
            <span style={{ fontSize: '20px' }}>❤️</span>
            <h3 style={{ margin: 0, display: 'inline-block' }}>Sản Phẩm Yêu Thích ({danh_sach_noi_bo.length})</h3>
          </div>
          <div className="wishlist-header-actions">
            {danh_sach_noi_bo.length > 0 && (
              <button
                type="button"
                className="btn-clear-wishlist"
                onClick={xu_ly_xoa_tat_ca}
                title="Xóa tất cả sản phẩm khỏi danh sách yêu thích"
              >
                Xóa tất cả
              </button>
            )}
            <button
              type="button"
              className="btn-close-wishlist"
              onClick={onDong}
              aria-label="Đóng cửa sổ"
              title="Đóng"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body Modal */}
        <div className="wishlist-modal-body">
          {danh_sach_noi_bo.length === 0 ? (
            <div className="wishlist-empty" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div className="wishlist-empty-icon" style={{ fontSize: '52px', marginBottom: '14px' }}>🤍</div>
              <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Chưa có sản phẩm yêu thích nào</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', maxWidth: '380px', margin: '0 auto 18px' }}>
                Hãy bấm vào biểu tượng trái tim (❤️) trên thẻ sản phẩm để lưu lại những món đồ bạn quan tâm nhé!
              </p>
              <button
                type="button"
                className="btn-wishlist-explore"
                onClick={xu_ly_kham_pha}
              >
                Khám phá sản phẩm ngay →
              </button>
            </div>
          ) : (
            <div className="wishlist-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {danh_sach_noi_bo.map((sp, index) => {
                if (!sp) return null;
                const sp_obj = typeof sp === 'object' ? sp : { id: sp, ten_san_pham: `Sản phẩm #${sp}` };
                const het_hang = Number(sp_obj.so_luong_ton || 0) <= 0;
                const anh_hien_thi = sp_obj.anh_chinh || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%23f1f5f9" width="80" height="80"/><text fill="%2394a3b8" font-family="sans-serif" font-size="10" dy="45" dx="20">No Image</text></svg>';

                return (
                  <div key={sp_obj.id || index} className="wishlist-item-card">
                    <img
                      src={anh_hien_thi}
                      alt={sp_obj.ten_san_pham}
                      className="wishlist-item-thumb"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%23f1f5f9" width="80" height="80"/><text fill="%2394a3b8" font-family="sans-serif" font-size="10" dy="45" dx="20">No Image</text></svg>';
                      }}
                      onClick={() => xu_ly_xem_chi_tiet(sp_obj)}
                      title="Bấm xem chi tiết sản phẩm"
                    />

                    <div className="wishlist-item-info">
                      {sp_obj.thuong_hieu && (
                        <div className="wishlist-item-meta" style={{ fontSize: '11.5px', color: 'var(--color-primary)', fontWeight: '600', marginBottom: '2px' }}>
                          {sp_obj.thuong_hieu}
                        </div>
                      )}
                      <h4
                        className="wishlist-item-title"
                        onClick={() => xu_ly_xem_chi_tiet(sp_obj)}
                        title={sp_obj.ten_san_pham}
                        style={{ margin: '0 0 4px', fontSize: '14.5px', fontWeight: '600' }}
                      >
                        {sp_obj.ten_san_pham}
                      </h4>
                      <div className="wishlist-item-price-row">
                        <span className="wishlist-item-price" style={{ color: '#2563eb', fontWeight: '700' }}>
                          {dinh_dang_tien(sp_obj.gia)}
                        </span>
                        {sp_obj.gia_goc && Number(sp_obj.gia_goc) > Number(sp_obj.gia) && (
                          <span className="wishlist-item-original-price">
                            {dinh_dang_tien(sp_obj.gia_goc)}
                          </span>
                        )}
                        <span className={`wishlist-stock-tag ${het_hang ? 'tag-out' : 'tag-in'}`}>
                          {het_hang ? 'Tạm hết' : 'Còn hàng'}
                        </span>
                      </div>
                    </div>

                    <div className="wishlist-item-actions">
                      <button
                        type="button"
                        className="wishlist-btn-view"
                        onClick={() => xu_ly_xem_chi_tiet(sp_obj)}
                        title="Xem trang chi tiết sản phẩm"
                      >
                        👁️ Xem
                      </button>

                      <button
                        type="button"
                        className="wishlist-btn-cart"
                        disabled={het_hang}
                        onClick={(e) => xu_ly_them_gio(e, sp_obj)}
                        title={het_hang ? 'Sản phẩm tạm thời hết hàng' : 'Thêm vào giỏ hàng'}
                      >
                        {het_hang ? 'Hết hàng' : '+ Giỏ hàng'}
                      </button>

                      <button
                        type="button"
                        className="wishlist-btn-remove"
                        onClick={(e) => xu_ly_xoa_khoi_wishlist(e, sp_obj.id)}
                        title="Xóa khỏi danh sách yêu thích"
                      >
                        🗑️ Bỏ thích
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
