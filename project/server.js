const express = require('express');
const path = require('path');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 3000;

// ============================
// ⚙️ Middleware
// ============================
app.use(cors());
app.use(express.json()); // รับ JSON body
app.use(express.static(path.join(__dirname, 'public')));

// ============================
// 🛠️ SQL Server Config
// ============================
const dbConfig = {
  user: 'sa',
  password: 'YourStrong@Passw0rd',
  server: 'localhost',
  database: 'MovieDB', // ต้องตรงกับใน SSMS
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// ============================
// 📄 หน้าเว็บหลัก
// ============================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// ============================
// 📌 API: ลงทะเบียน
// ============================
app.post('/api/register', async (req, res) => {
  const { username, email, phone, password } = req.body;

  try {
    // เชื่อมต่อฐานข้อมูล
    await sql.connect(dbConfig);

    // INSERT ข้อมูลลง Table
    await sql.query`
      INSERT INTO Users (username, email, phone, password)
      VALUES (${username}, ${email}, ${phone}, ${password})
    `;

    res.status(200).json({ message: 'ลงทะเบียนสำเร็จ!' });
  } catch (error) {
    console.error('❌ DB Error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
  }
});

// ============================
// 📌 API: เข้าสู่ระบบ
// ============================
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      SELECT id, username, email, phone FROM Users
      WHERE username = ${username} AND password = ${password}
    `;

    if (result.recordset.length > 0) {
      const user = result.recordset[0]; // ดึงข้อมูลผู้ใช้
      res.status(200).json({ success: true, user }); // ส่งกลับ client
    } else {
      res.status(401).json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }
  } catch (error) {
    console.error('❌ DB Login Error:', error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
  }
});


// ============================
// 🚀 เริ่ม Server
// ============================
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
