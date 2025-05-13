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
// 📌 API: จองตั๋ว
// ============================
app.post('/api/book', async (req, res) => {
  const { username, seats, totalPrice, movie, time, cinema } = req.body;

  try {
    await sql.connect(dbConfig);

    await sql.query`
      INSERT INTO Bookings (username, movie, time, cinema, seats, total_price)
      VALUES (${username}, ${movie}, ${time}, ${cinema}, ${seats.join(", ")}, ${totalPrice})
    `;

    res.status(200).json({
      message: "จองตั๋วสำเร็จ",
      ticketId: Math.floor(Math.random() * 100000) // สุ่ม ticket ID สำหรับแสดงผล
    });
  } catch (error) {
    console.error("❌ Booking Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการจองตั๋ว" });
  }
});

// ============================
// 📌 API: ดึงตั๋วทั้งหมดของผู้ใช้
// ============================
app.post('/api/user-bookings', async (req, res) => {
  const { username } = req.body;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      SELECT * FROM Bookings WHERE username = ${username}
    `;

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("❌ Fetch Bookings Error:", error);
    res.status(500).json({ message: "ไม่สามารถโหลดข้อมูลตั๋วได้" });
  }
});

// ============================
// 🚀 เริ่ม Server
// ============================
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});

// ============================
// 📌 API: ตรวจสอบที่นั่งซ้ำก่อนการจอง
// ============================
app.post('/api/check-seats', async (req, res) => {
  const { seats, movie, time, cinema } = req.body;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      SELECT seats FROM Bookings
      WHERE movie = ${movie} AND time = ${time} AND cinema = ${cinema}
    `;

    // รวมที่นั่งทั้งหมดที่เคยถูกจองในรอบเดียวกัน
    const allBookedSeats = result.recordset
      .flatMap(row => row.seats.split(',').map(s => s.trim()));

    // ตรวจสอบที่นั่งซ้ำ
    const duplicated = seats.filter(s => allBookedSeats.includes(s));

    if (duplicated.length > 0) {
      return res.status(409).json({ duplicated }); // 409 Conflict
    }

    res.status(200).json({ message: "ที่นั่งยังว่างทั้งหมด" });
  } catch (error) {
    console.error("❌ Seat Check Error:", error);
    res.status(500).json({ message: "ไม่สามารถตรวจสอบที่นั่งได้" });
  }
});

