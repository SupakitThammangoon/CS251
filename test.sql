-- 🔧 สร้างฐานข้อมูล
CREATE DATABASE MovieDB;
GO

-- 📌 เลือกใช้ฐานข้อมูล
USE MovieDB;
GO

-- 👤 สร้างตาราง Users พร้อม role
CREATE TABLE Users (
  id INT PRIMARY KEY IDENTITY(1,1),
  username NVARCHAR(255),
  email NVARCHAR(255),
  phone NVARCHAR(50),
  password NVARCHAR(255),
  role NVARCHAR(50) DEFAULT 'user' -- เพิ่มคอลัมน์ role
);
GO

-- 🎟️ สร้างตาราง Bookings
CREATE TABLE Bookings (
  id INT PRIMARY KEY IDENTITY(1,1),
  movie NVARCHAR(255),
  time NVARCHAR(255),
  cinema NVARCHAR(255),
  seats NVARCHAR(MAX),
  total_price INT,
  booking_date DATETIME DEFAULT GETDATE()
);
GO

-- ✅ เพิ่มคอลัมน์ user_id (ถ้ายังไม่มี)
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Bookings' AND COLUMN_NAME = 'user_id'
)
BEGIN
    ALTER TABLE Bookings
    ADD user_id INT;
END
GO

-- 🔄 อัปเดต user_id โดยใช้ username (กรณีมีข้อมูลอยู่แล้ว)
-- *ใช้ในกรณีที่ Bookings เคยมีคอลัมน์ username มาก่อน*
IF EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Bookings' AND COLUMN_NAME = 'username'
)
BEGIN
    UPDATE B
    SET B.user_id = U.id
    FROM Bookings B
    JOIN Users U ON B.username = U.username;
END
GO

-- สร้าง user admin ใหม่
INSERT INTO Users (username, email, phone, password, role)
VALUES ('adminuser', 'admin@example.com', '0999999999', 'admin1234', 'admin');