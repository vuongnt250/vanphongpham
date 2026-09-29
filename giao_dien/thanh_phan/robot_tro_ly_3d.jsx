import React, { useState, useEffect, useRef } from 'react';

/**
 * RobotTroLy3D: Mô hình Mascot 3D chuẩn xác theo hình mẫu gốc của người dùng
 * Bổ sung đầy đủ các tính năng:
 * - Tỉ lệ đầu đám mây to tròn mũm mĩm, thân ngắn, chân tay béo chuẩn mẫu bên trái
 * - Hành động:
 *    + 'nhay_nhay': Nhảy cẫng lên co 2 chân lên không trung
 *    + 'chay_bo': Chạy bộ nhịp nhàng đập chân và vung tay liên tục
 *    + 'idle': Nhún nhảy lơ lửng bồng bềnh
 * - Biểu cảm khuôn mặt:
 *    + 'mac_dinh': Mắt terminal ">" và "-" xanh mint neon
 *    + 'vui_ve': Mắt cười tít "^ ^", 2 má hồng dạ quang, miệng cười
 *    + 'tuc_gian': Mắt đỏ xếch giận dữ "\ /", tia sấm sét đỏ trên trán
 * - Cho phép bấm chuột vào robot để chuyển đổi tương tác vui nhộn!
 */

