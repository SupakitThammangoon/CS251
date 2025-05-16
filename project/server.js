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
// 📌 API: ลงทะเบียน (เพิ่ม role เป็นค่าเริ่มต้น 'user')
// ============================
app.post('/api/register', async (req, res) => {
  const { username, email, phone, password, role = 'user' } = req.body;

  try {
    await sql.connect(dbConfig);

    if (!username || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const check = await sql.query`
      SELECT * FROM Users WHERE username = ${username} OR email = ${email}
    `;

    if (check.recordset.length > 0) {
      return res.status(401).json({ success: false, message: 'ชื่อหรืออีเมลนี้มีผู้ใช้แล้ว' });
    }

    await sql.query`
      INSERT INTO Users (username, email, phone, password, role)
      VALUES (${username}, ${email}, ${phone}, ${password}, ${role})
    `;

    const user = { username, email, phone, role };
    res.status(200).json({ success: true, message: 'ลงทะเบียนสำเร็จ!', user });

  } catch (error) {
    console.error('❌ DB Error:', error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
  }
});


// ============================
// 📌 API: เข้าสู่ระบบ (ดึง role ด้วย)
// ============================
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      SELECT id, username, email, phone, role FROM Users
      WHERE username = ${username} AND password = ${password}
    `;

    if (result.recordset.length > 0) {
      const user = result.recordset[0]; // ดึงข้อมูลผู้ใช้รวม role
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
// 📌 API: ดึงโปรไฟล์
// ============================
app.get('/api/profile/:id', async (req, res) => {
  const { id } = req.params;

  // ✅ ตรวจว่า id เป็นตัวเลขหรือไม่
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "รหัสผู้ใช้ไม่ถูกต้อง" });
  }

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT id, username, email, phone FROM Users WHERE id = ${parseInt(id)}
    `;

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }
  } catch (error) {
    console.error('❌ Profile Fetch Error:', error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงโปรไฟล์" });
  }
});


// ============================
// 📌 API: อัปเดตข้อมูลโปรไฟล์
// ============================
// 📌 PUT /api/profile/:id
app.put('/api/profile/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, phone } = req.body;

  try {
    await sql.connect(dbConfig);

    // ✅ ตรวจสอบว่า username ซ้ำกับ user อื่นหรือไม่
    const check = await sql.query`
      SELECT id FROM Users WHERE username = ${username} AND id != ${id}
    `;
    if (check.recordset.length > 0) {
      return res.status(409).json({ message: "ชื่อผู้ใช้นี้มีคนใช้แล้ว" });
    }

    // ✅ ถ้าไม่ซ้ำ → อัปเดต
    await sql.query`
      UPDATE Users 
      SET username = ${username}, email = ${email}, phone = ${phone}
      WHERE id = ${id}
    `;

    res.status(200).json({ message: "อัปเดตโปรไฟล์สำเร็จ" });
  } catch (error) {
    console.error('❌ Profile Update Error:', error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์" });
  }
});



// ============================
// 📌 API: จองตั๋ว 
// ============================
app.post('/api/book', async (req, res) => {
  const { userId, seats, totalPrice, movie, time, cinema } = req.body;

  try {
    await sql.connect(dbConfig);

    await sql.query`
      INSERT INTO Bookings (user_id, movie, time, cinema, seats, total_price)
      VALUES (${userId}, ${movie}, ${time}, ${cinema}, ${seats.join(", ")}, ${totalPrice})
    `;

    res.status(200).json({
      message: "จองตั๋วสำเร็จ",
      ticketId: Math.floor(Math.random() * 100000)
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
  const { userId } = req.body;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      SELECT 
        B.id,
        B.movie,
        B.time,
        B.cinema,
        B.seats,
        B.total_price,
        B.booking_date,
        U.username
      FROM Bookings B
      JOIN Users U ON B.user_id = U.id
      WHERE B.user_id = ${userId}
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

// ============================
// 📌 API: Admin - ดึงรายชื่อผู้ใช้ทั้งหมด
// ============================
app.get('/api/admin/users', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT id, username, email, phone FROM Users`;
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("❌ Admin Get Users Error:", error);
    res.status(500).json({ message: "ไม่สามารถโหลดรายชื่อผู้ใช้ได้" });
  }
});

// ============================
// 📌 API: Admin - ดึงข้อมูลการจองทั้งหมด
// ============================
app.get('/api/admin/bookings', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM Bookings ORDER BY booking_date DESC`;
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("❌ Admin Get Bookings Error:", error);
    res.status(500).json({ message: "ไม่สามารถโหลดข้อมูลการจองได้" });
  }
});

// ============================
// 📌 API: Admin - ลบผู้ใช้
// ============================
app.delete('/api/admin/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    await sql.connect(dbConfig);
    await sql.query`DELETE FROM Users WHERE id = ${userId}`;
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Delete User Error:", error);
    res.status(500).json({ success: false, message: "ไม่สามารถลบผู้ใช้ได้" });
  }
});

// ============================
// 📌 API: Admin - ลบการจอง
// ============================
app.delete('/api/admin/bookings/:id', async (req, res) => {
  const bookingId = req.params.id;

  try {
    await sql.connect(dbConfig);
    await sql.query`DELETE FROM Bookings WHERE id = ${bookingId}`;
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Delete Booking Error:", error);
    res.status(500).json({ success: false, message: "ไม่สามารถลบการจองได้" });
  }
});
app.get('/api/profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT id, username, email, phone, role FROM Users WHERE id = ${id}
    `;

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);  // จะมี role ด้วย
    } else {
      res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }
  } catch (error) {
    console.error('❌ Profile Fetch Error:', error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงโปรไฟล์" });
  }
});

// ============================
// 📌 API: เปลี่ยนรหัสผ่าน
// ============================
app.post('/api/change-password', async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  try {
    await sql.connect(dbConfig);

    // ตรวจสอบรหัสผ่านเดิม
    const check = await sql.query`
      SELECT id FROM Users WHERE username = ${username} AND password = ${oldPassword}
    `;

    if (check.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'รหัสผ่านเดิมไม่ถูกต้อง'
      });
    }

    // อัปเดตรหัสผ่านใหม่
    await sql.query`
      UPDATE Users SET password = ${newPassword} WHERE username = ${username}
    `;

    res.status(200).json({
      success: true,
      message: 'เปลี่ยนรหัสผ่านสำเร็จ'
    });

  } catch (error) {
    console.error('❌ Change Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน'
    });
  }
});
