import React, { useState } from 'react';
import { IconStar } from './bieu_tuong';

const ANH_MAC_DINH = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect fill="%23f1f5f9" width="300" height="300"/><path d="M110 130 L150 90 L190 130 Z" fill="%23cbd5e1"/><rect x="130" y="130" width="40" height="60" fill="%23cbd5e1"/><text fill="%2394a3b8" font-family="sans-serif" font-size="14" dy="35" font-weight="600" x="50%" y="60%" text-anchor="middle">SmartDesk Product</text></svg>';

export default function TheSanPham({
  san_pham,
  on_chon_san_pham,
  on_them_vao_gio,
  la_yeu_thich,
  on_toggle_yeu_thich,
  dang_so_sanh,
  on_toggle_so_sanh
}) {
  const [anh_loi, set_anh_loi] = useState(false);
  const [cuc_bo_yeu_thich, set_cuc_bo_yeu_thich] = useState(() => {
    try {
      const stored = localStorage.getItem('smartdesk_wishlist');
      if (stored && san_pham) {
        const list = JSON.parse(stored);
        return list.some(item => (typeof item === 'object' ? item.id === san_pham.id : item === san_pham.id));
      }
    } catch (e) {}
    return false;
  });

  const [cuc_bo_so_sanh, set_cuc_bo_so_sanh] = useState(() => {
    try {
      const stored = localStorage.getItem('smartdesk_compare');
      if (stored && san_pham) {
        const list = JSON.parse(stored);
        return list.some(item => (typeof item === 'object' ? item.id === san_pham.id : item === san_pham.id));
      }
    } catch (e) {}
    return false;
  });

  const da_yeu_thich = la_yeu_thich !== undefined ? la_yeu_thich : cuc_bo_yeu_thich;
  const da_so_sanh = dang_so_sanh !== undefined ? dang_so_sanh : cuc_bo_so_sanh;

  const xu_ly_toggle_yeu_thich = (e) => {
    e.stopPropagation();
    if (on_toggle_yeu_thich) {
      on_toggle_yeu_thich(san_pham);
      return;
    }
    try {
      let list = [];
      const stored = localStorage.getItem('smartdesk_wishlist');
      if (stored) list = JSON.parse(stored);
      const index = list.findIndex(x => (typeof x === 'object' ? x.id === san_pham.id : x === san_pham.id));
      if (index >= 0) {
        list.splice(index, 1);
        set_cuc_bo_yeu_thich(false);
      } else {
        list.push(san_pham);
        set_cuc_bo_yeu_thich(true);
      }
      localStorage.setItem('smartdesk_wishlist', JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('smartdesk_wishlist_updated', { detail: list }));
    } catch (err) {}
  };

  const xu_ly_toggle_so_sanh = (e) => {
    e.stopPropagation();
    if (on_toggle_so_sanh) {
      on_toggle_so_sanh(san_pham);
      return;
    }
    try {
      let list = [];
      const stored = localStorage.getItem('smartdesk_compare');
      if (stored) list = JSON.parse(stored);
      const index = list.findIndex(x => (typeof x === 'object' ? x.id === san_pham.id : x === san_pham.id));
      if (index >= 0) {
        list.splice(index, 1);
        set_cuc_bo_so_sanh(false);
      } else {
        if (list.length >= 3) {
          alert('Bạn chỉ có thể so sánh tối đa 3 sản phẩm cùng lúc nhé!');
          return;
        }
        list.push(san_pham);
        set_cuc_bo_so_sanh(true);
      }
      localStorage.setItem('smartdesk_compare', JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('smartdesk_compare_updated', { detail: list }));
    } catch (err) {}
  };

  if (!san_pham) {
    return (
      <div className="empty-box" data-testid="the-san-pham-rong">
        <p>Không có dữ liệu sản phẩm<span style={{ display: 'none' }}>Khong co du lieu san pham</span></p>
      </div>
    );
  }

  const {
    id,
    ten_san_pham = 'Sản phẩm chưa có tên',
    gia = 0,
    gia_goc,
    so_luong_ton = 0,
    da_ban = 0,
    thuong_hieu,
    ten_danh_muc,
    diem_danh_gia = 0,
    so_luong_danh_gia = 0,
    noi_bat = 0,
    anh_chinh
  } = san_pham;

  const co_giam_gia = gia_goc && Number(gia_goc) > Number(gia);
  const phan_tram_giam = co_giam_gia ? Math.round(((gia_goc - gia) / gia_goc) * 100) : 0;
  const het_hang = Number(so_luong_ton) <= 0;

  const dinh_dang_tien = (so_tien) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(so_tien);
  };

  const xu_ly_click_the = (e) => {
    // Neu bam vao nut them gio thi khong kich hoat xem chi tiet
    if (e.target.closest('.product-btn-add')) {
      return;
    }
    if (on_chon_san_pham) {
      on_chon_san_pham(san_pham);
    }
  };

  const xu_ly_them_gio = (e) => {
    e.stopPropagation();
    if (on_them_vao_gio && !het_hang) {
      on_them_vao_gio({ san_pham, so_luong: 1 });
    }
  };

  return (
    <div
      className="product-card"
      data-testid={`the-san-pham-${id || 'unknown'}`}
      onClick={xu_ly_click_the}
    >
      {/* Nhom Badges o goc tren */}
      <div className="product-badge-group">
        {noi_bat ? <span className="badge-featured">Nổi bật</span> : null}
        {co_giam_gia && (
          <span className="badge-discount" data-testid="nhan-giam-gia">
            -{phan_tram_giam}%
          </span>
        )}
        {het_hang && (
          <span className="badge-out-of-stock" data-testid="nhan-het-hang">
            Hết hàng<span style={{ display: 'none' }}>Het hang</span>
          </span>
        )}
      </div>

      {/* Khung hinh anh ti le chuan 1:1 */}
      <div className="product-thumb-container">
        <button
          type="button"
          className={`btn-card-wishlist ${da_yeu_thich ? 'active' : ''}`}
          onClick={xu_ly_toggle_yeu_thich}
          title={da_yeu_thich ? 'Bỏ yêu thích' : 'Lưu vào danh sách yêu thích'}
          aria-label={da_yeu_thich ? 'Bỏ yêu thích' : 'Lưu vào danh sách yêu thích'}
        >
          {da_yeu_thich ? '❤️' : '🤍'}
        </button>

        <img
          src={anh_loi || !anh_chinh ? ANH_MAC_DINH : anh_chinh}
          alt={ten_san_pham}
          data-testid="anh-san-pham"
          className="product-thumb"
          loading="lazy"
          onError={() => set_anh_loi(true)}
        />
      </div>

      {/* Thong tin san pham */}
      <div className="product-body">
        {thuong_hieu && <div className="product-brand">{thuong_hieu}</div>}
        
        <h3
          className="product-name"
          data-testid="ten-san-pham"
          title={ten_san_pham}
        >
          {ten_san_pham}
        </h3>

        {/* Danh gia va so luong da ban */}
        <div className="product-meta">
          <div className="product-rating">
            <IconStar size={13} filled={true} />
            <span>{Number(diem_danh_gia || 0).toFixed(1)}</span>
            {so_luong_danh_gia > 0 && (
              <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>({so_luong_danh_gia})</span>
            )}
          </div>
          {da_ban > 0 && <span>Đã bán {da_ban}</span>}
        </div>

        {/* Khung gia tien */}
        <div className="product-price-box">
          <span className="product-price" data-testid="gia-hien-tai">
            {dinh_dang_tien(gia)}
          </span>
          {co_giam_gia && (
            <span className="product-original-price" data-testid="gia-goc">
              {dinh_dang_tien(gia_goc)}
            </span>
          )}
        </div>

        {/* Nhom nut thao tac: Them gio & So sanh */}
        <div className="product-card-actions-row">
          <button
            type="button"
            className="product-btn-add"
            data-testid="nut-them-nhanh"
            disabled={het_hang}
            onClick={xu_ly_them_gio}
          >
            {het_hang ? 'Tạm hết hàng' : 'Thêm vào giỏ'}
          </button>
          <button
            type="button"
            className={`product-btn-compare ${da_so_sanh ? 'active' : ''}`}
            onClick={xu_ly_toggle_so_sanh}
            title={da_so_sanh ? 'Bỏ chọn so sánh' : 'Chọn so sánh sản phẩm'}
            aria-label="So sánh sản phẩm"
          >
            ⚖️
          </button>
        </div>
      </div>
    </div>
  );
}