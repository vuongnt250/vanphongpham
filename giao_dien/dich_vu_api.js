// Module goi API tap trung danh cho Frontend (SmartDesk - TV1 + TV2 + TV3)
const BASE_URL = '/api';

function lay_token() {
  try {
    return localStorage.getItem('smartdesk_token') || '';
  } catch (e) {
    return '';
  }
}

async function goi_api(duong_dan, options = {}) {
  const url = `${BASE_URL}${duong_dan}`;
  const token = lay_token();

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Máy chủ phản hồi không đúng định dạng JSON. Vui lòng kiểm tra backend.');
    }

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || `Lỗi máy chủ (${res.status})`);
    }
    return json;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại dịch vụ Backend.');
    }
    throw err;
  }
}

export const api_client = {
  // === TV1: SAN PHAM, DANH MUC, DANH GIA, HINH ANH ===
  async lay_san_pham(params = {}) {
    const query = new URLSearchParams();
    Object.keys(params).forEach(k => {
      if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
        query.append(k, params[k]);
      }
    });
    const qs = query.toString();
    return goi_api(`/san-pham${qs ? `?${qs}` : ''}`);
  },

  async lay_chi_tiet_san_pham(id) {
    return goi_api(`/san-pham/${id}`);
  },

  async lay_danh_muc(trang_thai = 'hoat_dong') {
    return goi_api(`/danh-muc${trang_thai ? `?trang_thai=${trang_thai}` : ''}`);
  },

  async lay_thuong_hieu() {
    return goi_api('/san-pham/thuong-hieu');
  },

  async lay_danh_gia_san_pham(san_pham_id) {
    return goi_api(`/san-pham/${san_pham_id}/danh-gia`);
  },

  async gui_danh_gia(san_pham_id, du_lieu) {
    return goi_api(`/san-pham/${san_pham_id}/danh-gia`, {
      method: 'POST',
      body: JSON.stringify(du_lieu)
    });
  },

  async lay_banner_trang_chu() {
    return goi_api('/banner');
  },

  // === TV2: AUTH, DIA CHI, GIO HANG, VOUCHER, DON HANG, THANH TOAN ===
  async dang_ky(du_lieu) {
    return goi_api('/auth/dang-ky', {
      method: 'POST',
      body: JSON.stringify(du_lieu)
    });
  },

  async dang_nhap(tai_khoan, mat_khau) {
    return goi_api('/auth/dang-nhap', {
      method: 'POST',
      body: JSON.stringify({ tai_khoan, mat_khau })
    });
  },

  async lay_profile() {
    return goi_api('/auth/me');
  },

  async cap_nhat_profile(du_lieu) {
    return goi_api('/auth/cap-nhat', {
      method: 'PUT',
      body: JSON.stringify(du_lieu)
    });
  },

  async doi_mat_khau(mat_khau_cu, mat_khau_moi) {
    return goi_api('/auth/doi-mat-khau', {
      method: 'POST',
      body: JSON.stringify({ mat_khau_cu, mat_khau_moi })
    });
  },

  // Dia chi
  async lay_dia_chi() {
    return goi_api('/dia-chi');
  },

  async them_dia_chi(du_lieu) {
    return goi_api('/dia-chi', {
      method: 'POST',
      body: JSON.stringify(du_lieu)
    });
  },

  async sua_dia_chi(id, du_lieu) {
    return goi_api(`/dia-chi/${id}`, {
      method: 'PUT',
      body: JSON.stringify(du_lieu)
    });
  },

  async xoa_dia_chi(id) {
    return goi_api(`/dia-chi/${id}`, {
      method: 'DELETE'
    });
  },

  async dat_dia_chi_mac_dinh(id) {
    return goi_api(`/dia-chi/${id}/mac-dinh`, {
      method: 'PUT'
    });
  },

  // Gio hang DB
  async lay_gio_hang() {
    return goi_api('/gio-hang');
  },

  async them_vao_gio(san_pham_id, so_luong = 1) {
    return goi_api('/gio-hang/them', {
      method: 'POST',
      body: JSON.stringify({ san_pham_id, so_luong })
    });
  },

  async sua_so_luong_gio(san_pham_id, so_luong) {
    return goi_api('/gio-hang/sua', {
      method: 'PUT',
      body: JSON.stringify({ san_pham_id, so_luong })
    });
  },

  async xoa_khoi_gio(san_pham_id) {
    return goi_api(`/gio-hang/xoa/${san_pham_id}`, {
      method: 'DELETE'
    });
  },

  async xoa_het_gio() {
    return goi_api('/gio-hang/xoa-het', {
      method: 'DELETE'
    });
  },

  // Voucher
  async kiem_tra_voucher(ma_voucher, tong_tien) {
    return goi_api('/voucher/kiem-tra', {
      method: 'POST',
      body: JSON.stringify({ ma_voucher, tong_tien })
    });
  },

  // Don hang
  async tao_don_hang(du_lieu) {
    return goi_api('/don-hang', {
      method: 'POST',
      body: JSON.stringify(du_lieu)
    });
  },

  async lay_don_hang_cua_toi() {
    return goi_api('/don-hang/cua-toi');
  },

  async lay_chi_tiet_don_hang(id) {
    return goi_api(`/don-hang/${id}`);
  },

  async huy_don_hang(id) {
    return goi_api(`/don-hang/${id}/huy`, {
      method: 'POST'
    });
  },

  async xac_nhan_thanh_toan(don_hang_id, ma_giao_dich) {
    return goi_api('/thanh-toan/xac-nhan', {
      method: 'POST',
      body: JSON.stringify({ don_hang_id, ma_giao_dich, trang_thai: 'paid' })
    });
  },

  // === TV3: ADMIN DASHBOARD & QUAN LY KINH DOANH ===
  async lay_thong_ke_admin() {
    return goi_api('/admin/thong-ke');
  },

  async lay_don_hang_admin(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return goi_api(`/admin/don-hang${qs ? `?${qs}` : ''}`);
  },

  async cap_nhat_trang_thai_don_admin(id, trang_thai) {
    return goi_api(`/admin/don-hang/${id}/trang-thai`, {
      method: 'PUT',
      body: JSON.stringify({ trang_thai })
    });
  },

  async lay_khach_hang_admin(tu_khoa = '') {
    return goi_api(`/admin/khach-hang${tu_khoa ? `?tu_khoa=${encodeURIComponent(tu_khoa)}` : ''}`);
  },

  async doi_trang_thai_khach_admin(id, trang_thai) {
    return goi_api(`/admin/khach-hang/${id}/trang-thai`, {
      method: 'PUT',
      body: JSON.stringify({ trang_thai })
    });
  },

  async lay_kho_admin(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return goi_api(`/admin/kho${qs ? `?${qs}` : ''}`);
  },

  async dieu_chinh_kho_admin(du_lieu) {
    return goi_api('/admin/kho/dieu-chinh', {
      method: 'POST',
      body: JSON.stringify(du_lieu)
    });
  },

  async lay_nha_cung_cap_admin() {
    return goi_api('/admin/nha-cung-cap');
  },

  async them_nha_cung_cap_admin(du_lieu) {
    return goi_api('/admin/nha-cung-cap', {
      method: 'POST',
      body: JSON.stringify(du_lieu)
    });
  },

  async sua_nha_cung_cap_admin(id, du_lieu) {
    return goi_api(`/admin/nha-cung-cap/${id}`, {
      method: 'PUT',
      body: JSON.stringify(du_lieu)
    });
  },

  async xoa_nha_cung_cap_admin(id) {
    return goi_api(`/admin/nha-cung-cap/${id}`, {
      method: 'DELETE'
    });
  },

  async lay_voucher_admin() {
    return goi_api('/voucher');
  },

  async them_voucher_admin(du_lieu) {
    return goi_api('/voucher', {
      method: 'POST',
      body: JSON.stringify(du_lieu)
    });
  },

  async sua_voucher_admin(id, du_lieu) {
    return goi_api(`/voucher/${id}`, {
      method: 'PUT',
      body: JSON.stringify(du_lieu)
    });
  },

  async xoa_voucher_admin(id) {
    return goi_api(`/voucher/${id}`, {
      method: 'DELETE'
    });
  },

  async lay_banner_admin() {
    return goi_api('/admin/banner');
  },

  async them_banner_admin(du_lieu) {
    return goi_api('/admin/banner', {
      method: 'POST',
      body: JSON.stringify(du_lieu)
    });
  },

  async sua_banner_admin(id, du_lieu) {
    return goi_api(`/admin/banner/${id}`, {
      method: 'PUT',
      body: JSON.stringify(du_lieu)
    });
  },

  async xoa_banner_admin(id) {
    return goi_api(`/admin/banner/${id}`, {
      method: 'DELETE'
    });
  },

  // CRUD San pham Admin
  async them_san_pham_admin(du_lieu) {
    return goi_api('/san-pham', {
      method: 'POST',
      body: JSON.stringify(du_lieu)
    });
  },

  async sua_san_pham_admin(id, du_lieu) {
    return goi_api(`/san-pham/${id}`, {
      method: 'PUT',
      body: JSON.stringify(du_lieu)
    });
  },

  async xoa_san_pham_admin(id) {
    return goi_api(`/san-pham/${id}`, {
      method: 'DELETE'
    });
  },

  // CRUD Danh muc Admin
  async them_danh_muc_admin(du_lieu) {
    return goi_api('/danh-muc', {
      method: 'POST',
      body: JSON.stringify(du_lieu)
    });
  },

  async sua_danh_muc_admin(id, du_lieu) {
    return goi_api(`/danh-muc/${id}`, {
      method: 'PUT',
      body: JSON.stringify(du_lieu)
    });
  },

  async xoa_danh_muc_admin(id) {
    return goi_api(`/danh-muc/${id}`, {
      method: 'DELETE'
    });
  },

  // === TRO LY AI SHOPPING ASSISTANT ===
  async gui_tin_nhan_ai(tin_nhan, lich_su = []) {
    return goi_api('/ai-chat', {
      method: 'POST',
      body: JSON.stringify({
        tin_nhan,
        lich_su
      })
    });
  },

  // === TICKET HO TRO KHÁCH HÀNG & LIVE CHAT ADMIN ===
  async lay_danh_sach_ticket_khach(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return goi_api(`/ticket${qs ? `?${qs}` : ''}`);
  },

  async tao_ticket_ho_tro(du_lieu) {
    return goi_api('/ticket', {
      method: 'POST',
      body: JSON.stringify(du_lieu)
    });
  },

  async lay_chi_tiet_ticket(ma_ticket) {
    return goi_api(`/ticket/${ma_ticket}`);
  },

  async gui_tin_nhan_ticket(ticket_id, noi_dung, ten_nguoi_gui = '') {
    return goi_api(`/ticket/${ticket_id}/tin-nhan`, {
      method: 'POST',
      body: JSON.stringify({
        noi_dung,
        ten_nguoi_gui
      })
    });
  },

  // Admin Ticket Management
  async lay_danh_sach_ticket_admin(params = {}) {
    const query = new URLSearchParams();
    Object.keys(params).forEach(k => {
      if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
        query.append(k, params[k]);
      }
    });
    const qs = query.toString();
    return goi_api(`/admin/ticket${qs ? `?${qs}` : ''}`);
  },

  async lay_chi_tiet_ticket_admin(id) {
    return goi_api(`/admin/ticket/${id}`);
  },

  async admin_tra_loi_ticket(id, noi_dung) {
    return goi_api(`/admin/ticket/${id}/tra-loi`, {
      method: 'POST',
      body: JSON.stringify({ noi_dung })
    });
  },

  async admin_cap_nhat_trang_thai_ticket(id, trang_thai) {
    return goi_api(`/admin/ticket/${id}/trang-thai`, {
      method: 'PUT',
      body: JSON.stringify({ trang_thai })
    });
  },

  async admin_xoa_ticket(id) {
    return goi_api(`/admin/ticket/${id}`, {
      method: 'DELETE'
    });
  }
};

export default api_client;