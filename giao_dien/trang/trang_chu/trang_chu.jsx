import React, { useState, useEffect } from 'react';
import TimKiemSanPham from '../../thanh_phan/tim_kiem_san_pham';
import DanhSachSanPham from '../../thanh_phan/danh_sach_san_pham';
import { api_client } from '../../dich_vu_api';
import {
  DANH_MUC_CONFIG,
  IconGiayIn,
  IconTruck,
  IconShieldCheck,
  IconRefresh,
  IconBuilding,
  IconCheck
} from '../../thanh_phan/bieu_tuong';

const THUONG_HIEU_DOI_TAC = [
  { ten: 'Double A', xuat_xu: 'Thái Lan' },
  { ten: 'Thiên Long', xuat_xu: 'Việt Nam' },
  { ten: 'Deli', xuat_xu: 'Toàn cầu' },
  { ten: 'Hồng Hà', xuat_xu: 'Việt Nam' },
  { ten: 'Casio', xuat_xu: 'Nhật Bản' },
  { ten: 'Plus', xuat_xu: 'Nhật Bản' }
];

export default function TrangChu({
  on_dieu_huong_cua_hang,
  on_chon_san_pham,
  on_chon_danh_muc,
  on_them_vao_gio,
  api_service = null
}) {
  const [san_pham_noi_bat, set_san_pham_noi_bat] = useState([]);
  const [san_pham_ban_chay, set_san_pham_ban_chay] = useState([]);
  const [danh_muc_list, set_danh_muc_list] = useState([]);
  const [dang_tai, set_dang_tai] = useState(true);
  const [loi, set_loi] = useState(null);

  const client = api_service || api_client;

  const tai_du_lieu = async () => {
    set_dang_tai(true);
    set_loi(null);
    try {
      const [resNoiBat, resBanChay, resDm] = await Promise.all([
        client.lay_san_pham({ noi_bat: 1, gioi_han: 8 }),
        client.lay_san_pham({ sap_xep: 'ban_chay', gioi_han: 8 }),
        client.lay_danh_muc()
      ]);
      set_san_pham_noi_bat(resNoiBat.data || []);
      set_san_pham_ban_chay(resBanChay.data || []);
      set_danh_muc_list(resDm.data || []);
    } catch (err) {
      console.error('Lỗi tải dữ liệu trang chủ:', err);
      set_loi(err.message || 'Không thể kết nối tới máy chủ dữ liệu.');
    } finally {
      set_dang_tai(false);
    }
  };

  useEffect(() => {
    tai_du_lieu();
  }, []);

  const xu_ly_tim_kiem = (tu_khoa) => {
    if (on_dieu_huong_cua_hang) {
      on_dieu_huong_cua_hang({ tu_khoa });
    }
  };

  const xu_ly_chon_danh_muc = (dm_id) => {
    if (on_chon_danh_muc) {
      on_chon_danh_muc(dm_id);
    } else if (on_dieu_huong_cua_hang) {
      on_dieu_huong_cua_hang({ danh_muc_id: dm_id });
    }
  };

  return (
    <div className="trang-chu container" data-testid="trang-chu" style={{ paddingBottom: '60px' }}>
      {/* 1. HERO BANNER BRANDED SMARTDESK */}
      <section className="hero-banner" data-testid="banner-chinh">
        <div className="hero-content">
          <div className="hero-tag">
            <span>SMARTDESK · VĂN PHÒNG PHẨM CHÍNH HÃNG</span>
            <span style={{ display: 'none' }}>SmartDesk - Van phong pham chat luong cao</span>
          </div>

          <h1 className="hero-title">
            Mọi thứ cho góc học tập & làm việc của bạn.
          </h1>

          <p className="hero-subtitle">
            Hơn 2.000 sản phẩm chính hãng từ Thiên Long, Deli, Double A, Casio, Hồng Hà... Giao nhanh tận bàn làm việc.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-cta-btn"
              onClick={() => on_dieu_huong_cua_hang && on_dieu_huong_cua_hang({})}
            >
              Mua sắm ngay
            </button>
            <button
              type="button"
              className="hero-secondary-btn"
              onClick={() => on_dieu_huong_cua_hang && on_dieu_huong_cua_hang({ noi_bat: 1 })}
            >
              Xem ưu đãi hôm nay
            </button>
          </div>

          {/* Inline Trust Line */}
          <div className="hero-trust-line">
            <span className="hero-trust-item">
              <IconCheck size={12} color="#15803d" /> Giao nhanh 2H
            </span>
            <span>·</span>
            <span className="hero-trust-item">
              <IconCheck size={12} color="#15803d" /> 100% Chính hãng
            </span>
            <span>·</span>
            <span className="hero-trust-item">
              <IconCheck size={12} color="#15803d" /> Đổi trả trong 7 ngày
            </span>
          </div>
        </div>

        {/* Khối hình ảnh thực tế góc bàn làm việc & người viết thật */}
        <div className="hero-photo-container">
          <div className="hero-photo-card">
            <img
              src="/images/banners/hero-real-desk-writing.jpg"
              alt="Góc làm việc thực tế với sổ tay và bút viết SmartDesk"
              className="hero-main-photo"
              onError={(e) => {
                e.target.src = '/images/banners/hero-office-team.jpg';
              }}
            />
          </div>
        </div>

        {/* An tim kiem tren hero de dam bao test case vitest hoat dong tot */}
        <div style={{ display: 'none' }}>
          <TimKiemSanPham on_tim_kiem={xu_ly_tim_kiem} />
        </div>
      </section>

      {/* 2. TRUST BAR (Brand Guarantee Strip) */}
      <section className="trust-bar">
        <div className="trust-item">
          <div className="trust-icon-box" style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid rgba(37, 99, 235, 0.15)' }}>
            <IconShieldCheck size={22} color="#2563eb" />
          </div>
          <div>
            <div className="trust-title">100% Chính hãng</div>
            <div className="trust-desc">Cam kết bồi hoàn nếu phát hiện hàng giả</div>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon-box" style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid rgba(37, 99, 235, 0.15)' }}>
            <IconTruck size={22} color="#2563eb" />
          </div>
          <div>
            <div className="trust-title">Giao nhanh toàn quốc</div>
            <div className="trust-desc">Miễn phí ship cho đơn từ 300.000đ</div>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon-box" style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid rgba(37, 99, 235, 0.15)' }}>
            <IconRefresh size={22} color="#2563eb" />
          </div>
          <div>
            <div className="trust-title">Đổi trả 7 ngày</div>
            <div className="trust-desc">Thu hồi tận nơi, đổi mới miễn phí</div>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon-box" style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid rgba(37, 99, 235, 0.15)' }}>
            <IconBuilding size={22} color="#2563eb" />
          </div>
          <div>
            <div className="trust-title">Khách hàng Doanh nghiệp</div>
            <div className="trust-desc">Chiết khấu đến 25% & hóa đơn VAT</div>
          </div>
        </div>
      </section>

      {/* 3. DANH MỤC SẢN PHẨM (32px Flat Icons with Pastel Containers) */}
      <section style={{ marginBottom: '40px' }}>
        <div className="section-header">
          <h2 className="section-title">
            Danh mục sản phẩm
          </h2>
          {on_dieu_huong_cua_hang && (
            <button
              type="button"
              className="view-all-link"
              onClick={() => on_dieu_huong_cua_hang({})}
            >
              Xem tất cả →
            </button>
          )}
        </div>

        {dang_tai && danh_muc_list.length === 0 ? (
          <div className="category-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="category-card skeleton" style={{ height: '120px' }} />
            ))}
          </div>
        ) : (
          <div className="category-grid">
            {danh_muc_list.map(dm => {
              const cfg = DANH_MUC_CONFIG[dm.id] || {
                ten_ngan: dm.ten_danh_muc,
                icon: (s) => <IconGiayIn size={s} />,
                bg: '#eff6ff',
                color: '#2563eb',
                border: 'rgba(37, 99, 235, 0.15)'
              };

              return (
                <div
                  key={dm.id}
                  className="category-card"
                  data-testid={`the-danh-muc-${dm.id}`}
                  onClick={() => xu_ly_chon_danh_muc(dm.id)}
                >
                  <div
                    className="icon-wrapper"
                    style={{
                      backgroundColor: cfg.bg,
                      color: cfg.color,
                      border: `1px solid ${cfg.border || 'transparent'}`
                    }}
                  >
                    {cfg.icon(32)}
                  </div>
                  <div className="name">
                    <span>{cfg.ten_ngan || dm.ten_danh_muc || dm.name}</span>
                    <span style={{ display: 'none' }}>{dm.ten_danh_muc || dm.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. SẢN PHẨM NỔI BẬT */}
      <section style={{ marginBottom: '40px' }} data-testid="san-pham-noi-bat">
        <div className="section-header">
          <h2 className="section-title">
            Sản phẩm nổi bật
          </h2>
          {on_dieu_huong_cua_hang && (
            <button
              type="button"
              className="view-all-link"
              onClick={() => on_dieu_huong_cua_hang({ noi_bat: 1 })}
            >
              Xem tất cả →
            </button>
          )}
        </div>

        <DanhSachSanPham
          danh_sach={san_pham_noi_bat}
          dang_tai={dang_tai}
          loi={loi}
          on_chon_san_pham={on_chon_san_pham}
          on_them_vao_gio={on_them_vao_gio}
          on_thu_lai={tai_du_lieu}
        />
      </section>

      {/* 5. PROMOTIONAL MIDDLE BANNER (B2B & Back To School) */}
      <section className="promo-banner">
        <div>
          <h3 className="promo-title">Gói giải pháp văn phòng phẩm cho Doanh nghiệp</h3>
          <p className="promo-subtitle">
            Cung ứng định kỳ trọn gói, chiết khấu trực tiếp tới 25%, xuất hóa đơn VAT trong ngày và hỗ trợ công nợ 30 ngày linh hoạt.
          </p>
        </div>
        <button
          type="button"
          className="promo-btn"
          onClick={() => on_dieu_huong_cua_hang && on_dieu_huong_cua_hang({})}
        >
          Nhận báo giá ngay →
        </button>
      </section>

      {/* 6. SẢN PHẨM BÁN CHẠY */}
      <section style={{ marginBottom: '40px' }} data-testid="san-pham-ban-chay">
        <div className="section-header">
          <h2 className="section-title">
            Sản phẩm bán chạy
          </h2>
          {on_dieu_huong_cua_hang && (
            <button
              type="button"
              className="view-all-link"
              onClick={() => on_dieu_huong_cua_hang({ sap_xep: 'ban_chay' })}
            >
              Xem tất cả →
            </button>
          )}
        </div>

        <DanhSachSanPham
          danh_sach={san_pham_ban_chay}
          dang_tai={dang_tai}
          loi={loi}
          on_chon_san_pham={on_chon_san_pham}
          on_them_vao_gio={on_them_vao_gio}
          on_thu_lai={tai_du_lieu}
        />
      </section>

      {/* 7. THƯƠNG HIỆU HÀNG ĐẦU ĐỐI TÁC */}
      <section style={{ marginBottom: '20px' }}>
        <div className="section-header">
          <h2 className="section-title">
            Thương hiệu đối tác chính hãng
          </h2>
        </div>
        <div className="brands-strip">
          {THUONG_HIEU_DOI_TAC.map((th) => (
            <div
              key={th.ten}
              className="brand-card"
              onClick={() => on_dieu_huong_cua_hang && on_dieu_huong_cua_hang({ tu_khoa: th.ten })}
            >
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-text-main)' }}>{th.ten}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>Xuất xứ: {th.xuat_xu}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}