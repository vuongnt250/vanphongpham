// Script kiem tra cu phap va chat luong code (Real Lint & Syntax Verification)
// Su dung esbuild Engine de phan tich AST toan bo CommonJS, ESM va React JSX
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const thu_muc_quet = ['may_chu', 'co_so_du_lieu', 'giao_dien'];
let tong_so_file = 0;
let so_loi = 0;
const loi_chi_tiet = [];

function quet_thu_muc(dir) {
  const danh_sach = fs.readdirSync(dir);
  for (const item of danh_sach) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      quet_thu_muc(fullPath);
    } else if (item.endsWith('.js') || item.endsWith('.jsx')) {
      tong_so_file++;
      kiem_tra_file(fullPath, item.endsWith('.jsx') ? 'jsx' : 'js');
    }
  }
}

function kiem_tra_file(filePath, loader) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // 1. Kiem tra cu phap qua esbuild AST Parser
  try {
    esbuild.transformSync(content, {
      loader: loader === 'jsx' ? 'jsx' : 'js',
      target: 'es2020',
      sourcefile: filePath
    });
  } catch (err) {
    so_loi++;
    loi_chi_tiet.push(`[SYNTAX ERROR] ${filePath}: ${err.message}`);
    return;
  }

  // 2. Kiem tra debugger statements
  if (/\bdebugger\b/.test(content)) {
    so_loi++;
    loi_chi_tiet.push(`[LINT WARNING] ${filePath}: Phát hiện từ khóa 'debugger' còn sót lại.`);
  }

  // 3. Kiem tra hardcoded fallback JWT cu
  if (content.includes("'smartdesk_super_secret_jwt_key_2026'")) {
    so_loi++;
    loi_chi_tiet.push(`[SECURITY LINT] ${filePath}: Phát hiện hardcoded JWT key cũ!`);
  }
}

console.log('--- BẮT ĐẦU KIỂM TRA LINT & CÚ PHÁP TOÀN DIỆN (BACKEND, DB, FRONTEND) ---');
for (const tm of thu_muc_quet) {
  const dirPath = path.join(__dirname, '..', tm);
  if (fs.existsSync(dirPath)) {
    quet_thu_muc(dirPath);
  }
}

console.log(`Đã quét tổng cộng: ${tong_so_file} files (.js & .jsx).`);

if (so_loi > 0) {
  console.error(`\n❌ Phát hiện ${so_loi} lỗi lint / cú pháp:`);
  loi_chi_tiet.forEach(l => console.error(`  - ${l}`));
  process.exit(1);
} else {
  console.log('✅ 100% files đều vượt qua kiểm tra cú pháp, AST và quy tắc an toàn mã nguồn.\n');
  process.exit(0);
}
