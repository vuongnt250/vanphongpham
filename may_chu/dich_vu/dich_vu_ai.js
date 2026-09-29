// Dich vu: dich_vu_ai.js
// Xu ly logic tro ly AI SmartDesk (Gemini API + NLP RAG Database Engine)
const mo_hinh_san_pham = require('../../co_so_du_lieu/mo_hinh/san_pham');
const mo_hinh_ma_giam_gia = require('../../co_so_du_lieu/mo_hinh/ma_giam_gia');
const mo_hinh_danh_muc = require('../../co_so_du_lieu/mo_hinh/danh_muc');

/**
 * He thong cau tra loi thong minh noi bo dua tren du lieu SmartDesk
 */
function xu_ly_noi_bo(cau_hoi, lich_su = []) {
  const q = cau_hoi.toLowerCase().trim();

  // 1. Kiem tra cau hoi ve ma giam gia / voucher / khuyen mai
  if (q.includes('voucher') || q.includes('mã giảm') || q.includes('ma giam') || q.includes('khuyến mãi') || q.includes('khuyen mai') || q.includes('uu dai') || q.includes('ưu đãi')) {
    let vouchers = [];
    try {
      vouchers = mo_hinh_ma_giam_gia.lay_tat_ca({ trang_thai: 'hoat_dong' }) || [];
    } catch (e) {
      vouchers = [];
    }

    if (vouchers.length > 0) {
      const dsVoucherStr = vouchers.slice(0, 4).map(v => {
        const laPhanTram = v.loai_giam_gia === 'percent' || v.loai_giam_gia === 'phan_tram';
        const giam = laPhanTram ? `${v.gia_tri}%` : `${Number(v.gia_tri).toLocaleString('vi-VN')}đ`;
        const minVal = v.gia_tri_don_toi_thieu > 0 ? ` cho đơn từ ${Number(v.gia_tri_don_toi_thieu).toLocaleString('vi-VN')}đ` : '';
        return `• **${v.ma_voucher}**: ${v.ten_voucher} (Giảm ${giam}${minVal})`;
      }).join('\n');

      return {
        tin_nhan_ai: `🎉 Hiện SmartDesk đang có các mã ưu đãi hấp dẫn dành cho bạn:\n\n${dsVoucherStr}\n\n👉 Bạn hãy nhập mã tại bước thanh toán để được giảm giá ngay nhé!`,
        san_pham_goi_y: lay_san_pham_goi_y({ noi_bat: 1, limit: 3 })
      };
    } else {
      return {
        tin_nhan_ai: 'Hiện tại các chương trình voucher đang được cập nhật. Bạn vẫn có thể mua sắm các sản phẩm đang được giảm giá trực tiếp trên trang chủ nhé!',
        san_pham_goi_y: lay_san_pham_goi_y({ noi_bat: 1, limit: 3 })
      };
    }
  }

  // 2. Kiem tra chinh sach doi tra
  if (q.includes('đổi trả') || q.includes('doi tra') || q.includes('hoàn tiền') || q.includes('hoan tien') || q.includes('lỗi')) {
    return {
      tin_nhan_ai: `🔄 **Chính sách đổi trả tại SmartDesk:**\n\n1. **Thời hạn:** Hỗ trợ đổi trả trong vòng **7 ngày** kể từ khi nhận hàng.\n2. **Điều kiện:** Sản phẩm còn nguyên tem, hộp, phụ kiện và chưa qua sử dụng (hoặc lỗi do nhà sản xuất/hư hỏng do vận chuyển).\n3. **Chi phí:** Miễn phí 100% chi phí vận chuyển đổi trả nếu lỗi thuộc về SmartDesk.\n\n📞 Hotline hỗ trợ đổi trả nhanh: **1900 1234**.`,
      san_pham_goi_y: []
    };
  }

  // 3. Kiem tra chinh sach giao hang / van chuyen
  if (q.includes('giao hàng') || q.includes('giao hang') || q.includes('vận chuyển') || q.includes('van chuyen') || q.includes('ship') || q.includes('phí giao')) {
    return {
      tin_nhan_ai: `🚚 **Chính sách giao hàng của SmartDesk:**\n\n• **Giao hỏa tốc 2H:** Áp dụng cho khu vực nội thành Hà Nội & TP.HCM.\n• **Giao tiêu chuẩn:** 1 - 3 ngày trên toàn quốc.\n• **Miễn phí vận chuyển:** Áp dụng cho đơn hàng từ **300.000đ** trở lên.\n• **Đồng kiểm:** Khách hàng được kiểm tra hàng trước khi thanh toán (COD).`,
      san_pham_goi_y: []
    };
  }

  // 4. Kiem tra hoa don VAT / Doanh nghiep B2B
  if (q.includes('vat') || q.includes('hóa đơn') || q.includes('hoa don') || q.includes('doanh nghiệp') || q.includes('doanh nghiep') || q.includes('b2b') || q.includes('mua sỉ') || q.includes('mua si')) {
    return {
      tin_nhan_ai: `🏢 **Dịch vụ Mua hàng Doanh nghiệp & Hóa đơn VAT:**\n\n• SmartDesk hỗ trợ xuất **Hóa đơn điện tử VAT (10% / 8%) trong ngày** cho mọi đơn hàng doanh nghiệp.\n• Chiết khấu đặc biệt từ **5% - 25%** cho các đơn hàng văn phòng phẩm số lượng lớn hoặc hợp đồng định kỳ.\n• Hỗ trợ công nợ 30 ngày cho đối tác doanh nghiệp uy tín.\n\n✉️ Liên hệ B2B: **b2b@smartdesk.vn** | Hotline: **1900 1234**.`,
      san_pham_goi_y: lay_san_pham_goi_y({ limit: 3 })
    };
  }

  // 5. Kiem tra bao hanh
  if (q.includes('bảo hành') || q.includes('bao hanh') || q.includes('co/cq') || q.includes('chứng chỉ') || q.includes('chinh hang')) {
    return {
      tin_nhan_ai: `🛡️ **Chính sách bảo hành & Chất lượng:**\n\n• 100% sản phẩm văn phòng phẩm và thiết bị tại SmartDesk là hàng chính hãng từ các thương hiệu hàng đầu: Thiên Long, Double A, Deli, Casio, Kingston, HP...\n• Thiết bị điện tử & máy tính văn phòng được bảo hành chính hãng từ **12 - 24 tháng**.\n• Cung cấp đầy đủ giấy chứng nhận xuất xứ CO/CQ cho các dự án và thầu văn phòng.`,
      san_pham_goi_y: []
    };
  }

  // 6. Kiem tra thong tin lien he / cua hang
  if (q.includes('liên hệ') || q.includes('lien he') || q.includes('địa chỉ') || q.includes('dia chi') || q.includes('số điện thoại') || q.includes('hotline') || q.includes('ở đâu')) {
    return {
      tin_nhan_ai: `📍 **Thông tin liên hệ SmartDesk:**\n\n• **Trụ sở:** Tầng 5, Tòa nhà Văn phòng SmartDesk, Hà Nội\n• **Tổng đài CSKH:** 1900 1234 (8:00 - 21:00 hàng ngày)\n• **Email hỗ trợ:** support@smartdesk.vn\n• **Website:** smartdesk.vn`,
      san_pham_goi_y: []
    };
  }

  // 7. San pham ban chay / hot / pho bien
  if (q.includes('bán chạy') || q.includes('ban chay') || q.includes('hot') || q.includes('nổi bật') || q.includes('noi bat') || q.includes('phổ biến') || q.includes('top')) {
    const sp = lay_san_pham_goi_y({ sap_xep: 'ban_chay', limit: 4 });
    return {
      tin_nhan_ai: `🔥 Dưới đây là các sản phẩm văn phòng phẩm **bán chạy và được ưa chuộng nhất** tại SmartDesk hiện nay:`,
      san_pham_goi_y: sp
    };
  }

  // 8. Tim kiem theo khoang gia (duoi 50k, duoi 100k, re nhat...)
  if (q.includes('dưới 50') || q.includes('duoi 50k') || q.includes('50.000') || q.includes('giá rẻ') || q.includes('gia re')) {
    const sp = lay_san_pham_goi_y({ gia_den: 50000, sap_xep: 'gia_tang', limit: 4 });
    return {
      tin_nhan_ai: `💰 Dưới đây là các sản phẩm giá tiết kiệm (dưới 50.000đ) chất lượng tốt tại SmartDesk:`,
      san_pham_goi_y: sp
    };
  }

  if (q.includes('dưới 100') || q.includes('duoi 100k') || q.includes('100.000')) {
    const sp = lay_san_pham_goi_y({ gia_den: 100000, sap_xep: 'gia_tang', limit: 4 });
    return {
      tin_nhan_ai: `✨ Dưới đây là các sản phẩm tiện ích giá dưới 100.000đ dành cho bạn:`,
      san_pham_goi_y: sp
    };
  }

  // 9. Tim kiem san pham theo tu khoa / danh muc / thuong hieu
  const tuKhoaTimKiem = truyen_loc_tu_khoa(q);
  if (tuKhoaTimKiem) {
    const sp = lay_san_pham_goi_y({ tu_khoa: tuKhoaTimKiem, limit: 4 });
    if (sp.length > 0) {
      return {
        tin_nhan_ai: `🔎 Tôi tìm thấy một số sản phẩm phù hợp với nhu cầu **"${tuKhoaTimKiem}"** của bạn:`,
        san_pham_goi_y: sp
      };
    }
  }

  // 10. Cau chao hoi mac dinh
  if (q.includes('chào') || q.includes('chao') || q.includes('hello') || q.includes('hi') || q.includes('ơi') || q.includes('oi')) {
    return {
      tin_nhan_ai: `👋 Xin chào! Tôi là **Trợ lý AI SmartDesk** 🤖.\n\nTôi có thể giúp bạn:\n• 🔍 Tìm kiếm và gợi ý các loại văn phòng phẩm phù hợp.\n• 🏷️ Kiểm tra mã giảm giá, khuyến mãi hôm nay.\n• 📦 Tư vấn chính sách giao hàng, đổi trả & bảo hành.\n• 🏢 Hỗ trợ thông tin mua sỉ & xuất hóa đơn VAT doanh nghiệp.\n\nBạn đang quan tâm đến sản phẩm hoặc dịch vụ nào ạ?`,
      san_pham_goi_y: lay_san_pham_goi_y({ noi_bat: 1, limit: 3 })
    };
  }

  // 11. Mac dinh: Goi y san pham noi bat kem loi giai thich
  const spMacDinh = lay_san_pham_goi_y({ noi_bat: 1, limit: 3 });
  return {
    tin_nhan_ai: `Cảm ơn bạn đã nhắn tin cho Trợ lý AI SmartDesk! Bạn có thể hỏi tôi về các loại văn phòng phẩm như: **giấy in Double A**, **bút viết Thiên Long**, **sổ tay Deli**, **máy tính Casio**, hoặc các **chính sách đổi trả, giao hàng và khuyến mãi**.\n\nDưới đây là một số sản phẩm nổi bật bạn có thể tham khảo:`,
    san_pham_goi_y: spMacDinh
  };
}

