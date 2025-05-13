document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    alert("กรุณาเข้าสู่ระบบก่อน");
    window.location.href = "../html/login.html";
    return;
  }

  try {
    const res = await fetch("/api/user-bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username })
    });

    const bookings = await res.json();

    if (bookings.length === 0) {
      document.querySelector(".ticket-section").innerHTML = "<p>ไม่มีข้อมูลการจอง</p>";
      return;
    }

    // เรียงจากใหม่สุด
    bookings.sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));

    const html = bookings.map(b => {
      // แยก time เป็น [20, เมษายน, 2015, 11:00]
      const parts = b.time.split(" ");
      const fullDate = parts.slice(0, 3).join(" "); // "20 เมษายน 2015"
      const timeOnly = parts[3] || "-";

      return `
        <div class="ticket-card">
          <img src="../img/doraemon_poster.jpg" alt="Movie Poster">
          <div class="right-section">
            <div class="qr-code">
              <img src="../img/QRCODE.png" alt="QR Code">
            </div>
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

  } catch (err) {
    console.error("โหลดข้อมูลตั๋วล้มเหลว", err);
    alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
  }
});
