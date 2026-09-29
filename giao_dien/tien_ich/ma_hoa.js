// Ham bam chuoi bang thuat toan SHA-256 chuan Web Cryptography API (hoat dong ca Browser va Node.js)
export async function bam_sha256(chuoi) {
  if (!chuoi && chuoi !== '') return '';
  const cryptoObj = (typeof globalThis !== 'undefined' && globalThis.crypto)
    ? globalThis.crypto
    : (typeof window !== 'undefined' ? window.crypto : null);

  if (cryptoObj && cryptoObj.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(String(chuoi));
    const hashBuffer = await cryptoObj.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  return String(chuoi);
}

// Ma hoa SHA-256 bao mat tai khoan quan tri Admin
// TAI_KHOAN = sha256("admin")
// MAT_KHAU  = sha256("123456")
export const ADMIN_HASH = {
  TAI_KHOAN: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  MAT_KHAU: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
};