export default function RobotTroLy3D({
  kich_thuoc = 98,
  hanh_dong_ngoai, // 'idle' | 'nhay_nhay' | 'chay_bo'
  bieu_cam_ngoai,  // 'mac_dinh' | 'vui_ve' | 'tuc_gian'
  co_bong = true,
  tu_dong_random = true, // Tu dong ngau nhien hanh dong & bieu cam
  onClick,
  onThayDoiTrangThai,
  className = '',
  style = {}
}) {
  // Trang thai noi tai (tu dong random hanh dong va bieu cam)
  const [hanh_dong_noi, set_hanh_dong_noi] = useState('idle');
  const [bieu_cam_noi, set_bieu_cam_noi] = useState('mac_dinh');
  const [chop_mat, set_chop_mat] = useState(false);
  const [dang_hover, set_dang_hover] = useState(false);
  const [goc_nghieng, set_goc_nghieng] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const hanh_dong = hanh_dong_ngoai || hanh_dong_noi;
  const bieu_cam = bieu_cam_ngoai || bieu_cam_noi;

  // Tu dong chop mat khi o bieu cam mac dinh
  useEffect(() => {
    const timer = setInterval(() => {
      if (bieu_cam === 'mac_dinh') {
        set_chop_mat(true);
        setTimeout(() => set_chop_mat(false), 220);
      }
    }, 3200);
    return () => clearInterval(timer);
  }, [bieu_cam]);

  // Vong doi TU DONG RANDOM HANH DONG & BIEU CAM (Life-like random behavior)
  useEffect(() => {
    if (!tu_dong_random || hanh_dong_ngoai || bieu_cam_ngoai) return;

    let timerId;
    let timerKetThuc;

    const lenLichNgauNhien = () => {
      // Thoi gian nghi giua cac hanh dong random tu 2.0s den 4.2s
      const delay = Math.floor(Math.random() * 2200) + 2000;

      timerId = setTimeout(() => {
        // Chon ngau nhien mot hanh dong bat ngo:
        // 35%: Tuc gian rung ban bat + Tia set do \ / (Xuat hien thuong xuyen theo chu ky binh thuong!)
        // 25%: Nhay cay co 2 chan len khong trung + Vui ve
        // 25%: Chay bo bach bach nghieng nguoi + Vui ve
        // 15%: Cuoi tit mat ^ ^ + Ma hong dang yeu
        const rand = Math.random();
        let thoiGianHanhDong = 3200;

        if (rand < 0.35) {
          // Tuc gian doi hon dang yeu
          set_hanh_dong_noi('idle');
          set_bieu_cam_noi('tuc_gian');
          thoiGianHanhDong = 3200;
        } else if (rand < 0.60) {
          // Nhay cay co 2 chan len
          set_hanh_dong_noi('nhay_nhay');
          set_bieu_cam_noi('vui_ve');
          thoiGianHanhDong = 2800;
        } else if (rand < 0.85) {
          // Chay bo lach bach
          set_hanh_dong_noi('chay_bo');
          set_bieu_cam_noi('vui_ve');
          thoiGianHanhDong = 3200;
        } else {
          // Cuoi tit mat ma hong
          set_hanh_dong_noi('idle');
          set_bieu_cam_noi('vui_ve');
          thoiGianHanhDong = 2800;
        }

        // Sau khi het dot hanh dong random, quay ve idle mac dinh va hen gio tiep
        timerKetThuc = setTimeout(() => {
          set_hanh_dong_noi('idle');
          set_bieu_cam_noi('mac_dinh');
          lenLichNgauNhien();
        }, thoiGianHanhDong);

      }, delay);
    };

    lenLichNgauNhien();

    return () => {
      clearTimeout(timerId);
      clearTimeout(timerKetThuc);
    };
  }, [tu_dong_random, hanh_dong_ngoai, bieu_cam_ngoai]);

  // Nghieng 3D theo chuot
  const xu_ly_mouse_move = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    set_goc_nghieng({
      x: Math.max(-12, Math.min(12, -deltaY * 10)),
      y: Math.max(-15, Math.min(15, deltaX * 12))
    });
  };

  const xu_ly_mouse_enter = () => {
    set_dang_hover(true);
    // Khi nguoi dung re chuot vao, robot co the nhay chao mung hoac tuc gian doa ma!
    if (!hanh_dong_ngoai) {
      const r = Math.random();
      if (r < 0.35) {
        set_hanh_dong_noi('idle');
        set_bieu_cam_noi('tuc_gian');
        setTimeout(() => {
          set_bieu_cam_noi('mac_dinh');
        }, 2200);
      } else if (r < 0.8) {
        set_hanh_dong_noi('nhay_nhay');
        set_bieu_cam_noi('vui_ve');
        setTimeout(() => {
          set_hanh_dong_noi('idle');
          set_bieu_cam_noi('mac_dinh');
        }, 2200);
      }
    }
  };

  const xu_ly_mouse_leave = () => {
    set_dang_hover(false);
    set_goc_nghieng({ x: 0, y: 0 });
  };

  // Click vao robot
  const xu_ly_click_robot = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }
    // Vong lap hanh dong ngau nhien khi click
    const ds_hanh_dong = ['nhay_nhay', 'chay_bo', 'idle'];
    const ds_bieu_cam = ['vui_ve', 'tuc_gian', 'mac_dinh'];

    const nextHdIndex = (ds_hanh_dong.indexOf(hanh_dong_noi) + 1) % ds_hanh_dong.length;
    const nextBcIndex = (ds_bieu_cam.indexOf(bieu_cam_noi) + 1) % ds_bieu_cam.length;

    const hdMoi = ds_hanh_dong[nextHdIndex];
    const bcMoi = ds_bieu_cam[nextBcIndex];

    set_hanh_dong_noi(hdMoi);
    set_bieu_cam_noi(bcMoi);

    if (onThayDoiTrangThai) {
      onThayDoiTrangThai({ hanh_dong: hdMoi, bieu_cam: bcMoi });
    }
  };

  // Mau mat theo bieu cam
  let eyeColor = '#00f5a0'; // Neon Mint Cyan mac dinh giong anh
  let eyeGlow = 'rgba(0, 245, 160, 0.9)';
  if (bieu_cam === 'vui_ve') {
    eyeColor = '#38bdf8';
    eyeGlow = 'rgba(56, 189, 248, 0.95)';
  } else if (bieu_cam === 'tuc_gian') {
    eyeColor = '#ef4444';
    eyeGlow = 'rgba(239, 68, 68, 0.95)';
  }

  return (
    <div
      ref={containerRef}
      className={`robot-mascot-root ${className}`}
      onMouseMove={xu_ly_mouse_move}
      onMouseEnter={xu_ly_mouse_enter}
      onMouseLeave={xu_ly_mouse_leave}
      onClick={xu_ly_click_robot}
      style={{
        width: `${kich_thuoc}px`,
        height: `${kich_thuoc * 1.05}px`,
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '700px',
        userSelect: 'none',
        cursor: 'pointer',
        ...style
      }}
      title="Bấm vào tôi để đổi hành động: Nhảy nhót, Chạy bộ và Biểu cảm!"
    >
      {/* Khung hinh Robot voi Class hoat hoa theo hanh dong */}
      <div
        className={`robot-actor-box action-${hanh_dong} emotion-${bieu_cam}`}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${goc_nghieng.x}deg) rotateY(${goc_nghieng.y}deg)`,
          transition: dang_hover ? 'transform 0.08s ease-out' : 'transform 0.35s ease'
        }}
      >
        <svg
          viewBox="0 0 120 124"
          width="100%"
          height="100%"
          style={{ overflow: 'visible', display: 'block' }}
        >
          <defs>
            {/* Gradient mau xanh dam may phong cach Vinyl Mascot cao cap */}
            <linearGradient id="cloudBlue" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#438efb" />
              <stop offset="25%" stopColor="#2b6ced" />
              <stop offset="60%" stopColor="#1e51d8" />
              <stop offset="85%" stopColor="#173bb3" />
              <stop offset="100%" stopColor="#0f267a" />
            </linearGradient>

            {/* Do bong the tich 3D tren than hinh */}
            <radialGradient id="bodyShine" cx="45%" cy="30%" r="65%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.28)" />
              <stop offset="45%" stopColor="rgba(255, 255, 255, 0.05)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0.25)" />
            </radialGradient>

            {/* Man hinh visor cong CRT cong nghe thuc */}
            <radialGradient id="screenDark" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor={bieu_cam === 'tuc_gian' ? '#380c1d' : '#0c1626'} />
              <stop offset="65%" stopColor={bieu_cam === 'tuc_gian' ? '#200712' : '#070d17'} />
              <stop offset="100%" stopColor={bieu_cam === 'tuc_gian' ? '#120309' : '#03060b'} />
            </radialGradient>

            {/* Lop anh sang phan chieu cong tren mat kinh */}
            <linearGradient id="glassSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.28)" />
              <stop offset="40%" stopColor="rgba(255, 255, 255, 0.12)" />
              <stop offset="80%" stopColor="rgba(255, 255, 255, 0)" />
            </linearGradient>

            {/* Do bong mat phat sang phosphor neon */}
            <filter id="eyeNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ================= 1. HAI CHÂN & GIÀY BỐT ================= */}
          <g className="robot-legs-group">
            {/* Chan Trai */}
            <g className="leg-left">
              <rect
                x="37"
                y="94"
                width="18"
                height="22"
                rx="7"
                fill="#1c3886"
                stroke="#0a0f24"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Op bao ho dau goi */}
              <rect x="39" y="96" width="14" height="8" rx="4" fill="#2563eb" />
              {/* De giay cao su chong truot co ranh bam */}
              <path
                d="M 37 112 L 55 112 L 55 116 C 55 116.5 54 117 52 117 L 40 117 C 38 117 37 116.5 37 116 Z"
                fill="#0a0f24"
              />
              <line x1="43" y1="114" x2="43" y2="116" stroke="#1e293b" strokeWidth="1" />
              <line x1="49" y1="114" x2="49" y2="116" stroke="#1e293b" strokeWidth="1" />
            </g>

            {/* Chan Phai */}
            <g className="leg-right">
              <rect
                x="65"
                y="94"
                width="18"
                height="22"
                rx="7"
                fill="#1c3886"
                stroke="#0a0f24"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Op bao ho dau goi */}
              <rect x="67" y="96" width="14" height="8" rx="4" fill="#2563eb" />
              {/* De giay cao su chong truot */}
              <path
                d="M 65 112 L 83 112 L 83 116 C 83 116.5 82 117 80 117 L 68 117 C 66 117 65 116.5 65 116 Z"
                fill="#0a0f24"
              />
              <line x1="71" y1="114" x2="71" y2="116" stroke="#1e293b" strokeWidth="1" />
              <line x1="77" y1="114" x2="77" y2="116" stroke="#1e293b" strokeWidth="1" />
            </g>
          </g>

          {/* ================= 2. THÂN & BỤNG ================= */}
          <g className="robot-torso-group">
            {/* Than robot to day dan */}
            <rect
              x="32"
              y="66"
              width="56"
              height="36"
              rx="16"
              fill="url(#cloudBlue)"
              stroke="#0a0f24"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Lop bong sang the tich 3D tren bung */}
            <rect
              x="32"
              y="66"
              width="56"
              height="36"
              rx="16"
              fill="url(#bodyShine)"
            />

            {/* Bong do tiep xuc duoi cam (Ambient Occlusion Shadow) */}
            <path
              d="M 36 68 Q 60 78 84 68 Q 60 84 36 68"
              fill="rgba(10, 16, 38, 0.42)"
            />

            {/* Duong vien khop noi ky thuat tach eo/that lung */}
            <path
              d="M 36 90 Q 60 94 84 90"
              stroke="#132658"
              strokeWidth="1.2"
              fill="none"
              opacity="0.75"
            />

            {/* Huy hieu Terminal nguc ao: Bang mach LED acrylic tinh xao */}
            <rect
              x="44"
              y="76"
              width="32"
              height="13"
              rx="4"
              fill="#060b17"
              stroke="#182c5a"
              strokeWidth="1.2"
            />
            {/* 4 dinh vit kim loai o 4 goc huy hieu */}
            <circle cx="46" cy="78" r="0.75" fill="#64748b" />
            <circle cx="74" cy="78" r="0.75" fill="#64748b" />
            <circle cx="46" cy="87" r="0.75" fill="#64748b" />
            <circle cx="74" cy="87" r="0.75" fill="#64748b" />

            {/* Ky hieu LED > */}
            <path
              d="M 48 80.5 L 51.5 82.5 L 48 84.5"
              fill="none"
              stroke={eyeColor}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#eyeNeonGlow)"
            />
            {/* Ky hieu LED - */}
            <line
              x1="54.5"
              y1="82.5"
              x2="61.5"
              y2="82.5"
              stroke={eyeColor}
              strokeWidth="1.6"
              strokeLinecap="round"
              filter="url(#eyeNeonGlow)"
            />
            {/* Thanh tin hieu mini 3 vach LED */}
            <rect x="64.5" y="80.8" width="2" height="3.4" rx="0.6" fill={eyeColor} />
            <rect x="67.5" y="80.8" width="2" height="3.4" rx="0.6" fill={eyeColor} />
            <rect x="70.5" y="80.8" width="2" height="3.4" rx="0.6" fill={eyeColor} opacity="0.3" />
          </g>

          {/* ================= 3. HAI TAY & CỔ TAY ================= */}
          <g className="robot-arms-group">
            {/* Tay Trai */}
            <g className="arm-left">
              <rect
                x="20"
                y="67"
                width="14"
                height="26"
                rx="7"
                fill="url(#cloudBlue)"
                stroke="#0a0f24"
                strokeWidth="3.5"
                strokeLinejoin="round"
                transform="rotate(12 27 70)"
              />
              {/* Vong dem co tay găng tay */}
              <line
                x1="22"
                y1="83"
                x2="32"
                y2="85"
                stroke="#0a0f24"
                strokeWidth="2"
                strokeLinecap="round"
                transform="rotate(12 27 70)"
              />
            </g>

            {/* Tay Phai */}
            <g className="arm-right">
              <rect
                x="86"
                y="67"
                width="14"
                height="26"
                rx="7"
                fill="url(#cloudBlue)"
                stroke="#0a0f24"
                strokeWidth="3.5"
                strokeLinejoin="round"
                transform="rotate(-12 93 70)"
              />
              {/* Vong dem co tay */}
              <line
                x1="88"
                y1="85"
                x2="98"
                y2="83"
                stroke="#0a0f24"
                strokeWidth="2"
                strokeLinecap="round"
                transform="rotate(-12 93 70)"
              />
            </g>
          </g>

          {/* ================= 4. ĐẦU ĐÁM MÂY & TAI PODS ================= */}
          <g className="robot-head-group">
            {/* Hai nut tai nghe / communication pucks 2 ben tai */}
            <circle cx="16" cy="44.5" r="5" fill="#1b357f" stroke="#0a0f24" strokeWidth="2.8" />
            <circle cx="16" cy="44.5" r="2" fill={eyeColor} opacity="0.85" />
            <circle cx="104" cy="44.5" r="5" fill="#1b357f" stroke="#0a0f24" strokeWidth="2.8" />
            <circle cx="104" cy="44.5" r="2" fill={eyeColor} opacity="0.85" />

            {/* Duong vien dam may bao quanh mat: Vòm mây cao đỉnh tròn đầy */}
            <path
              d="
                M 22,62
                C 8,54 8,36 18,26
                C 14,14 26,8 38,10
                C 44,4 52,0 60,0
                C 68,0 76,4 82,10
                C 94,8 106,14 102,26
                C 112,36 112,54 98,62
                C 102,73 90,80 78,76
                C 68,81 52,81 42,76
                C 30,80 18,73 22,62 Z
              "
              fill="url(#cloudBlue)"
              stroke="#0a0f24"
              strokeWidth="3.8"
              strokeLinejoin="round"
            />

            {/* Dai bong highlight 3D tren dinh cac mui may va vòm mây cao */}
            <path
              d="
                M 24,24 C 22,15 31,8 40,11
                M 48,5 C 54,1 66,1 72,5
                M 80,11 C 89,8 98,15 96,24
              "
              fill="none"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />

            {/* ================= 5. KHUNG MÀN HÌNH & KÍNH VISOR ================= */}
            {/* Khung viền bezel cao su nhám bên ngoài */}
            <rect
              x="34"
              y="27"
              width="52"
              height="35"
              rx="13.5"
              fill="#0a0f1d"
              stroke="#0a0f24"
              strokeWidth="2.8"
            />

            {/* Lớp kính visor CRT công nghệ sâu thẳm */}
            <rect
              x="36"
              y="29"
              width="48"
              height="31"
              rx="11.5"
              fill="url(#screenDark)"
            />

            {/* Ánh sáng viền trên mặt kính */}
            <path
              d="M 39 30 Q 60 29 81 30"
              stroke="rgba(255, 255, 255, 0.28)"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Vết bóng gương vát cong tự nhiên (Curved Glass Sheen) */}
            <path
              d="M 38 33.5 C 48 32 70 33.5 82 38.5 L 82 31 C 70 29.5 48 29.5 38 31.5 Z"
              fill="url(#glassSheen)"
            />

            {/* ================= 6. MẮT & BIỂU CẢM ================= */}
            {/* TH1: TỨC GIẬN */}
            {bieu_cam === 'tuc_gian' && (
              <g className="eyes-angry" filter="url(#eyeNeonGlow)">
                {/* Vet sam set do tren tran cao */}
                <path
                  d="M 74 16 L 79 11 L 77 17 L 83 14 L 78 21"
                  fill="#ef4444"
                  stroke="#ef4444"
                  strokeWidth="1.2"
                />

                {/* Mat trai xech cheo xuong \ */}
                <line
                  x1="43"
                  y1="40"
                  x2="53"
                  y2="47"
                  stroke={eyeColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Mat phai xech cheo len / */}
                <line
                  x1="67"
                  y1="47"
                  x2="77"
                  y2="40"
                  stroke={eyeColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Mieng tuc gian */}
                <path
                  d="M 56 52 Q 60 50 64 52"
                  fill="none"
                  stroke={eyeColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* TH2: VUI VẺ */}
            {bieu_cam === 'vui_ve' && (
              <g className="eyes-happy" filter="url(#eyeNeonGlow)">
                {/* 2 ma hong */}
                <ellipse cx="41" cy="50" rx="3.5" ry="1.8" fill="rgba(244, 63, 94, 0.6)" />
                <ellipse cx="79" cy="50" rx="3.5" ry="1.8" fill="rgba(244, 63, 94, 0.6)" />

                {/* Mat trai: hinh cung cuoi ^ */}
                <path
                  d="M 43 45 Q 48 37 53 45"
                  fill="none"
                  stroke={eyeColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Mat phai: hinh cung cuoi ^ */}
                <path
                  d="M 67 45 Q 72 37 77 45"
                  fill="none"
                  stroke={eyeColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Mieng cuoi toe toet */}
                <path
                  d="M 56 51 Q 60 56 64 51"
                  fill="none"
                  stroke={eyeColor}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* TH3: MẶC ĐỊNH (> -) */}
            {bieu_cam === 'mac_dinh' && (
              <g className="eyes-default" filter="url(#eyeNeonGlow)">
                {chop_mat ? (
                  <g stroke={eyeColor} strokeWidth="4" strokeLinecap="round">
                    <line x1="43" y1="44.5" x2="54" y2="44.5" />
                    <line x1="66" y1="44.5" x2="77" y2="44.5" />
                  </g>
                ) : (
                  <>
                    {/* Mat trai: Dau nhac lenh > */}
                    <path
                      d="M 44 39.5 L 52 44.5 L 44 49.5"
                      fill="none"
                      stroke={eyeColor}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Mat phai: Con tro gach ngang - */}
                    <line
                      x1="66"
                      y1="47.5"
                      x2="78"
                      y2="47.5"
                      stroke={eyeColor}
                      strokeWidth="4"
                      strokeLinecap="round"
                      className="robot-blinking-cursor"
                    />
                  </>
                )}
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* 7. BÓNG ĐỔ 3D (Đồng bộ theo nhịp nhảy và chạy bộ) */}
      {co_bong && (
        <div
          className={`robot-ground-shadow shadow-act-${hanh_dong}`}
          style={{
            width: `${kich_thuoc * 0.58}px`,
            height: `${kich_thuoc * 0.12}px`,
            background: 'radial-gradient(ellipse at center, rgba(10, 15, 36, 0.45) 0%, rgba(10, 15, 36, 0.08) 60%, transparent 80%)',
            borderRadius: '50%',
            marginTop: '-6px'
          }}
        />
      )}
    </div>
  );
}


