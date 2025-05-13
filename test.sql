-- สร้างฐานข้อมูล
CREATE DATABASE MovieDB;
GO

-- เลือกใช้ฐานข้อมูลนี้
USE MovieDB;
GO

CREATE TABLE Users (
  id INT PRIMARY KEY IDENTITY(1,1),
  username NVARCHAR(255),
  email NVARCHAR(255),
  phone NVARCHAR(50),
  password NVARCHAR(255)
);

SELECT * FROM Users;