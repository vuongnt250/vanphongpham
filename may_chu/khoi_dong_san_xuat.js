// Khoi tao CSDL neu day la lan chay dau tien, sau do bat Express.
// File SQLite khong duoc commit de tranh dua du lieu phat sinh len Git.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const duong_dan_db = process.env.DATABASE_PATH
  || path.join(__dirname, '../co_so_du_lieu/thuc_tap_co_so.sqlite');

if (!fs.existsSync(duong_dan_db)) {
  fs.mkdirSync(path.dirname(duong_dan_db), { recursive: true });
  console.log('Dang khoi tao co so du lieu SmartDesk...');
  execFileSync(process.execPath, [path.join(__dirname, '../co_so_du_lieu/khoi_tao_database.js')], {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_PATH: duong_dan_db }
  });
}

require('./app').listen(process.env.PORT || 5000, () => {
  console.log(`May chu SmartDesk dang chay tai cong ${process.env.PORT || 5000}`);
});
