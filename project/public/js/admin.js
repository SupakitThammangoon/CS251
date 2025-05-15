document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  loadBookings();
});

async function loadUsers() {
  try {
    const response = await fetch("/api/admin/users");
    const users = await response.json();

    const tbody = document.querySelector("#users-table tbody");
    tbody.innerHTML = "";

    users.forEach(user => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td><button onclick="deleteUser(${user.id})">ลบ</button></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Load Users Error:", error);
    alert("โหลดข้อมูลผู้ใช้ล้มเหลว");
  }
}

async function loadBookings() {
  try {
    const response = await fetch("/api/admin/bookings");
    const bookings = await response.json();

    const tbody = document.querySelector("#bookings-table tbody");
    tbody.innerHTML = "";

    let totalRevenue = 0;
    let totalSeatsBooked = 0;
    const maxSeats = 50; // กำหนดจำนวนที่นั่งทั้งหมดของโรงภาพยนตร์ (ต่อรอบ/รวมทุกเรื่อง)

    bookings.forEach(bk => {
      const seatsArray = bk.seats.split(",").map(s => s.trim()); // สมมุติว่า seats เป็น "A1,A2,B3"
      const seatCount = seatsArray.length;

      totalRevenue += bk.total_price;
      totalSeatsBooked += seatCount;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${bk.id}</td>
        <td>${bk.user_id}</td>
        <td>${bk.movie}</td>
        <td>${bk.time}</td>
        <td>${bk.cinema}</td>
        <td>${bk.seats}</td>
        <td>${bk.total_price}</td>
        <td><button onclick="deleteBooking(${bk.id})">ลบ</button></td>
      `;
      tbody.appendChild(tr);
    });

    const remainingSeats = maxSeats - totalSeatsBooked;

    // แสดงผลสรุปด้านล่างตารางหรือที่ DOM ที่กำหนดไว้
    document.getElementById("summary").innerHTML = `
      <p>🎟️ จำนวนที่นั่งที่ถูกจองทั้งหมด: ${totalSeatsBooked}</p>
      <p>💺 จำนวนที่นั่งที่เหลือ: ${remainingSeats < 0 ? 0 : remainingSeats}</p>
      <p>💰 รายได้รวมจากการจอง: ${totalRevenue.toLocaleString()} บาท</p>
    `;

  } catch (error) {
    console.error("Load Bookings Error:", error);
    alert("โหลดข้อมูลการจองล้มเหลว");
  }
  
}
// ✅ ฟังก์ชันลบผู้ใช้
async function deleteUser(id) {
  const result = await Swal.fire({
    title: 'ยืนยันการลบผู้ใช้?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก'
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire('ลบสำเร็จ!', '', 'success');
        loadUsers();
      } else {
        Swal.fire('ผิดพลาด', data.message || 'ลบไม่สำเร็จ', 'error');
      }
    } catch (error) {
      Swal.fire('ผิดพลาด', 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้', 'error');
    }
  }
}

// ✅ ฟังก์ชันลบการจอง
async function deleteBooking(id) {
  const result = await Swal.fire({
    title: 'ยืนยันการลบการจอง?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก'
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire('ลบสำเร็จ!', '', 'success');
        loadBookings(); // รีเฟรชข้อมูลใหม่
      } else {
        Swal.fire('ผิดพลาด', data.message || 'ลบไม่สำเร็จ', 'error');
      }
    } catch (error) {
      Swal.fire('ผิดพลาด', 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้', 'error');
    }
  }
}
