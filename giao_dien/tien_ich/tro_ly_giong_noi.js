/**
 * Tiện ích Nhận diện Giọng nói tiếng Việt (Web Speech API)
 * Tương thích Google Chrome, Microsoft Edge, Cốc Cốc, Safari...
 * Hỗ trợ nhận diện thời gian thực (Real-time live streaming) với interimResults.
 */

export function kiem_tra_ho_tro_giong_noi() {
  return typeof window !== 'undefined' && Boolean(
    window.SpeechRecognition || window.webkitSpeechRecognition
  );
}

export function bat_dau_nghe_giong_noi(options = {}) {
  const {
    onStart,
    onBatDau,
    onResult,
    onKetQua,
    onInterim,
    onTrucTiep,
    onError,
    onLoi,
    onEnd,
    onKetThuc,
    lang = 'vi-VN'
  } = options;

  const fnStart = onStart || onBatDau;
  const fnResult = onResult || onKetQua;
  const fnInterim = onInterim || onTrucTiep;
  const fnError = onError || onLoi;
  const fnEnd = onEnd || onKetThuc;

  const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  
  if (!SpeechRecognition) {
    const err = new Error('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói Web Speech API. Vui lòng mở trang web trên Google Chrome hoặc Microsoft Edge nhé!');
    if (fnError) fnError(err);
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false; // Dung khi nguoi dung ngung noi
    recognition.interimResults = true; // Bat nhan dien truc tiep thoi gian thuc tung tu mot
    recognition.maxAlternatives = 1;

    let van_ban_cuoi_cung = '';

    recognition.onstart = () => {
      if (fnStart) fnStart();SpeechRecognition 
    };

    recognition.onresult = (event) => {
      let van_ban_tam_thoi = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        const doan_noi = item[0]?.transcript || '';
        if (item.isFinal) {
          van_ban_cuoi_cung += (van_ban_cuoi_cung ? ' ' : '') + doan_noi;
        } else {
          van_ban_tam_thoi += (van_ban_tam_thoi ? ' ' : '') + doan_noi;
        }
      }

      const van_ban_hien_tai = (van_ban_cuoi_cung + (van_ban_tam_thoi ? ' ' + van_ban_tam_thoi : '')).trim();

      // Cap nhat truc tiep vao o tim kiem ngay khi may vua nghe duoc
      if (van_ban_hien_tai) {
        if (fnInterim) {
          fnInterim(van_ban_hien_tai);
        } else if (fnResult) {
          fnResult(van_ban_hien_tai, false);
        }
      }
    };

    recognition.onerror = (event) => {
      console.warn('SpeechRecognition error:', event.error);
      if (event.error === 'no-speech') {
        // Nguoi dung chua noi gi ma ngung
        return;
      }
      if (fnError) {
        let msg = 'Không nhận diện được giọng nói. Vui lòng thử lại!';
        if (event.error === 'not-allowed') {
          msg = 'Bạn hãy bấm cho phép (Allow) quyền Micro trên thanh địa chỉ trình duyệt để sử dụng tìm kiếm giọng nói nhé!';
        }
        fnError(new Error(msg));
      }
    };

    recognition.onend = () => {
      const ket_qua_chot = van_ban_cuoi_cung.trim();
      if (fnResult) {
        fnResult(ket_qua_chot, true);
      }
      if (fnEnd) {
        fnEnd(ket_qua_chot);
      }
    };

    recognition.start();
    return recognition;
  } catch (err) {
    console.error('Lỗi khởi động SpeechRecognition:', err);
    if (fnError) fnError(err);
    return null;
  }
}

