document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    Swal.fire({
      icon: 'warning',
      title: 'ยังไม่ได้เข้าสู่ระบบ',
      text: 'กรุณาเข้าสู่ระบบก่อนใช้งานระบบจองตั๋ว',
      confirmButtonText: 'ไปหน้าเข้าสู่ระบบ'
    }).then(() => {
      window.location.href = "../html/login.html";
    });
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/user-bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id })
    });

    const bookings = await res.json();

    if (bookings.length === 0) {
      document.querySelector(".ticket-section").innerHTML = `
        <div style="text-align:center; padding: 50px;">
          <h2 style="color: #666;">🛑 ไม่มีข้อมูลการจอง</h2>
          <p>ดูเหมือนว่าคุณยังไม่ได้จองตั๋วภาพยนตร์</p>
          <a href="../html/movie.html" style="margin-top:20px; display:inline-block; background-color:#ff6699; color:white; padding:10px 20px; border-radius:8px; text-decoration:none;">เลือกภาพยนตร์เลย</a>
        </div>
      `;
      document.querySelector(".ticket-section").style.display = "block";
      return;
    }

    // เรียงจากใหม่สุด
    bookings.sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));

    const html = bookings.map(b => {
      const parts = b.time.split(" ");
      const fullDate = parts.slice(0, 3).join(" ");
      const timeOnly = parts[3] || "-";

      return `
        <div class="ticket-card">
          <img src="../img/doraemon_poster.jpg" alt="Movie Poster">
          <div class="right-section">
            <div class="qr-code" id="qrcode-${b.id}"></div>
            <div class="ticket-info">
              <p><span>ชื่อภาพยนตร์:</span> ${b.movie}</p>
              <p><span>โรงภาพยนตร์:</span> ${b.cinema}</p>
              <p><span>ที่นั่ง:</span> ${b.seats}</p>
              <p><span>วันที่:</span> ${fullDate}</p>
              <p><span>เวลา:</span> ${timeOnly} น.</p>
              <p class="price"><span>ราคา:</span> ${b.total_price} บาท</p>
            </div>
          </div>
        </div>
      `;
    }).join("");

    document.querySelector(".ticket-section").innerHTML = html;
    document.querySelector(".ticket-section").style.display = "block";

    bookings.forEach(b => {
    // ✅ สั้นที่สุด ป้องกัน QR code overflow แน่นอน
    const qrText = `${b.id}`;  // หรือ encode URL ก็ได้ เช่น `https://yourapp.com/ticket/${b.id}`

      new QRCode(document.getElementById(`qrcode-${b.id}`), {
      text: qrText,
      width: 100,
      height: 100
      });
    });


  } catch (err) {
    console.error("โหลดข้อมูลตั๋วล้มเหลว", err);
    Swal.fire({
      icon: 'error',
      title: 'ผิดพลาด!',
      text: 'เกิดข้อผิดพลาดในการโหลดข้อมูลตั๋ว',
      confirmButtonText: 'ตกลง'
    });
  }
});