/**
 * Loc bo cac tu dung (stop words) de trich xuat tu khoa san pham
 */
function truyen_loc_tu_khoa(query) {
  let clean = query
    .replace(/^(tìm|tim|mua|cần|can|tư vấn|tu van|cho tôi|cho toi|xem|bán|ban|có|co|loại|loai)\s+/gi, '')
    .replace(/(nào|nao|không|khong|với|voi|ạ|a|nhỉ|nhi|giúp|giup)\b/gi, '')
    .trim();

  const keywords = [
    'giấy double a', 'giay double a', 'giấy a4', 'giay a4', 'giấy in', 'giay in', 'giấy', 'giay',
    'bút bi', 'but bi', 'bút dạ', 'but da', 'bút gel', 'but gel', 'bút chì', 'but chi', 'bút', 'but',
    'sổ tay', 'so tay', 'sổ lò xo', 'so lo xo', 'sổ', 'so',
    'casio', 'máy tính', 'may tinh',
    'kéo', 'keo', 'băng dính', 'bang dinh', 'băng keo', 'bang keo',
    'bìa hồ sơ', 'bia ho so', 'file hồ sơ', 'file ho so', 'kẹp', 'kep',
    'deli', 'thiên long', 'thien long', 'kingston', 'panasonic',
    'usb', 'pin'
  ];

  for (const kw of keywords) {
    if (clean.includes(kw)) {
      return kw;
    }
  }

  return clean.length >= 2 ? clean : '';
}

