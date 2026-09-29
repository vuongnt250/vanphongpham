import React, { useState, useEffect } from 'react';
import api_client from '../../dich_vu_api';

export default function AdminDashboard({ on_ve_trang_chu }) {
  const [tab_hien_tai, set_tab_hien_tai] = useState('tong_quan'); // 'tong_quan' | 'san_pham' | 'danh_muc' | 'don_hang' | 'khach_hang' | 'ton_kho' | 'voucher' | 'nha_cung_cap' | 'banner'
  const [thong_ke, set_thong_ke] = useState(null);
  const [dang_tai, set_dang_tai] = useState(false);
  const [thong_bao, set_thong_bao] = useState('');

  // Du lieu cac tab
  const [danh_sach_sp, set_danh_sach_sp] = useState([]);
  const [danh_sach_dm, set_danh_sach_dm] = useState([]);
  const [danh_sach_dh, set_danh_sach_dh] = useState([]);
  const [danh_sach_kh, set_danh_sach_kh] = useState([]);
  const [danh_sach_kho, set_danh_sach_kho] = useState([]);
  const [danh_sach_vc, set_danh_sach_vc] = useState([]);
  const [danh_sach_ncc, set_danh_sach_ncc] = useState([]);
  const [danh_sach_bn, set_danh_sach_bn] = useState([]);
  const [danh_sach_ticket, set_danh_sach_ticket] = useState([]);
  const [thong_ke_ticket, set_thong_ke_ticket] = useState({ tong_so: 0, cho_xu_ly: 0, dang_xu_ly: 0, da_dong: 0 });
  const [ticket_dang_chon, set_ticket_dang_chon] = useState(null);
  const [noi_dung_tra_loi, set_noi_dung_tra_loi] = useState('');
  const [loc_trang_thai_ticket, set_loc_trang_thai_ticket] = useState('tat_ca');
  const [tim_kiem_ticket, set_tim_kiem_ticket] = useState('');
  const [dang_gui_tra_loi, set_dang_gui_tra_loi] = useState(false);

  // Modal / Form state
  const [modal_loai, set_modal_loai] = useState(null); // 'them_sp' | 'sua_sp' | 'them_dm' | 'nhap_kho' | 'them_vc' | 'them_ncc' | 'them_bn'
  const [doi_tuong_dang_sua, set_doi_tuong_dang_sua] = useState(null);

  // Form input fields
  const [form_data, set_form_data] = useState({});

  useEffect(() => {
    tai_tat_ca_du_lieu();
  }, []);

  const tai_tat_ca_du_lieu = async () => {
    set_dang_tai(true);
    try {
      const [resTk, resSp, resDm, resDh, resKh, resKho, resVc, resNcc, resBn, resTicket] = await Promise.all([
        api_client.lay_thong_ke_admin(),
        api_client.lay_san_pham({ limit: 100 }),
        api_client.lay_danh_muc(''),
        api_client.lay_don_hang_admin(),
        api_client.lay_khach_hang_admin(),
        api_client.lay_kho_admin({ gioi_han: 50 }),
        api_client.lay_voucher_admin(),
        api_client.lay_nha_cung_cap_admin(),
        api_client.lay_banner_admin(),
        api_client.lay_danh_sach_ticket_admin().catch(() => ({ success: false }))
      ]);

      if (resTk.success) set_thong_ke(resTk.du_lieu);
      if (resSp.success) set_danh_sach_sp(resSp.data || []);
      if (resDm.success) set_danh_sach_dm(resDm.data || []);
      if (resDh.success) set_danh_sach_dh(resDh.du_lieu || []);
      if (resKh.success) set_danh_sach_kh(resKh.du_lieu || []);
      if (resKho.success) set_danh_sach_kho(resKho.du_lieu || []);
      if (resVc.success) set_danh_sach_vc(resVc.du_lieu || []);
      if (resNcc.success) set_danh_sach_ncc(resNcc.du_lieu || []);
      if (resBn.success) set_danh_sach_bn(resBn.du_lieu || []);
      if (resTicket?.success) {
        set_danh_sach_ticket(resTicket.du_lieu || []);
        if (resTicket.thong_ke) set_thong_ke_ticket(resTicket.thong_ke);
        if (resTicket.du_lieu && resTicket.du_lieu.length > 0) {
          set_ticket_dang_chon(prev => prev ? (resTicket.du_lieu.find(x => x.id === prev.id) || resTicket.du_lieu[0]) : resTicket.du_lieu[0]);
        }
      }
    } catch (err) {
      console.error('Loi tai du lieu admin:', err);
    } finally {
      set_dang_tai(false);
    }
  };

  const bao_thanh_cong = (msg) => {
    set_thong_bao(msg);
    setTimeout(() => set_thong_bao(''), 3000);
  };

  const dinh_dang_tien = (so) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(so || 0);
  };

  // === QUAN LY DON HANG ===
  const chuyen_trang_thai_don = async (id, trang_thai) => {
    try {
      const res = await api_client.cap_nhat_trang_thai_don_admin(id, trang_thai);
      if (res.success) {
        bao_thanh_cong(`Đã chuyển trạng thái đơn hàng sang ${trang_thai}`);
        tai_tat_ca_du_lieu();
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi chuyển trạng thái đơn.');
    }
  };

  // === QUAN LY SAN PHAM ===
  const xu_ly_luu_san_pham = async (e) => {
    e.preventDefault();
    try {
      if (modal_loai === 'sua_sp') {
        await api_client.sua_san_pham_admin(doi_tuong_dang_sua.id, form_data);
        bao_thanh_cong('Cập nhật sản phẩm thành công!');
      } else {
        await api_client.them_san_pham_admin(form_data);
        bao_thanh_cong('Thêm sản phẩm mới thành công!');
      }
      set_modal_loai(null);
      tai_tat_ca_du_lieu();
    } catch (err) {
      alert(err.message || 'Lỗi lưu sản phẩm.');
    }
  };

  const xu_ly_xoa_san_pham = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await api_client.xoa_san_pham_admin(id);
      bao_thanh_cong('Đã xóa sản phẩm thành công.');
      tai_tat_ca_du_lieu();
    } catch (err) {
      alert(err.message || 'Không thể xóa sản phẩm.');
    }
  };

  // === QUAN LY DANH MUC ===
  const xu_ly_luu_danh_muc = async (e) => {
    e.preventDefault();
    try {
      await api_client.them_danh_muc_admin(form_data);
      bao_thanh_cong('Thêm danh mục mới thành công!');
      set_modal_loai(null);
      tai_tat_ca_du_lieu();
    } catch (err) {
      alert(err.message || 'Lỗi tạo danh mục.');
    }
  };

  const xu_ly_xoa_danh_muc = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;
    try {
      await api_client.xoa_danh_muc_admin(id);
      bao_thanh_cong('Xóa danh mục thành công.');
      tai_tat_ca_du_lieu();
    } catch (err) {
      alert(err.message || 'Không thể xóa danh mục.');
    }
  };

  // === QUAN LY TON KHO ===
  const xu_ly_nhap_kho = async (e) => {
    e.preventDefault();
    try {
      await api_client.dieu_chinh_kho_admin({
        san_pham_id: form_data.san_pham_id,
        loai_thay_doi: form_data.loai_thay_doi || 'nhap_kho',
        so_luong_thay_doi: form_data.so_luong_thay_doi,
        ghi_chu: form_data.ghi_chu || 'Nhập thêm tồn kho từ Admin'
      });
      bao_thanh_cong('Điều chỉnh tồn kho thành công!');
      set_modal_loai(null);
      tai_tat_ca_du_lieu();
    } catch (err) {
      alert(err.message || 'Lỗi điều chỉnh kho.');
    }
  };

  // === QUAN LY VOUCHER ===
  const xu_ly_luu_voucher = async (e) => {
    e.preventDefault();
    try {
      await api_client.them_voucher_admin(form_data);
      bao_thanh_cong('Tạo mã voucher thành công!');
      set_modal_loai(null);
      tai_tat_ca_du_lieu();
    } catch (err) {
      alert(err.message || 'Lỗi tạo voucher.');
    }
  };

  const xu_ly_xoa_voucher = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa voucher này?')) return;
    try {
      await api_client.xoa_voucher_admin(id);
      bao_thanh_cong('Xóa voucher thành công.');
      tai_tat_ca_du_lieu();
    } catch (err) {
      alert(err.message || 'Lỗi xóa voucher.');
    }
  };

  // === QUAN LY NHA CUNG CAP ===
  const xu_ly_luu_ncc = async (e) => {
    e.preventDefault();
    try {
      await api_client.them_nha_cung_cap_admin(form_data);
      bao_thanh_cong('Thêm nhà cung cấp thành công!');
      set_modal_loai(null);
      tai_tat_ca_du_lieu();
    } catch (err) {
      alert(err.message || 'Lỗi tạo nhà cung cấp.');
    }
  };

  const xu_ly_xoa_ncc = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa nhà cung cấp này?')) return;
    try {
      await api_client.xoa_nha_cung_cap_admin(id);
      bao_thanh_cong('Xóa nhà cung cấp thành công.');
      tai_tat_ca_du_lieu();
    } catch (err) {
      alert(err.message || 'Lỗi xóa nhà cung cấp.');
    }
  };

  // === QUAN LY TICKET HO TRO KHÁCH HÀNG (LIVE CHAT) ===
  const chon_ticket = async (t) => {
    try {
      const res = await api_client.lay_chi_tiet_ticket_admin(t.id);
      if (res.success && res.du_lieu) {
        set_ticket_dang_chon(res.du_lieu);
      } else {
        set_ticket_dang_chon(t);
      }
    } catch (err) {
      set_ticket_dang_chon(t);
    }
  };

  const xu_ly_admin_tra_loi = async (e) => {
    if (e) e.preventDefault();
    if (!noi_dung_tra_loi.trim() || !ticket_dang_chon || dang_gui_tra_loi) return;
    set_dang_gui_tra_loi(true);
    try {
      await api_client.admin_tra_loi_ticket(ticket_dang_chon.id, noi_dung_tra_loi.trim());
      set_noi_dung_tra_loi('');
      bao_thanh_cong('Đã gửi câu trả lời cho khách hàng!');
      const resDetail = await api_client.lay_chi_tiet_ticket_admin(ticket_dang_chon.id);
      if (resDetail.success) set_ticket_dang_chon(resDetail.du_lieu);
      const resList = await api_client.lay_danh_sach_ticket_admin();
      if (resList.success) {
        set_danh_sach_ticket(resList.du_lieu || []);
        if (resList.thong_ke) set_thong_ke_ticket(resList.thong_ke);
      }
    } catch (err) {
      alert(err.message || 'Lỗi gửi phản hồi.');
    } finally {
      set_dang_gui_tra_loi(false);
    }
  };

  const xu_ly_doi_trang_thai_ticket = async (id, trang_thai) => {
    try {
      await api_client.admin_cap_nhat_trang_thai_ticket(id, trang_thai);
      bao_thanh_cong(`Đã chuyển trạng thái ticket sang "${trang_thai}"!`);
      const resDetail = await api_client.lay_chi_tiet_ticket_admin(id);
      if (resDetail.success) set_ticket_dang_chon(resDetail.du_lieu);
      const resList = await api_client.lay_danh_sach_ticket_admin();
      if (resList.success) {
        set_danh_sach_ticket(resList.du_lieu || []);
        if (resList.thong_ke) set_thong_ke_ticket(resList.thong_ke);
      }
    } catch (err) {
      alert(err.message || 'Lỗi cập nhật trạng thái ticket.');
    }
  };

  const xu_ly_xoa_ticket = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa ticket này?')) return;
    try {
      await api_client.admin_xoa_ticket(id);
      bao_thanh_cong('Đã xóa ticket thành công.');
      if (ticket_dang_chon?.id === id) set_ticket_dang_chon(null);
      const resList = await api_client.lay_danh_sach_ticket_admin();
      if (resList.success) {
        set_danh_sach_ticket(resList.du_lieu || []);
        if (resList.thong_ke) set_thong_ke_ticket(resList.thong_ke);
      }
    } catch (err) {
      alert(err.message || 'Lỗi xóa ticket.');
    }
  };

  const dinh_dang_ngay_ticket = (dt) => {
    if (!dt) return '';
    try {
      const d = new Date(dt);
      return isNaN(d.getTime()) ? '' : d.toLocaleDateString('vi-VN');
    } catch (e) {
      return '';
    }
  };

  const dinh_dang_ngay_gio_ticket = (dt) => {
    if (!dt) return '';
    try {
      const d = new Date(dt);
      return isNaN(d.getTime()) ? '' : `${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${d.toLocaleDateString('vi-VN')}`;
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="admin-page-container">
      <div className="container" style={{ maxWidth: '1620px', width: '96%', margin: '0 auto' }}>
        {/* Header Admin */}
        <div className="admin-header-banner" style={{ padding: '20px 28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '28px' }}>⚡</span>
              <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                SmartDesk Admin Console (Thành viên 3 — Quản trị Kinh doanh)
              </h1>
            </div>
            <p style={{ margin: '6px 0 0 38px', fontSize: '13px', color: '#94a3b8' }}>
              Hệ thống quản lý sản phẩm, đơn hàng, khách hàng, tồn kho & thống kê thời gian thực từ CSDL SQLite
            </p>
          </div>

          <div className="admin-header-actions">
            <button
              type="button"
              onClick={tai_tat_ca_du_lieu}
              style={{ padding: '9px 16px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: '600' }}
            >
              🔄 Tải lại dữ liệu
            </button>
            <button
              type="button"
              onClick={on_ve_trang_chu}
              style={{ padding: '9px 18px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: '700' }}
            >
              ← Về Cửa hàng
            </button>
          </div>
        </div>

        {thong_bao && (
          <div style={{ padding: '12px 20px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '8px', marginBottom: '16px', fontWeight: '600', fontSize: '14px', border: '1px solid #86efac' }}>
            ✓ {thong_bao}
          </div>
        )}

        {/* Thanh Menu dieu huong cac phan he */}
        <div className="admin-tabs-nav">
          {[
            { id: 'tong_quan', label: '📊 Tổng quan KPI', count: null },
            { id: 'san_pham', label: '📦 Sản phẩm', count: danh_sach_sp.length },
            { id: 'danh_muc', label: '📁 Danh mục', count: danh_sach_dm.length },
            { id: 'don_hang', label: '🛒 Đơn hàng', count: danh_sach_dh.length },
            { id: 'khach_hang', label: '👥 Khách hàng', count: danh_sach_kh.length },
            { id: 'ton_kho', label: '📋 Nhật ký kho', count: danh_sach_kho.length },
            { id: 'voucher', label: '🎟️ Voucher', count: danh_sach_vc.length },
            { id: 'nha_cung_cap', label: '🏢 Nhà cung cấp', count: danh_sach_ncc.length },
            { id: 'banner', label: '🖼️ Banner', count: danh_sach_bn.length },
            { id: 'ho_tro', label: '🎧 Hỗ trợ khách hàng', count: thong_ke_ticket.cho_xu_ly > 0 ? `${thong_ke_ticket.cho_xu_ly} chờ` : danh_sach_ticket.length }
          ].map(m => {
            const dangChon = tab_hien_tai === m.id;
            const laChoXuLy = m.id === 'ho_tro' && thong_ke_ticket.cho_xu_ly > 0;
            return (
              <button
                key={m.id}
                type="button"
                className={`admin-tab-btn ${dangChon ? 'active' : ''}`}
                onClick={() => set_tab_hien_tai(m.id)}
              >
                <span>{m.label}</span>
                {m.count !== null && (
                  <span className={`admin-tab-badge ${laChoXuLy ? 'badge-danger' : ''}`}>
                    {m.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: TONG QUAN KPI ================= */}
        {tab_hien_tai === 'tong_quan' && thong_ke && (
          <div>
            {/* 4 The KPI thuc tu DB */}
            <div className="admin-kpi-grid">
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Doanh thu thực tế</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981', margin: '8px 0 4px 0' }}>
                  {dinh_dang_tien(thong_ke.tong_doanh_thu)}
                </div>
                <div style={{ fontSize: '12px', color: '#16a34a' }}>Đã thanh toán & giao thành công</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Tổng số đơn hàng</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb', margin: '8px 0 4px 0' }}>
                  {thong_ke.tong_don_hang}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Trên toàn hệ thống</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Số lượng khách hàng</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#8b5cf6', margin: '8px 0 4px 0' }}>
                  {thong_ke.tong_khach_hang}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Tài khoản đã đăng ký</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Cảnh báo tồn kho thấp</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#ef4444', margin: '8px 0 4px 0' }}>
                  {thong_ke.san_pham_sap_het}
                </div>
                <div style={{ fontSize: '12px', color: '#dc2626' }}>Sản phẩm còn ≤ 10 cái</div>
              </div>
            </div>

            {/* Bang Top ban chay & Canh bao nhap kho */}
            <div className="admin-top-split-grid">
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', color: '#0f172a' }}>
                  🔥 Top 5 sản phẩm bán chạy nhất
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(thong_ke.top_ban_chay || []).map(sp => (
                    <div key={sp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: '600' }}>{sp.ten_san_pham}</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#2563eb' }}>Đã bán: {sp.da_ban}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', color: '#0f172a' }}>
                  ⚠️ Cần nhập kho khẩn cấp (Tồn kho thấp)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(thong_ke.danh_sach_can_nhap || []).map(sp => (
                    <div key={sp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#fff1f2', borderRadius: '8px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#991b1b' }}>{sp.ten_san_pham}</span>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#ef4444' }}>Còn: {sp.so_luong_ton}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: QUAN LY SAN PHAM ================= */}
        {tab_hien_tai === 'san_pham' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: '800', margin: 0 }}>Danh sách Sản phẩm ({danh_sach_sp.length})</h2>
              <button
                type="button"
                className="hero-cta-btn"
                onClick={() => {
                  set_form_data({ danh_muc_id: 1, gia: 50000, so_luong_ton: 100, don_vi_tinh: 'Cái', trang_thai: 'hoat_dong', anh_chinh: '' });
                  set_doi_tuong_dang_sua(null);
                  set_modal_loai('them_sp');
                }}
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                + Thêm sản phẩm mới
              </button>
            </div>

            <div className="admin-table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '10px', width: '50px' }}>ID</th>
                    <th style={{ padding: '10px', width: '60px' }}>Ảnh</th>
                    <th style={{ padding: '10px' }}>Tên sản phẩm</th>
                    <th style={{ padding: '10px' }}>Giá bán</th>
                    <th style={{ padding: '10px' }}>Tồn kho</th>
                    <th style={{ padding: '10px' }}>Đã bán</th>
                    <th style={{ padding: '10px' }}>Thương hiệu</th>
                    <th style={{ padding: '10px' }}>Trạng thái</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {danh_sach_sp.map(sp => (
                    <tr key={sp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px', fontWeight: '700' }}>#{sp.id}</td>
                      <td style={{ padding: '8px' }}>
                        <img
                          src={sp.anh_chinh || 'https://placehold.co/44x44?text=SP'}
                          alt={sp.ten_san_pham}
                          style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'block' }}
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/44x44?text=SP'; }}
                        />
                      </td>
                      <td style={{ padding: '10px', fontWeight: '600' }}>{sp.ten_san_pham}</td>
                      <td style={{ padding: '10px', color: '#ef4444', fontWeight: '700' }}>{dinh_dang_tien(sp.gia)}</td>
                      <td style={{ padding: '10px', fontWeight: '700', color: sp.so_luong_ton <= 10 ? '#ef4444' : '#16a34a' }}>{sp.so_luong_ton}</td>
                      <td style={{ padding: '10px' }}>{sp.da_ban}</td>
                      <td style={{ padding: '10px' }}>{sp.thuong_hieu || '—'}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: sp.trang_thai === 'hoat_dong' ? '#dcfce7' : '#fee2e2', color: sp.trang_thai === 'hoat_dong' ? '#166534' : '#991b1b', fontWeight: '700' }}>
                          {sp.trang_thai}
                        </span>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => {
                            set_doi_tuong_dang_sua(sp);
                            set_form_data({ ...sp });
                            set_modal_loai('sua_sp');
                          }}
                          style={{ marginRight: '8px', padding: '4px 8px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => xu_ly_xoa_san_pham(sp.id)}
                          style={{ padding: '4px 8px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: QUAN LY DON HANG ================= */}
        {tab_hien_tai === 'don_hang' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '16px' }}>
              Quản lý và Duyệt Đơn hàng ({danh_sach_dh.length})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {danh_sach_dh.map(dh => (
                <div key={dh.id} style={{ border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px', backgroundColor: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    <div>
                      <strong style={{ fontSize: '15px', color: '#1e293b' }}>{dh.ma_don_hang}</strong> - Người nhận: <strong>{dh.ten_nguoi_nhan}</strong> ({dh.so_dien_thoai})
                      <div style={{ fontSize: '12.5px', color: '#64748b' }}>Địa chỉ: {dh.dia_chi_giao_hang}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '800',
                        color: '#ffffff',
                        backgroundColor: dh.trang_thai === 'DELIVERED' ? '#10b981' : (dh.trang_thai === 'CANCELLED' ? '#ef4444' : '#3b82f6')
                      }}>
                        {dh.trang_thai}
                      </span>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#ef4444', marginTop: '4px' }}>
                        {dinh_dang_tien(dh.tong_thanh_toan)}
                      </div>
                    </div>
                  </div>

                  {/* Cac nut chuyen trang thai theo State Machine */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>Duyệt chuyển trạng thái:</span>
                    {dh.trang_thai === 'PENDING' && (
                      <>
                        <button type="button" onClick={() => chuyen_trang_thai_don(dh.id, 'CONFIRMED')} style={{ padding: '4px 10px', backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                          ✓ Xác nhận (CONFIRMED)
                        </button>
                        <button type="button" onClick={() => chuyen_trang_thai_don(dh.id, 'CANCELLED')} style={{ padding: '4px 10px', backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '4px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                          ✕ Hủy đơn (Hoàn kho)
                        </button>
                      </>
                    )}
                    {dh.trang_thai === 'CONFIRMED' && (
                      <button type="button" onClick={() => chuyen_trang_thai_don(dh.id, 'PROCESSING')} style={{ padding: '4px 10px', backgroundColor: '#ede9fe', color: '#6d28d9', border: '1px solid #ddd6fe', borderRadius: '4px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                        📦 Đang đóng gói (PROCESSING)
                      </button>
                    )}
                    {dh.trang_thai === 'PROCESSING' && (
                      <button type="button" onClick={() => chuyen_trang_thai_don(dh.id, 'SHIPPING')} style={{ padding: '4px 10px', backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: '4px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                        🚚 Bàn giao vận chuyển (SHIPPING)
                      </button>
                    )}
                    {dh.trang_thai === 'SHIPPING' && (
                      <button type="button" onClick={() => chuyen_trang_thai_don(dh.id, 'DELIVERED')} style={{ padding: '4px 10px', backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: '4px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                        🎉 Giao thành công (DELIVERED)
                      </button>
                    )}
                    {(dh.trang_thai === 'DELIVERED' || dh.trang_thai === 'CANCELLED') && (
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Đơn hàng đã ở trạng thái kết thúc.</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: QUAN LY TON KHO ================= */}
        {tab_hien_tai === 'ton_kho' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: '800', margin: 0 }}>
                Nhật ký biến động kho & Nhập hàng ({danh_sach_kho.length})
              </h2>
              <button
                type="button"
                className="hero-cta-btn"
                onClick={() => {
                  set_form_data({ san_pham_id: danh_sach_sp[0]?.id || 1, loai_thay_doi: 'nhap_kho', so_luong_thay_doi: 50, ghi_chu: 'Nhập hàng bổ sung' });
                  set_modal_loai('nhap_kho');
                }}
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                + Nhập hàng / Điều chỉnh tồn kho
              </button>
            </div>

            <div className="admin-table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>Thời gian</th>
                    <th style={{ padding: '10px' }}>Sản phẩm</th>
                    <th style={{ padding: '10px' }}>Loại biến động</th>
                    <th style={{ padding: '10px' }}>Thay đổi</th>
                    <th style={{ padding: '10px' }}>Tồn trước ➜ Sau</th>
                    <th style={{ padding: '10px' }}>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {danh_sach_kho.map(k => (
                    <tr key={k.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px', color: '#64748b' }}>{new Date(k.ngay_tao).toLocaleString('vi-VN')}</td>
                      <td style={{ padding: '10px', fontWeight: '600' }}>{k.ten_san_pham}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', fontWeight: '700', backgroundColor: k.loai_thay_doi === 'nhap_kho' ? '#dcfce7' : (k.loai_thay_doi === 'ban_hang' ? '#fee2e2' : '#f1f5f9') }}>
                          {k.loai_thay_doi}
                        </span>
                      </td>
                      <td style={{ padding: '10px', fontWeight: '700', color: k.loai_thay_doi === 'nhap_kho' || k.loai_thay_doi === 'hoan_hang' ? '#16a34a' : '#dc2626' }}>
                        {k.loai_thay_doi === 'nhap_kho' || k.loai_thay_doi === 'hoan_hang' ? `+${k.so_luong_thay_doi}` : `-${k.so_luong_thay_doi}`}
                      </td>
                      <td style={{ padding: '10px' }}>{k.ton_truoc} ➔ <strong>{k.ton_sau}</strong></td>
                      <td style={{ padding: '10px', color: '#64748b' }}>{k.ghi_chu || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 5: QUAN LY VOUCHER ================= */}
        {tab_hien_tai === 'voucher' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: '800', margin: 0 }}>Mã Giảm Giá & Voucher ({danh_sach_vc.length})</h2>
              <button
                type="button"
                className="hero-cta-btn"
                onClick={() => {
                  set_form_data({ ma_voucher: 'SALE' + Math.floor(10 + Math.random()*90), ten_voucher: 'Ưu đãi đặc biệt', loai_giam_gia: 'fixed', gia_tri: 20000, gia_tri_don_toi_thieu: 150000, so_luong: 100, trang_thai: 'hoat_dong' });
                  set_modal_loai('them_vc');
                }}
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                + Thêm Voucher Mới
              </button>
            </div>

            <div className="admin-cards-responsive">
              {danh_sach_vc.map(vc => (
                <div key={vc.id} style={{ border: '2px dashed #94a3b8', borderRadius: '10px', padding: '16px', backgroundColor: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#2563eb' }}>{vc.ma_voucher}</span>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#dcfce7', color: '#166534', fontWeight: '700' }}>
                      {vc.trang_thai}
                    </span>
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#1e293b' }}>{vc.ten_voucher}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                    Giảm: <strong>{vc.loai_giam_gia === 'percent' ? `${vc.gia_tri}%` : dinh_dang_tien(vc.gia_tri)}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Đơn tối thiểu: {dinh_dang_tien(vc.gia_tri_don_toi_thieu)}
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => xu_ly_xoa_voucher(vc.id)} style={{ background: 'none', border: '1px solid #fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: NHA CUNG CAP ================= */}
        {tab_hien_tai === 'nha_cung_cap' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: '800', margin: 0 }}>Nhà Cung Cấp ({danh_sach_ncc.length})</h2>
              <button
                type="button"
                className="hero-cta-btn"
                onClick={() => {
                  set_form_data({ ten_nha_cung_cap: '', so_dien_thoai: '', email: '', dia_chi: '', trang_thai: 'hoat_dong' });
                  set_modal_loai('them_ncc');
                }}
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                + Thêm Nhà Cung Cấp
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {danh_sach_ncc.map(ncc => (
                <div key={ncc.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '15px' }}>{ncc.ten_nha_cung_cap}</strong>
                    <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                      📞 {ncc.so_dien_thoai || '—'} · ✉️ {ncc.email || '—'} · 📍 {ncc.dia_chi || '—'}
                    </div>
                  </div>
                  <button type="button" onClick={() => xu_ly_xoa_ncc(ncc.id)} style={{ padding: '6px 12px', backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 7: KHACH HANG ================= */}
        {tab_hien_tai === 'khach_hang' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '16px' }}>Danh sách Khách hàng ({danh_sach_kh.length})</h2>
            <div className="admin-table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>ID</th>
                    <th style={{ padding: '10px' }}>Họ tên</th>
                    <th style={{ padding: '10px' }}>Tài khoản / Email</th>
                    <th style={{ padding: '10px' }}>Số điện thoại</th>
                    <th style={{ padding: '10px' }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {danh_sach_kh.map(kh => (
                    <tr key={kh.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px' }}>#{kh.id}</td>
                      <td style={{ padding: '10px', fontWeight: '600' }}>{kh.ho_ten}</td>
                      <td style={{ padding: '10px' }}>{kh.email}</td>
                      <td style={{ padding: '10px' }}>{kh.so_dien_thoai || '—'}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: '700', backgroundColor: kh.trang_thai === 'hoat_dong' ? '#dcfce7' : '#fee2e2', color: kh.trang_thai === 'hoat_dong' ? '#166534' : '#991b1b' }}>
                          {kh.trang_thai}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 8: DANH MUC ================= */}
        {tab_hien_tai === 'danh_muc' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: '800', margin: 0 }}>Danh mục ({danh_sach_dm.length})</h2>
              <button
                type="button"
                className="hero-cta-btn"
                onClick={() => {
                  set_form_data({ ten_danh_muc: '', duong_dan_danh_muc: '', mo_ta: '', trang_thai: 'hoat_dong' });
                  set_modal_loai('them_dm');
                }}
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                + Thêm Danh Mục
              </button>
            </div>
            <div className="admin-cards-responsive">
              {danh_sach_dm.map(dm => (
                <div key={dm.id} style={{ border: '1px solid #e2e8f0', padding: '14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{dm.ten_danh_muc}</strong>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Slug: {dm.duong_dan_danh_muc}</div>
                  </div>
                  <button type="button" onClick={() => xu_ly_xoa_danh_muc(dm.id)} style={{ padding: '4px 8px', backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 9: BANNER ================= */}
        {tab_hien_tai === 'banner' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '16px' }}>Banner Trang Chủ ({danh_sach_bn.length})</h2>
            <div className="admin-cards-responsive">
              {danh_sach_bn.map(bn => (
                <div key={bn.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={bn.hinh_anh} alt={bn.tieu_de} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  <div style={{ padding: '12px' }}>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{bn.tieu_de}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Liên kết: {bn.lien_ket}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 10: HO TRO KHÁCH HÀNG (LIVE SUPPORT CONSOLE) ================= */}
        {tab_hien_tai === 'ho_tro' && (
          <div>
            {/* Top KPI Cards cho Ho tro khach hang */}
            <div className="admin-kpi-grid" style={{ marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Tổng số ticket</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '6px 0 2px 0' }}>
                  {thong_ke_ticket.tong_so}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Yêu cầu từ khách hàng & bot AI</div>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #fef08a' }}>
                <div style={{ fontSize: '13px', color: '#854d0e', fontWeight: '600' }}>Chờ xử lý / phản hồi</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#ca8a04', margin: '6px 0 2px 0' }}>
                  {thong_ke_ticket.cho_xu_ly}
                </div>
                <div style={{ fontSize: '12px', color: '#ca8a04' }}>Cần admin giải đáp sớm</div>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '13px', color: '#166534', fontWeight: '600' }}>Đang hỗ trợ</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#16a34a', margin: '6px 0 2px 0' }}>
                  {thong_ke_ticket.dang_xu_ly}
                </div>
                <div style={{ fontSize: '12px', color: '#16a34a' }}>Đang trao đổi 2 chiều</div>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Đã hoàn tất / Đóng</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#64748b', margin: '6px 0 2px 0' }}>
                  {thong_ke_ticket.da_dong}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Vấn đề đã được giải quyết</div>
              </div>
            </div>

            {/* Layout 2 cot: Danh sach ticket & Khung chat truc tiep */}
            <div className="admin-support-layout">
              {/* Cot trai: Danh sach ticket */}
              <div className="admin-support-list-panel">
                <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                  <input
                    type="text"
                    placeholder="🔍 Tìm theo mã ticket, tên khách, SĐT..."
                    value={tim_kiem_ticket}
                    onChange={(e) => set_tim_kiem_ticket(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {[
                      { id: 'tat_ca', label: 'Tất cả' },
                      { id: 'cho_xu_ly', label: 'Chờ xử lý' },
                      { id: 'dang_xu_ly', label: 'Đang hỗ trợ' },
                      { id: 'da_dong', label: 'Đã đóng' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => set_loc_trang_thai_ticket(f.id)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: loc_trang_thai_ticket === f.id ? '1px solid #2563eb' : '1px solid #e2e8f0',
                          backgroundColor: loc_trang_thai_ticket === f.id ? '#2563eb' : '#f8fafc',
                          color: loc_trang_thai_ticket === f.id ? '#ffffff' : '#475569',
                          fontSize: '11.5px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="admin-support-tickets-scroll">
                  {danh_sach_ticket
                    .filter(t => {
                      if (loc_trang_thai_ticket !== 'tat_ca' && t.trang_thai !== loc_trang_thai_ticket) return false;
                      if (tim_kiem_ticket.trim()) {
                        const q = tim_kiem_ticket.toLowerCase();
                        const matchMa = t.ma_ticket?.toLowerCase().includes(q);
                        const matchTen = t.ho_ten?.toLowerCase().includes(q);
                        const matchSdt = t.so_dien_thoai?.includes(q);
                        const matchTieuDe = t.tieu_de?.toLowerCase().includes(q);
                        return matchMa || matchTen || matchSdt || matchTieuDe;
                      }
                      return true;
                    })
                    .map(t => {
                      const dangChon = ticket_dang_chon?.id === t.id;
                      return (
                        <div
                          key={t.id}
                          className={`admin-ticket-card-item ${dangChon ? 'active' : ''}`}
                          onClick={() => chon_ticket(t)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontWeight: '800', color: '#2563eb', fontSize: '13px' }}>#{t.ma_ticket}</span>
                            <span className={`admin-ticket-pill pill-${t.trang_thai}`}>
                              {t.trang_thai === 'cho_xu_ly' && 'Chờ phản hồi'}
                              {t.trang_thai === 'dang_xu_ly' && 'Đang hỗ trợ'}
                              {t.trang_thai === 'da_dong' && 'Đã đóng'}
                            </span>
                          </div>
                          <div style={{ fontWeight: '700', fontSize: '13.5px', color: '#1e293b', marginBottom: '4px' }}>
                            {t.tieu_de}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                            <span>👤 {t.ho_ten}</span>
                            <span>{dinh_dang_ngay_ticket(t.ngay_cap_nhat || t.ngay_tao)}</span>
                          </div>
                          {t.tin_nhan_cuoi && (
                            <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px', background: '#f8fafc', padding: '6px 8px', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              💬 {t.tin_nhan_cuoi}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  {danh_sach_ticket.length === 0 && (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                      Chưa có ticket nào được tạo.
                    </div>
                  )}
                </div>
              </div>

              {/* Cot phai: Khung chi tiet va Chat console */}
              <div className="admin-support-chat-panel">
                {ticket_dang_chon ? (
                  <>
                    {/* Header Ticket */}
                    <div className="admin-chat-header-bar">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>
                            #{ticket_dang_chon.ma_ticket} - {ticket_dang_chon.tieu_de}
                          </h3>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                          Khách hàng: <strong>{ticket_dang_chon.ho_ten}</strong>
                          {ticket_dang_chon.so_dien_thoai && ` • SĐT: ${ticket_dang_chon.so_dien_thoai}`}
                          {ticket_dang_chon.email && ` • Email: ${ticket_dang_chon.email}`}
                          {ticket_dang_chon.chu_de && ` • Chủ đề: ${ticket_dang_chon.chu_de}`}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <select
                          value={ticket_dang_chon.trang_thai}
                          onChange={(e) => xu_ly_doi_trang_thai_ticket(ticket_dang_chon.id, e.target.value)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '12.5px',
                            border: '1px solid #cbd5e1',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="cho_xu_ly">🟡 Chờ phản hồi</option>
                          <option value="dang_xu_ly">🟢 Đang hỗ trợ</option>
                          <option value="da_dong">⚪ Đã giải quyết / Đóng</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => xu_ly_xoa_ticket(ticket_dang_chon.id)}
                          style={{ padding: '6px 10px', backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                          title="Xóa ticket"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Messages Conversation Area */}
                    <div className="admin-chat-messages-area">
                      {Array.isArray(ticket_dang_chon.tin_nhan) && ticket_dang_chon.tin_nhan.length > 0 ? (
                        ticket_dang_chon.tin_nhan.map((tn) => {
                          const laAdmin = tn.nguoi_gui === 'admin';
                          return (
                            <div
                              key={tn.id}
                              className={`admin-chat-msg-row ${laAdmin ? 'row-admin' : 'row-khach'}`}
                            >
                              <div className="admin-chat-msg-bubble">
                                <div className="msg-meta">
                                  <span className="msg-sender">
                                    {laAdmin ? '🛡️ Quản trị viên' : `👤 ${tn.ten_nguoi_gui || 'Khách hàng'}`}
                                  </span>
                                  <span className="msg-time">
                                    {dinh_dang_ngay_gio_ticket(tn.thoi_gian)}
                                  </span>
                                </div>
                                <div className="msg-body" style={{ whiteSpace: 'pre-wrap' }}>
                                  {tn.noi_dung}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                          Chưa có tin nhắn nào trong cuộc trò chuyện.
                        </div>
                      )}
                    </div>

                    {/* Reply Form */}
                    <form onSubmit={xu_ly_admin_tra_loi} className="admin-chat-reply-form">
                      <textarea
                        rows={3}
                        placeholder="Nhập câu trả lời gửi đến khách hàng..."
                        value={noi_dung_tra_loi}
                        onChange={(e) => set_noi_dung_tra_loi(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            xu_ly_admin_tra_loi();
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          resize: 'none',
                          fontSize: '13.5px'
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>Nhấn <strong>Enter</strong> để gửi tin nhắn, <strong>Shift + Enter</strong> để xuống dòng.</span>
                        <button
                          type="submit"
                          disabled={dang_gui_tra_loi || !noi_dung_tra_loi.trim()}
                          style={{
                            padding: '8px 20px',
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '700',
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          {dang_gui_tra_loi ? 'Đang gửi...' : 'Gửi phản hồi cho khách ✉️'}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: '14px', flexDirection: 'column', gap: '10px', minHeight: '300px' }}>
                    <span style={{ fontSize: '36px' }}>🎧</span>
                    <span>Chọn một ticket ở danh sách bên trái để bắt đầu hỗ trợ khách hàng.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL POPUP CHO CAC FORM CREATE/EDIT */}
        {modal_loai && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '560px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700' }}>
                  {modal_loai === 'them_sp' && 'Thêm sản phẩm mới'}
                  {modal_loai === 'sua_sp' && 'Chỉnh sửa thông tin sản phẩm'}
                  {modal_loai === 'them_dm' && 'Thêm danh mục mới'}
                  {modal_loai === 'nhap_kho' && 'Nhập hàng / Điều chỉnh tồn kho'}
                  {modal_loai === 'them_vc' && 'Thêm mã giảm giá mới'}
                  {modal_loai === 'them_ncc' && 'Thêm nhà cung cấp mới'}
                </h3>
                <button type="button" onClick={() => set_modal_loai(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
              </div>

              {/* FORM SAN PHAM */}
              {(modal_loai === 'them_sp' || modal_loai === 'sua_sp') && (
                <form onSubmit={xu_ly_luu_san_pham} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Tên sản phẩm *</label>
                    <input
                      type="text"
                      required
                      value={form_data.ten_san_pham || ''}
                      onChange={(e) => set_form_data({ ...form_data, ten_san_pham: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div className="admin-form-grid-2col">
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Giá bán thực tế (VNĐ) *</label>
                      <input
                        type="number"
                        required
                        value={form_data.gia || 0}
                        onChange={(e) => set_form_data({ ...form_data, gia: Number(e.target.value) })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Giá gốc / Giá niêm yết cũ (VNĐ)</label>
                      <input
                        type="number"
                        placeholder="Để trống nếu không giảm giá"
                        value={form_data.gia_goc || ''}
                        onChange={(e) => set_form_data({ ...form_data, gia_goc: e.target.value ? Number(e.target.value) : null })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>
                  <div className="admin-form-grid-2col">
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Số lượng tồn kho *</label>
                      <input
                        type="number"
                        required
                        value={form_data.so_luong_ton !== undefined ? form_data.so_luong_ton : 0}
                        onChange={(e) => set_form_data({ ...form_data, so_luong_ton: Number(e.target.value) })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Đơn vị tính</label>
                      <input
                        type="text"
                        placeholder="Cái, Cuộn, Ram, Hộp..."
                        value={form_data.don_vi_tinh || 'Cái'}
                        onChange={(e) => set_form_data({ ...form_data, don_vi_tinh: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>
                  <div className="admin-form-grid-2col">
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Danh mục</label>
                      <select
                        value={form_data.danh_muc_id || 1}
                        onChange={(e) => set_form_data({ ...form_data, danh_muc_id: Number(e.target.value) })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      >
                        {danh_sach_dm.map(dm => (
                          <option key={dm.id} value={dm.id}>{dm.ten_danh_muc}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Thương hiệu</label>
                      <input
                        type="text"
                        value={form_data.thuong_hieu || ''}
                        onChange={(e) => set_form_data({ ...form_data, thuong_hieu: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>
                  <div className="admin-form-grid-2col">
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Trạng thái kinh doanh</label>
                      <select
                        value={form_data.trang_thai || 'hoat_dong'}
                        onChange={(e) => set_form_data({ ...form_data, trang_thai: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      >
                        <option value="hoat_dong">🟢 Đang kinh doanh (Hiển thị ở Cửa hàng)</option>
                        <option value="tam_an">🔴 Tạm ẩn (Ngừng hiển thị)</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', paddingTop: '18px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(form_data.noi_bat)}
                          onChange={(e) => set_form_data({ ...form_data, noi_bat: e.target.checked ? 1 : 0 })}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        ⭐ Đặt làm Sản phẩm Nổi bật (Trang chủ)
                      </label>
                    </div>
                  </div>
                  {/* HÌNH ẢNH SẢN PHẨM */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                      🖼️ Hình ảnh sản phẩm (Link URL hoặc Tải từ máy tính)
                    </label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        placeholder="Dán link ảnh (https://... hoặc /images/san_pham/...)"
                        value={form_data.anh_chinh || ''}
                        onChange={(e) => set_form_data({ ...form_data, anh_chinh: e.target.value })}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                      <label style={{
                        padding: '8px 14px',
                        backgroundColor: '#f1f5f9',
                        color: '#1e293b',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12.5px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap'
                      }}>
                        📁 Tải ảnh lên
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                set_form_data(prev => ({ ...prev, anh_chinh: event.target.result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Khung xem trước ảnh */}
                    {form_data.anh_chinh && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', marginBottom: '8px' }}>
                        <img
                          src={form_data.anh_chinh}
                          alt="Xem trước"
                          style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/60x60?text=Loi+Anh'; }}
                        />
                        <div style={{ flex: 1, fontSize: '12px', color: '#64748b' }}>
                          <span style={{ fontWeight: '700', color: '#16a34a' }}>✓ Đã chọn ảnh hiển thị</span>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px', marginTop: '2px' }}>
                            {form_data.anh_chinh.startsWith('data:') ? 'Ảnh tải trực tiếp từ máy tính (Đã chuyển định dạng)' : form_data.anh_chinh}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => set_form_data(prev => ({ ...prev, anh_chinh: '' }))}
                          style={{ padding: '4px 10px', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '4px', cursor: 'pointer', fontSize: '11.5px', fontWeight: '700' }}
                        >
                          ✕ Gỡ ảnh
                        </button>
                      </div>
                    )}

                    {/* Gợi ý ảnh mẫu nhanh */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>Ảnh mẫu nhanh:</span>
                      {[
                        { label: '📓 Sổ tay', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400' },
                        { label: '🖊️ Bút bi', url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400' },
                        { label: '📄 Giấy in', url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=400' },
                        { label: '🖩 Máy tính', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=400' },
                        { label: '✂️ Kéo cắt', url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400' },
                        { label: '🎒 Balo', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' }
                      ].map(preset => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => set_form_data(prev => ({ ...prev, anh_chinh: preset.url }))}
                          style={{ padding: '2px 8px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '11px', color: '#475569', cursor: 'pointer' }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Mô tả sản phẩm</label>
                    <textarea
                      rows={3}
                      value={form_data.mo_ta || ''}
                      onChange={(e) => set_form_data({ ...form_data, mo_ta: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button type="button" onClick={() => set_modal_loai(null)} style={{ padding: '8px 16px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                    <button type="submit" className="hero-cta-btn" style={{ padding: '8px 20px' }}>Lưu sản phẩm</button>
                  </div>
                </form>
              )}

              {/* FORM NHAP KHO */}
              {modal_loai === 'nhap_kho' && (
                <form onSubmit={xu_ly_nhap_kho} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Chọn sản phẩm *</label>
                    <select
                      value={form_data.san_pham_id || 1}
                      onChange={(e) => set_form_data({ ...form_data, san_pham_id: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                      {danh_sach_sp.map(sp => (
                        <option key={sp.id} value={sp.id}>{sp.ten_san_pham} (Tồn hiện tại: {sp.so_luong_ton})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Loại điều chỉnh</label>
                    <select
                      value={form_data.loai_thay_doi || 'nhap_kho'}
                      onChange={(e) => set_form_data({ ...form_data, loai_thay_doi: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="nhap_kho">Nhập kho (+ số lượng)</option>
                      <option value="xuat_kho">Xuất kho (- số lượng)</option>
                      <option value="dieu_chinh">Điều chỉnh trực tiếp (= số lượng mới)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Số lượng thay đổi *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={form_data.so_luong_thay_doi || 50}
                      onChange={(e) => set_form_data({ ...form_data, so_luong_thay_doi: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Ghi chú nhập hàng</label>
                    <input
                      type="text"
                      value={form_data.ghi_chu || ''}
                      onChange={(e) => set_form_data({ ...form_data, ghi_chu: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button type="button" onClick={() => set_modal_loai(null)} style={{ padding: '8px 16px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                    <button type="submit" className="hero-cta-btn" style={{ padding: '8px 20px' }}>Xác nhận biến động kho</button>
                  </div>
                </form>
              )}

              {/* FORM VOUCHER */}
              {modal_loai === 'them_vc' && (
                <form onSubmit={xu_ly_luu_voucher} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Mã Voucher *</label>
                    <input
                      type="text"
                      required
                      value={form_data.ma_voucher || ''}
                      onChange={(e) => set_form_data({ ...form_data, ma_voucher: e.target.value.toUpperCase() })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', textTransform: 'uppercase' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Tên Voucher *</label>
                    <input
                      type="text"
                      required
                      value={form_data.ten_voucher || ''}
                      onChange={(e) => set_form_data({ ...form_data, ten_voucher: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div className="admin-form-grid-2col">
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Loại giảm</label>
                      <select
                        value={form_data.loai_giam_gia || 'fixed'}
                        onChange={(e) => set_form_data({ ...form_data, loai_giam_gia: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      >
                        <option value="fixed">Số tiền cố định (VNĐ)</option>
                        <option value="percent">Phần trăm (%)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Giá trị giảm *</label>
                      <input
                        type="number"
                        required
                        value={form_data.gia_tri || 20000}
                        onChange={(e) => set_form_data({ ...form_data, gia_tri: Number(e.target.value) })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Đơn hàng tối thiểu (VNĐ)</label>
                    <input
                      type="number"
                      value={form_data.gia_tri_don_toi_thieu || 100000}
                      onChange={(e) => set_form_data({ ...form_data, gia_tri_don_toi_thieu: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button type="button" onClick={() => set_modal_loai(null)} style={{ padding: '8px 16px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                    <button type="submit" className="hero-cta-btn" style={{ padding: '8px 20px' }}>Tạo voucher</button>
                  </div>
                </form>
              )}

              {/* FORM NHA CUNG CAP */}
              {modal_loai === 'them_ncc' && (
                <form onSubmit={xu_ly_luu_ncc} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Tên Nhà Cung Cấp *</label>
                    <input
                      type="text"
                      required
                      value={form_data.ten_nha_cung_cap || ''}
                      onChange={(e) => set_form_data({ ...form_data, ten_nha_cung_cap: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div className="admin-form-grid-2col">
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Số điện thoại</label>
                      <input
                        type="text"
                        value={form_data.so_dien_thoai || ''}
                        onChange={(e) => set_form_data({ ...form_data, so_dien_thoai: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Email</label>
                      <input
                        type="email"
                        value={form_data.email || ''}
                        onChange={(e) => set_form_data({ ...form_data, email: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Địa chỉ</label>
                    <input
                      type="text"
                      value={form_data.dia_chi || ''}
                      onChange={(e) => set_form_data({ ...form_data, dia_chi: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button type="button" onClick={() => set_modal_loai(null)} style={{ padding: '8px 16px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                    <button type="submit" className="hero-cta-btn" style={{ padding: '8px 20px' }}>Tạo nhà cung cấp</button>
                  </div>
                </form>
              )}

              {/* FORM DANH MUC */}
              {modal_loai === 'them_dm' && (
                <form onSubmit={xu_ly_luu_danh_muc} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Tên danh mục *</label>
                    <input
                      type="text"
                      required
                      value={form_data.ten_danh_muc || ''}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        set_form_data({ ...form_data, ten_danh_muc: name, duong_dan_danh_muc: slug });
                      }}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Đường dẫn (Slug) *</label>
                    <input
                      type="text"
                      required
                      value={form_data.duong_dan_danh_muc || ''}
                      onChange={(e) => set_form_data({ ...form_data, duong_dan_danh_muc: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Mô tả</label>
                    <textarea
                      rows={2}
                      value={form_data.mo_ta || ''}
                      onChange={(e) => set_form_data({ ...form_data, mo_ta: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button type="button" onClick={() => set_modal_loai(null)} style={{ padding: '8px 16px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                    <button type="submit" className="hero-cta-btn" style={{ padding: '8px 20px' }}>Tạo danh mục</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
