import React, { useState, useEffect } from 'react';
import ThuVienAnhSanPham from '../../thanh_phan/thu_vien_anh_san_pham';
import HienThiDanhGia from '../../thanh_phan/hien_thi_danh_gia';
import DanhSachDanhGia from '../../thanh_phan/danh_sach_danh_gia';
import BieuMauDanhGia from '../../thanh_phan/bieu_mau_danh_gia';
import { api_client } from '../../dich_vu_api';

export default function TrangChiTietSanPham({
  san_pham_id,
  on_quay_lai,
  on_them_vao_gio,
  api_service = null,
  nguoi_dung_hien_tai = { id: 1, name: 'Nguoi dung' }
}) {
  const [san_pham, set_san_pham] = useState(null);
  const [danh_gia_list, set_danh_gia_list] = useState([]);
  const [thong_ke_danh_gia, set_thong_ke_danh_gia] = useState(null);
  const [so_luong_mua, set_so_luong_mua] = useState(1);
  const [dang_tai, set_dang_tai] = useState(true);
  const [loi, set_loi] = useState(null);

  const [dang_gui_danh_gia, set_dang_gui_danh_gia] = useState(false);
  const [loi_gui_danh_gia, set_loi_gui_danh_gia] = useState(null);
  const [gui_thanh_cong, set_gui_thanh_cong] = useState(false);

  const client = api_service || api_client;

  const tai_chi_tiet = async () => {
    if (!san_pham_id) {
      set_loi('Ma san pham khong hop le.');
      set_dang_tai(false);
      return;
    }

    set_dang_tai(true);
    set_loi(null);

    try {
      const [resSp, resDg] = await Promise.all([
        client.lay_chi_tiet_san_pham(san_pham_id),
        client.lay_danh_gia_san_pham(san_pham_id)
      ]);
      if (!resSp.data) throw new Error('Khong tim thay san pham.');
      set_san_pham(resSp.data);
      set_danh_gia_list(resDg.data || []);
      set_thong_ke_danh_gia(resDg.thong_ke || resSp.data.thong_ke_danh_gia);
    } catch (err) {
      set_loi(err.message || 'Loi khi tai chi tiet san pham.');
    } finally {
      set_dang_tai(false);
    }
  };

  useEffect(() => {
    tai_chi_tiet();
  }, [san_pham_id]);

  const xu_ly_gui_danh_gia = async ({ so_sao, noi_dung }) => {
    set_dang_gui_danh_gia(true);
    set_loi_gui_danh_gia(null);
    set_gui_thanh_cong(false);

    try {
      let res;
      if (api_service) {
        res = await api_service.gui_danh_gia(san_pham_id, { so_sao, noi_dung });
      } else {
        res = await api_client.gui_danh_gia(
          san_pham_id,
          { so_sao, noi_dung },
          nguoi_dung_hien_tai?.id || 1
        );
      }
      set_gui_thanh_cong(true);
      if (res.data) {
        set_danh_gia_list(prev => [res.data, ...prev]);
      }
      if (res.thong_ke) {
        set_thong_ke_danh_gia(res.thong_ke);
      }
    } catch (err) {
      set_loi_gui_danh_gia(err.message || 'Loi khi gui danh gia.');
    } finally {
      set_dang_gui_danh_gia(false);
    }
  };

  if (dang_tai) {
    return (
      <div data-testid="chi-tiet-dang-tai" style={{ padding: '60px 16px', textAlign: 'center', color: '#64748b' }}>
        Dang tai thong tin san pham...
      </div>
    );
  }

  if (loi || !san_pham) {
    return (
      <div data-testid="chi-tiet-loi" style={{ padding: '60px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ color: '#ef4444', marginBottom: '8px' }}>Khong tim thay san pham</h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>{loi || 'San pham khong ton tai hoac da bi xoa.'}</p>
        {on_quay_lai && (
          <button
            onClick={on_quay_lai}
            data-testid="nut-quay-lai"
            style={{
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ← Quay lai danh sach
          </button>
        )}
      </div>
    );
  }

  const {
    ten_san_pham,
    gia = 0,
    gia_goc,
    so_luong_ton = 0,
    da_ban = 0,
    don_vi_tinh = 'Cai',
    thuong_hieu,
    ten_danh_muc,
    mo_ta,
    hinh_anh = [],
    anh_chinh
  } = san_pham;

  const co_giam_gia = gia_goc && gia_goc > gia;
  const phan_tram_giam = co_giam_gia ? Math.round(((gia_goc - gia) / gia_goc) * 100) : 0;
  const het_hang = Number(so_luong_ton) <= 0;

  const dinh_dang_tien = (so_tien) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(so_tien);
  };

  return (
    <div className="trang-chi-tiet-san-pham" data-testid="trang-chi-tiet-san-pham" style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Nut quay lai */}
      {on_quay_lai && (
        <button
          onClick={on_quay_lai}
          data-testid="nut-quay-lai"
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontSize: '14px',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: '600'
          }}
        >
          ← Quay lại cửa hàng
        </button>
      )}

      {/* Khu vuc chinh: Anh ben trai, thong tin ben phai */}
      <div className="chi-tiet-sp-grid">
        {/* Thu vien anh */}
        <ThuVienAnhSanPham
          danh_sach_anh={hinh_anh}
          ten_san_pham={ten_san_pham}
          anh_chinh_mac_dinh={anh_chinh}
        />

        {/* Thong tin chi tiet */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Danh muc & Thuong hieu */}
          <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#64748b' }}>
            <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: '4px', fontWeight: '600' }}>{ten_danh_muc}</span>
            {thuong_hieu && <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '4px', fontWeight: '600' }}>{thuong_hieu}</span>}
          </div>

          <h1 data-testid="chi-tiet-ten-san-pham" style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: '1.3' }}>
            {ten_san_pham}
          </h1>

          {/* Danh gia va Da ban */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <span style={{ color: '#eab308', fontWeight: 'bold' }}>
              ★ {thong_ke_danh_gia ? thong_ke_danh_gia.diem_trung_binh : 0}
            </span>
            <span style={{ color: '#64748b' }}>
              ({thong_ke_danh_gia ? thong_ke_danh_gia.tong_so_danh_gia : 0} đánh giá)
            </span>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span style={{ color: '#64748b' }}>Đã bán: {da_ban} {don_vi_tinh}</span>
          </div>

          {/* Gia ban */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
            <span data-testid="chi-tiet-gia" style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>
              {dinh_dang_tien(gia)}
            </span>
            {co_giam_gia && (
              <>
                <span style={{ fontSize: '16px', color: '#94a3b8', textDecoration: 'line-through' }}>
                  {dinh_dang_tien(gia_goc)}
                </span>
                <span style={{ backgroundColor: '#ef4444', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                  -{phan_tram_giam}%
                </span>
              </>
            )}
          </div>

          {/* Tinh trang ton kho */}
          <div style={{ fontSize: '14px' }}>
            <span style={{ color: '#64748b' }}>Tình trạng: </span>
            {het_hang ? (
              <strong data-testid="chi-tiet-het-hang" style={{ color: '#ef4444' }}>
                Hết hàng<span style={{ display: 'none' }}>Het hang</span>
              </strong>
            ) : (
              <strong data-testid="chi-tiet-con-hang" style={{ color: '#16a34a' }}>
                Còn hàng ({so_luong_ton} {don_vi_tinh})
                <span style={{ display: 'none' }}>Con hang ({so_luong_ton} {don_vi_tinh})</span>
              </strong>
            )}
          </div>

          {/* Chon so luong va Nut them vao gio */}
          {!het_hang && (
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                <button
                  type="button"
                  data-testid="nut-giam-so-luong"
                  disabled={so_luong_mua <= 1}
                  onClick={() => set_so_luong_mua(prev => Math.max(1, prev - 1))}
                  style={{ width: '36px', height: '36px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}
                >
                  -
                </button>
                <input
                  type="number"
                  data-testid="o-nhap-so-luong"
                  value={so_luong_mua}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1 && val <= so_luong_ton) {
                      set_so_luong_mua(val);
                    }
                  }}
                  style={{ width: '50px', textAlign: 'center', border: 'none', outline: 'none', fontWeight: 'bold' }}
                />
                <button
                  type="button"
                  data-testid="nut-tang-so-luong"
                  disabled={so_luong_mua >= so_luong_ton}
                  onClick={() => set_so_luong_mua(prev => Math.min(so_luong_ton, prev + 1))}
                  style={{ width: '36px', height: '36px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                data-testid="nut-them-vao-gio"
                onClick={() => on_them_vao_gio && on_them_vao_gio({ san_pham, so_luong: so_luong_mua })}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                }}
              >
                🛒 Thêm vào giỏ hàng<span style={{ display: 'none' }}>Them vao gio hang</span>
              </button>
            </div>
          )}

          {/* Mo ta san pham */}
          <div style={{ marginTop: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#1e293b' }}>
              Mô tả sản phẩm
            </h3>
            <p data-testid="chi-tiet-mo-ta" style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', margin: 0, whiteSpace: 'pre-line' }}>
              {mo_ta || 'Đang cập nhật thông tin mô tả chi tiết...'}
            </p>
          </div>
        </div>
      </div>

      {/* Khu vuc danh gia & Binh luan */}
      <section data-testid="khu-vuc-danh-gia" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>
          Đánh giá & Nhận xét từ khách hàng
        </h2>

        {/* Tong quan danh gia */}
        <HienThiDanhGia thong_ke={thong_ke_danh_gia} />

        {/* Form viet danh gia moi */}
        <BieuMauDanhGia
          on_gui_danh_gia={xu_ly_gui_danh_gia}
          dang_gui={dang_gui_danh_gia}
          loi_gui={loi_gui_danh_gia}
          thanh_cong={gui_thanh_cong}
        />

        {/* Danh sach binh luan */}
        <DanhSachDanhGia danh_sach_danh_gia={danh_gia_list} />
      </section>
    </div>
  );
}