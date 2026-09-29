import React, { useState } from 'react';

export default function BannerLaVai({
  on_dieu_huong_cua_hang,
  on_chuyen_trang
}) {
  const [hien_la_trai, set_hien_la_trai] = useState(true);
  const [hien_la_phai, set_hien_la_phai] = useState(true);

  const xu_ly_click_trai = (e) => {
    e.stopPropagation();
    if (on_dieu_huong_cua_hang) {
      on_dieu_huong_cua_hang({ noi_bat: 1 });
    }
  };

  const xu_ly_click_phai = (e) => {
    e.stopPropagation();
    if (on_chuyen_trang) {
      on_chuyen_trang('doanh_nghiep');
    } else if (on_dieu_huong_cua_hang) {
      on_dieu_huong_cua_hang({});
    }
  };

  if (!hien_la_trai && !hien_la_phai) {
    return null;
  }

  return (
    <aside className="fabric-banners-container" aria-label="Cặp lá vải phướn rộng quảng bá 2 bên">
      {/* 1. LÁ VẢI ĐẠI BÊN TRÁI - ĐỎ GẤM THÊU VÀNG (MÙA HỌC TẬP & LÀM VIỆC) */}
      {hien_la_trai && (
        <div
          className="fabric-pennant-item fabric-pennant-left"
          data-testid="la-vai-trai"
          onClick={xu_ly_click_trai}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') xu_ly_click_trai(e); }}
          title="Ưu đãi Mùa Học Tập & Làm Việc - Giảm đến 35%"
        >
          {/* Dây treo & Nẹp gỗ vàng kim trên cùng */}
          <div className="fabric-hanging-mount">
            <div className="fabric-mount-string" />
            <div className="fabric-mount-rod">
              <span className="fabric-rod-cap cap-left" />
              <button
                type="button"
                className="fabric-close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  set_hien_la_trai(false);
                }}
                title="Đóng lá vải này"
                aria-label="Đóng lá vải trái"
              >
                ✕
              </button>
              <span className="fabric-rod-cap cap-right" />
            </div>
          </div>

          {/* Thân cờ lá vải dáng rộng bề thế */}
          <div className="fabric-body fabric-body-red">
            {/* Phù hiệu khuyên tròn đỉnh cờ */}
            <div className="fabric-rosette fabric-rosette-gold">
              <span style={{ fontSize: '14px' }}>★</span>
              <span>SIÊU SALE</span>
            </div>

            {/* Khối ưu đãi giảm giá */}
            <div className="fabric-headline">
              <div className="fabric-label-gold">GIẢM ĐẾN</div>
              <div className="fabric-big-number">35%</div>
            </div>

            {/* Nội dung danh mục chữ đứng */}
            <div className="fabric-text-stack">
              <span>BÚT VIẾT</span>
              <span>& SỔ TAY</span>
            </div>

            {/* Đường chỉ vàng ngăn cách sang trọng */}
            <div className="fabric-divider-gold">
              <span>✦ ✦ ✦ ✦ ✦</span>
            </div>

            {/* Danh sách nhóm sản phẩm nổi bật */}
            <div className="fabric-feature-list">
              <div className="fabric-feature-row">
                <span className="feature-bullet">✓</span>
                <span>Thiên Long & Deli</span>
              </div>
              <div className="fabric-feature-row">
                <span className="feature-bullet">✓</span>
                <span>Sổ tay Hồng Hà</span>
              </div>
              <div className="fabric-feature-row">
                <span className="feature-bullet">✓</span>
                <span>Máy tính Casio chính hãng</span>
              </div>
            </div>

            {/* Cam kết dịch vụ nhanh */}
            <div className="fabric-trust-pills">
              <span className="fabric-pill">⚡ Giao nhanh 2H</span>
              <span className="fabric-pill">🛡️ 100% Chính hãng</span>
            </div>

            {/* Khối voucher ưu đãi */}
            <div className="fabric-coupon-tag">
              <small>MÃ GIẢM GIÁ</small>
              <strong>SMART35</strong>
              <span className="coupon-subtext">Đơn từ 150.000đ</span>
            </div>

            {/* Nút hành động đuôi cờ */}
            <div className="fabric-cta-action">
              <span>Săn deal ngay ↓</span>
            </div>

            {/* Tua rua vàng chân cờ */}
            <div className="fabric-fringe fabric-fringe-gold">
              <span>♦ ♦ ♦ ♦ ♦</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. LÁ VẢI ĐẠI BÊN PHẢI - XANH SAPPHIRE THÊU BẠC (DOANH NGHIỆP B2B) */}
      {hien_la_phai && (
        <div
          className="fabric-pennant-item fabric-pennant-right"
          data-testid="la-vai-phai"
          onClick={xu_ly_click_phai}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') xu_ly_click_phai(e); }}
          title="Khách hàng Doanh nghiệp - Chiết khấu 25% & Hóa đơn VAT"
        >
          {/* Dây treo & Nẹp gỗ vàng kim trên cùng */}
          <div className="fabric-hanging-mount">
            <div className="fabric-mount-string" />
            <div className="fabric-mount-rod">
              <span className="fabric-rod-cap cap-left" />
              <button
                type="button"
                className="fabric-close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  set_hien_la_phai(false);
                }}
                title="Đóng lá vải này"
                aria-label="Đóng lá vải phải"
              >
                ✕
              </button>
              <span className="fabric-rod-cap cap-right" />
            </div>
          </div>

          {/* Thân cờ lá vải dáng rộng bề thế */}
          <div className="fabric-body fabric-body-blue">
            {/* Phù hiệu khuyên tròn đỉnh cờ */}
            <div className="fabric-rosette fabric-rosette-blue">
              <span style={{ fontSize: '15px' }}>🏢</span>
              <span>B2B VIP</span>
            </div>

            {/* Khối ưu đãi giảm giá */}
            <div className="fabric-headline">
              <div className="fabric-label-blue">CHIẾT KHẤU</div>
              <div className="fabric-big-number">25%</div>
            </div>

            {/* Nội dung danh mục chữ đứng */}
            <div className="fabric-text-stack">
              <span>VĂN PHÒNG</span>
              <span>DOANH NGHIỆP</span>
            </div>

            {/* Đường chỉ bạc ngăn cách sang trọng */}
            <div className="fabric-divider-gold fabric-divider-blue">
              <span>✦ ✦ ✦ ✦ ✦</span>
            </div>

            {/* Danh sách nhóm sản phẩm nổi bật */}
            <div className="fabric-feature-list">
              <div className="fabric-feature-row">
                <span className="feature-bullet feature-bullet-blue">✓</span>
                <span>Giấy Double A A4 giá sỉ</span>
              </div>
              <div className="fabric-feature-row">
                <span className="feature-bullet feature-bullet-blue">✓</span>
                <span>Bìa còng & File Deli</span>
              </div>
              <div className="fabric-feature-row">
                <span className="feature-bullet feature-bullet-blue">✓</span>
                <span>Băng keo & Đóng gói</span>
              </div>
            </div>

            {/* Cam kết dịch vụ nhanh */}
            <div className="fabric-trust-pills">
              <span className="fabric-pill fabric-pill-blue">📄 Hóa đơn VAT 0H</span>
              <span className="fabric-pill fabric-pill-blue">🚚 Free ship toàn quốc</span>
            </div>

            {/* Khối dịch vụ hợp đồng sỉ */}
            <div className="fabric-coupon-tag fabric-vat-tag">
              <small>HỢP ĐỒNG DOANH NGHIỆP</small>
              <strong>BÁO GIÁ 15 PHÚT</strong>
              <span className="coupon-subtext" style={{ color: '#bfdbfe' }}>Chiết khấu tối đa 25%</span>
            </div>

            {/* Nút hành động đuôi cờ */}
            <div className="fabric-cta-action fabric-cta-blue">
              <span>Nhận báo giá ↓</span>
            </div>

            {/* Tua rua bạc chân cờ */}
            <div className="fabric-fringe fabric-fringe-blue">
              <span>♦ ♦ ♦ ♦ ♦</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
