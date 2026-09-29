import React from 'react';
import LocTheoDanhMuc from './loc_theo_danh_muc';
import LocTheoGia from './loc_theo_gia';
import LocTheoThuongHieu from './loc_theo_thuong_hieu';

export default function LocSanPham({
  danh_muc_list = [],
  danh_sach_thuong_hieu = [],
  bo_loc_hien_tai = {},
  on_thay_doi_bo_loc,
  on_dat_lai_bo_loc
}) {
  return (
    <aside
      className="bo-loc-san-pham"
      data-testid="bo-loc-san-pham"
      style={{
        backgroundColor: '#ffffff',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>
          Bộ lọc tìm kiếm
        </h3>
        {on_dat_lai_bo_loc && (
          <button
            type="button"
            data-testid="nut-dat-lai-bo-loc"
            onClick={on_dat_lai_bo_loc}
            style={{
              background: 'none',
              border: 'none',
              color: '#ef4444',
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Đặt lại
          </button>
        )}
      </div>

      {/* Loc theo danh muc */}
      <LocTheoDanhMuc
        danh_muc_list={danh_muc_list}
        danh_muc_dang_chon={bo_loc_hien_tai.danh_muc_id}
        on_chon_danh_muc={(id) => on_thay_doi_bo_loc({ ...bo_loc_hien_tai, danh_muc_id: id, trang: 1 })}
      />

      {/* Loc theo gia */}
      <LocTheoGia
        gia_tu_khoi_tao={bo_loc_hien_tai.gia_tu}
        gia_den_khoi_tao={bo_loc_hien_tai.gia_den}
        on_ap_dung_gia={(tu, den) => on_thay_doi_bo_loc({ ...bo_loc_hien_tai, gia_tu: tu, gia_den: den, trang: 1 })}
      />

      {/* Loc theo thuong hieu */}
      <LocTheoThuongHieu
        danh_sach_thuong_hieu={danh_sach_thuong_hieu}
        thuong_hieu_dang_chon={bo_loc_hien_tai.thuong_hieu}
        on_chon_thuong_hieu={(th) => on_thay_doi_bo_loc({ ...bo_loc_hien_tai, thuong_hieu: th, trang: 1 })}
      />
    </aside>
  );
}