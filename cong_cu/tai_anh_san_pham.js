const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database.json');
const OUT_DIR = path.join(__dirname, '../public/images/products');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchImageUrls(query) {
  const url = 'https://duckduckgo.com/?q=' + encodeURIComponent(query);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const text = await res.text();
    const vqdMatch = text.match(/vqd=([\d-]+)/);
    if (!vqdMatch) return [];

    const vqd = vqdMatch[1];
    const imgApi = 'https://duckduckgo.com/i.js?l=wt-wt&o=json&q=' + encodeURIComponent(query) + '&vqd=' + vqd + '&f=,,,';
    const imgRes = await fetch(imgApi, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const json = await imgRes.json();
    if (json.results && json.results.length > 0) {
      return json.results.slice(0, 5).map(r => r.image);
    }
  } catch (err) {
    console.error('Search error for:', query, err.message);
  }
  return [];
}

async function downloadFile(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    redirect: 'follow',
    signal: AbortSignal.timeout(12000)
  });
  if (!res.ok) throw new Error('Status: ' + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2000) throw new Error('File too small: ' + buf.length);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function main() {
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  console.log('Bat dau tim va tai anh cho toan bo', db.products.length, 'san pham...');

  let successCount = 0;
  for (let i = 0; i < db.products.length; i++) {
    const p = db.products[i];
    const targetFile = path.join(OUT_DIR, `product-${p.id}.jpg`);

    // Kiem tra neu anh da ton tai va hop le
    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 5000) {
      console.log(`[${i + 1}/${db.products.length}] [DA CO] ID ${p.id}: ${p.name}`);
      successCount++;
      continue;
    }

    const searchQuery = `${p.name} ${p.brand || ''}`.trim();
    console.log(`[${i + 1}/${db.products.length}] Dang tim anh cho ID ${p.id}: "${searchQuery}"...`);

    const urls = await searchImageUrls(searchQuery);
    let downloaded = false;

    for (const url of urls) {
      try {
        const size = await downloadFile(url, targetFile);
        console.log(`  -> Thanh cong: ${path.basename(targetFile)} (${Math.round(size / 1024)} KB) tu: ${url.substring(0, 70)}...`);
        downloaded = true;
        successCount++;
        break;
      } catch (err) {
        // Thu tiep url khac
      }
    }

    if (!downloaded) {
      console.warn(`  [!] Khong the tai anh tu ket qua search cho ID ${p.id}`);
    }

    // Nghi 1.2 giay giua cac request
    await sleep(1200);
  }

  console.log(`\nHoan tat: ${successCount}/${db.products.length} anh san pham da san sang!`);
}

main();