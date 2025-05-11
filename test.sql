-- สร้างฐานข้อมูล
CREATE DATABASE MovieBookingDB;
GO

-- เลือกใช้ฐานข้อมูลนี้
-- USE MovieBookingDB;
-- GO

-- สร้างตาราง Bookings
CREATE TABLE Bookings (
    BookingID INT IDENTITY(1,1) PRIMARY KEY,
    MovieName NVARCHAR(100),
    ShowTime DATETIME,
    Cinema NVARCHAR(100),
    Seat NVARCHAR(10),
    Price INT
);
GO

-- ใส่ข้อมูลตัวอย่าง
INSERT INTO Bookings (MovieName, ShowTime, Cinema, Seat, Price)
VALUES 
  ('Doraemon: Nobita''s Space Heroes', '2015-04-20 11:00', 'พารากอน Cinema 1', 'A1', 300),
  ('Doraemon: Nobita''s Space Heroes', '2015-04-20 11:00', 'พารากอน Cinema 1', 'A2', 300);
GO

-- ตรวจสอบข้อมูล
SELECT * FROM Bookings;