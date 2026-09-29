import React, { useState, useEffect } from 'react';
import TimKiemSanPham from '../../thanh_phan/tim_kiem_san_pham';
import SapXepSanPham from '../../thanh_phan/sap_xep_san_pham';
import LocSanPham from '../../thanh_phan/loc_san_pham';
import DanhSachSanPham from '../../thanh_phan/danh_sach_san_pham';
import { api_client } from '../../dich_vu_api';

export default function TrangCuaHang({
  bo_loc_khoi_tao = {},
  on_chon_san_pham,
  on_them_vao_gio,
  api_service = null
}) {
  const [bo_loc, set_bo_loc] = useState({
    danh_muc_id: bo_loc_khoi_tao.danh_muc_id || null,
    tu_khoa: bo_loc_khoi_tao.tu_khoa || '',
    gia_tu: bo_loc_khoi_tao.gia_tu || '',
    gia_den: bo_loc_khoi_tao.gia_den || '',
    thuong_hieu: bo_loc_khoi_tao.thuong_hieu || '',
    sap_xep: bo_loc_khoi_tao.sap_xep || 'moi_nhat',
    trang: bo_loc_khoi_tao.trang || 1,
    gioi_han: 12
  });

  const [danh_muc_list, set_danh_muc_list] = useState([]);
  const [danh_sach_thuong_hieu, set_danh_sach_thuong_hieu] = useState([]);
  const [danh_sach_san_pham, set_danh_sach_san_pham] = useState([]);
  const [phan_trang, set_phan_trang] = useState(null);
  const [dang_tai, set_dang_tai] = useState(true);
  const [loi, set_loi] = useState(null);

  const client = api_service || api_client;

  // Tai danh muc va thuong hieu mot lan
  useEffect(() => {
    const tai_bo_loc = async () => {
      try {
        const [resDm, resTh] = await Promise.all([
          client.lay_danh_muc(),
          client.lay_thuong_hieu()
        ]);
        set_danh_muc_list(resDm.data || []);
        set_danh_sach_thuong_hieu(resTh.data || []);
      } catch (e) {
        console.error('Lỗi tải danh mục / thương hiệu:', e);
      }
    };
    tai_bo_loc();
  }, []);

  // Tai danh sach san pham khi bo_loc thay doi
  const tai_san_pham = async () => {
    set_dang_tai(true);
    set_loi(null);
    try {
      const res = await client.lay_san_pham(bo_loc);
      set_danh_sach_san_pham(res.data || []);
      set_phan_trang(res.phan_trang || null);
    } catch (err) {
      console.error('Lỗi tải danh sách sản phẩm:', err);
      set_loi(err.message || 'Khong the tai danh sach san pham.');
    } finally {
      set_dang_tai(false);
    }
  };

  useEffect(() => {
    tai_san_pham();
  }, [bo_loc]);

  const xu_ly_tim_kiem = (tu_khoa) => {
    set_bo_loc(prev => ({ ...prev, tu_khoa, trang: 1 }));
  };

  const xu_ly_thay_doi_sap_xep = (sap_xep) => {
    set_bo_loc(prev => ({ ...prev, sap_xep, trang: 1 }));
  };

  const xu_ly_thay_doi_bo_loc = (bo_loc_moi) => {
    set_bo_loc(prev => ({
      ...prev,
      ...bo_loc_moi,
      trang: 1
    }));
  };

  const xu_ly_dat_lai_bo_loc = () => {
    set_bo_loc({
      danh_muc_id: null,
      tu_khoa: '',
      gia_tu: '',
      gia_den: '',
      thuong_hieu: '',
      sap_xep: 'moi_nhat',
      trang: 1,
      gioi_han: 12
    });
  };

  const xu_ly_chuyen_trang = (trang_moi) => {
    set_bo_loc(prev => ({ ...prev, trang: trang_moi }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="trang-cua-hang container" data-testid="trang-cua-hang" style={{ padding: '24px 16px 60px 16px' }}>
      {/* Breadcrumbs & Header Cua hang */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
          <span>Trang chủ</span> / <span style={{ color: '#0f172a', fontWeight: '600' }}>Cửa hàng SmartDesk</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>
            Cua hang SmartDesk
          </h1>
          <div style={{ fontSize: '14px', color: '#64748b' }}>
            Tim thay {phan_trang ? phan_trang.tong_so_muc : danh_sach_san_pham.length} san pham
          </div>
        </div>
      </div>

      {/* Thanh tim kiem & Thanh sap xep */}
      <div className="cua-hang-toolbar">
        <div style={{ flex: '1', minWidth: '260px' }}>
          <TimKiemSanPham
            on_tim_kiem={xu_ly_tim_kiem}
            gia_tri_khoi_tao={bo_loc.tu_khoa}
            goi_y="Tìm theo tên sản phẩm, thương hiệu..."
          />
        </div>
        <SapXepSanPham
          sap_xep_hien_tai={bo_loc.sap_xep}
          on_thay_doi_sap_xep={xu_ly_thay_doi_sap_xep}
        />
      </div>

      {/* Bo cuc 2 cot: Sidebar bo loc + Danh sach san pham */}
      <div className="cua-hang-layout">
        {/* Sidebar bo loc */}
        <aside className="cua-hang-sidebar">
          <LocSanPham
            danh_muc_list={danh_muc_list}
            danh_sach_thuong_hieu={danh_sach_thuong_hieu}
            bo_loc_hien_tai={bo_loc}
            on_thay_doi_bo_loc={xu_ly_thay_doi_bo_loc}
            on_dat_lai={xu_ly_dat_lai_bo_loc}
          />
        </aside>

        {/* Khu vuc san pham chinh */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <DanhSachSanPham
            danh_sach={danh_sach_san_pham}
            dang_tai={dang_tai}
            loi={loi}
            phan_trang={phan_trang}
            on_chuyen_trang={xu_ly_chuyen_trang}
            on_chon_san_pham={on_chon_san_pham}
            on_them_vao_gio={on_them_vao_gio}
            on_thu_lai={tai_san_pham}
          />
        </main>
      </div>
    </div>
  );
}