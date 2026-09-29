// Module ket noi co so du lieu SQLite (TV1)
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

function lay_duong_dan_mac_dinh() {
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH;
  }
  if (process.env.NODE_ENV === 'test') {
    return path.join(__dirname, 'thuc_tap_co_so.test.sqlite');
  }
  return path.join(__dirname, 'thuc_tap_co_so.sqlite');
}

let ket_noi_hien_tai = null;
let duong_dan_hien_tai = null;

function khoi_tao_ket_noi(duong_dan) {
  const muc_tieu = duong_dan || lay_duong_dan_mac_dinh();
  
  if (ket_noi_hien_tai && duong_dan_hien_tai === muc_tieu && muc_tieu !== ':memory:') {
    return ket_noi_hien_tai;
  }
  
  if (ket_noi_hien_tai) {
    dong_ket_noi();
  }

  const db = new DatabaseSync(muc_tieu);
  try {
    db.exec('PRAGMA journal_mode = WAL;');
    db.exec('PRAGMA busy_timeout = 5000;');
    db.exec('PRAGMA foreign_keys = ON;');
  } catch (e) {
    // Bo qua neu khong ho tro
  }
  
  if (muc_tieu !== ':memory:') {
    ket_noi_hien_tai = db;
    duong_dan_hien_tai = muc_tieu;
  }
  return db;
}

function lay_ket_noi() {
  if (!ket_noi_hien_tai) {
    return khoi_tao_ket_noi();
  }
  return ket_noi_hien_tai;
}

function dong_ket_noi() {
  if (ket_noi_hien_tai) {
    try {
      ket_noi_hien_tai.close();
    } catch (e) {
      // Bo qua
    }
    ket_noi_hien_tai = null;
    duong_dan_hien_tai = null;
  }
}

module.exports = {
  lay_duong_dan_mac_dinh,
  khoi_tao_ket_noi,
  lay_ket_noi,
  dong_ket_noi
};