/**
 * Lay danh sach san pham thuc te tu CSDL de lam goi y
 */
function lay_san_pham_goi_y(bo_loc = {}) {
  try {
    const ket_qua = mo_hinh_san_pham.lay_danh_sach({
      trang_thai: 'hoat_dong',
      so_luong_moi_trang: bo_loc.limit || 4,
      ...bo_loc
    });

    if (!ket_qua || !Array.isArray(ket_qua.danh_sach)) {
      return [];
    }

    const soLuong = bo_loc.limit || 4;
    return ket_qua.danh_sach.slice(0, soLuong).map(sp => ({
      id: sp.id,
      ten_san_pham: sp.ten_san_pham,
      gia: sp.gia,
      gia_goc: sp.gia_goc,
      thuong_hieu: sp.thuong_hieu,
      don_vi_tinh: sp.don_vi_tinh,
      diem_danh_gia: sp.diem_danh_gia,
      so_luot_danh_gia: sp.so_luot_danh_gia,
      anh_chinh: sp.anh_chinh || '/images/san_pham/default.png',
      ten_danh_muc: sp.ten_danh_muc
    }));
  } catch (e) {
    return [];
  }
}

/**
 * Goi Gemini API neu co cau hinh GEMINI_API_KEY
 */
async function goi_gemini_api(cau_hoi, lich_su = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  let contextSanPham = '';
  try {
    const list = mo_hinh_san_pham.lay_danh_sach({ so_luong_moi_trang: 12, trang_thai: 'hoat_dong' });
    if (list && list.danh_sach) {
      contextSanPham = list.danh_sach.map(s => `- ID ${s.id}: ${s.ten_san_pham} (${s.thuong_hieu}) - Giá: ${s.gia.toLocaleString('vi-VN')}đ`).join('\n');
    }
  } catch (e) {}

  const systemInstruction = `Bạn là Trợ lý Mua sắm Thông minh AI của SmartDesk (Hệ sinh thái thương mại điện tử văn phòng phẩm hàng đầu).
Quy tắc:
- Luôn thân thiện, lịch sự, chuyên nghiệp bằng tiếng Việt.
- Tư vấn đúng sản phẩm, mức giá, chính sách của SmartDesk.
- Cửa hàng hỗ trợ: Giao hàng hỏa tốc 2H, miễn phí ship từ 300.000đ, đổi trả 7 ngày, xuất hóa đơn VAT trong ngày cho doanh nghiệp, Hotline 1900 1234.
- Một số sản phẩm tiêu biểu của cửa hàng:
${contextSanPham}
- Câu trả lời nên ngắn gọn, súc tích (dưới 150 từ), dễ đọc với định dạng gạch đầu dòng rõ ràng.`;

  const contents = [];
  if (Array.isArray(lich_su)) {
    lich_su.slice(-4).forEach(item => {
      contents.push({
        role: item.nguoi_gui === 'user' ? 'user' : 'model',
        parts: [{ text: item.noi_dung || '' }]
      });
    });
  }
  contents.push({
    role: 'user',
    parts: [{ text: cau_hoi }]
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API HTTP ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || null;
}

const dich_vu_ai = {
  async xu_ly_chat({ tin_nhan, lich_su = [] }) {
    if (!tin_nhan || typeof tin_nhan !== 'string' || !tin_nhan.trim()) {
      throw new Error('Tin nhắn không được để trống.');
    }

    const cau_hoi = tin_nhan.trim();

    // 1. Thu goi Gemini API neu co GEMINI_API_KEY
    if (process.env.GEMINI_API_KEY) {
      try {
        const phanHoiGemini = await goi_gemini_api(cau_hoi, lich_su);
        if (phanHoiGemini) {
          const tuKhoa = truyen_loc_tu_khoa(cau_hoi.toLowerCase());
          const sanPhamGoiY = tuKhoa ? lay_san_pham_goi_y({ tu_khoa: tuKhoa, limit: 3 }) : [];

          return {
            nguon: 'gemini',
            tin_nhan_ai: phanHoiGemini,
            san_pham_goi_y: sanPhamGoiY
          };
        }
      } catch (err) {
        console.warn('Lỗi gọi Gemini API, chuyển sang SmartDesk Knowledge Engine:', err.message);
      }
    }

    // 2. Chay qua Engine thong minh noi bo cua SmartDesk (NLP & Product Matcher)
    const ketQuaNoiBo = xu_ly_noi_bo(cau_hoi, lich_su);
    return {
      nguon: 'smartdesk_ai',
      ...ketQuaNoiBo
    };
  }
};

module.exports = dich_vu_ai;
