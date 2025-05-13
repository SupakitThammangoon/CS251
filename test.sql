-- สร้างฐานข้อมูล
CREATE DATABASE MovieBookingDB;
GO

-- เลือกใช้ฐานข้อมูลนี้
USE MovieBookingDB;
GO

-- ตาราง Users
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    FullName NVARCHAR(100),
    Email NVARCHAR(100),
    Phone NVARCHAR(20)
);
GO

-- ตาราง Movies
CREATE TABLE Movies (
    MovieID INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(100) NOT NULL,
    Genre NVARCHAR(50),
    Duration INT, -- นาที
    Description NVARCHAR(MAX),
    ReleaseDate DATE
);
GO

-- ตาราง Theaters
CREATE TABLE Theaters (
    TheaterID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Location NVARCHAR(255)
);
GO

-- ตาราง Showtimes
CREATE TABLE Showtimes (
    ShowtimeID INT PRIMARY KEY IDENTITY(1,1),
    MovieID INT FOREIGN KEY REFERENCES Movies(MovieID),
    TheaterID INT FOREIGN KEY REFERENCES Theaters(TheaterID),
    StartTime DATETIME NOT NULL,
    Screen NVARCHAR(50)
);
GO

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