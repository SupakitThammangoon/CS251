const seatContainer = document.querySelector(".seats");
const selectedSeatSpan = document.getElementById("selectedSeat");
const priceSpan = document.getElementById("price");

const seatPrice = 300;
const selectedSeats = new Set();

// ✅ สร้างแถวและที่นั่ง
["E", "D", "C", "B", "A"].forEach((rowLabel) => {
  const row = document.createElement("div");
  row.classList.add("row");
  row.dataset.row = rowLabel;

  for (let i = 1; i <= 10; i++) {
    const seat = document.createElement("div");
    seat.classList.add("seat");
    seat.dataset.seat = `${rowLabel}${i}`;
    seat.addEventListener("click", toggleSeat);
    row.appendChild(seat);
  }

  seatContainer.appendChild(row);
});

// ✅ เมื่อคลิกที่นั่ง
function toggleSeat(event) {
  const seat = event.target;
  const seatCode = seat.dataset.seat;

  if (selectedSeats.has(seatCode)) {
    selectedSeats.delete(seatCode);
    seat.classList.remove("selected");
  } else {
    selectedSeats.add(seatCode);
    seat.classList.add("selected");
  }

  updateSelectionInfo();
}

// ✅ อัปเดตรายการที่นั่งและราคา
function updateSelectionInfo() {
  selectedSeatSpan.textContent = Array.from(selectedSeats).join(", ") || "-";
  priceSpan.textContent = selectedSeats.size * seatPrice;
}

// ✅ ฟังก์ชันส่งข้อมูลการจองไป backend
function submitBooking() {
  if (selectedSeats.size === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'กรุณาเลือกอย่างน้อยหนึ่งที่นั่ง',
    })
    return;
  }

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

  const bookingData = {
    username: user.username,
    seats: Array.from(selectedSeats),
    totalPrice: selectedSeats.size * seatPrice,
    movie: "Doraemon: Nobita's Space Heroes",
    time: "20 เมษายน 2015 11:00",
    cinema: "พารากอน Cinema 1",
  };

  // ✅ ตรวจสอบว่าที่นั่งถูกจองไปหรือยัง
  fetch("/api/check-seats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      seats: bookingData.seats,
      movie: bookingData.movie,
      time: bookingData.time,
      cinema: bookingData.cinema,
    }),
  })
    .then(res => {
      if (res.status === 409) return res.json().then(data => { throw { duplicated: data.duplicated }; });
      if (!res.ok) throw new Error("ไม่สามารถตรวจสอบที่นั่งได้");
      return res.json();
    })
    .then(() => {
      // ✅ ดำเนินการจอง
      return fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
    })
    .then(res => {
      if (!res.ok) throw new Error("การจองล้มเหลว");
      return res.json();
    })
    .then((data) => {
      // ✅ บันทึกข้อมูลสำหรับหน้าชำระเงิน
      localStorage.setItem("latestTicket", JSON.stringify({
        ticketId: data.ticketId,
        movie: bookingData.movie,
        seats: bookingData.seats,
        total: bookingData.totalPrice,
        cinema: bookingData.cinema,
        time: bookingData.time
      }));

      window.location.href = "../html/payment.html";
    })
    .catch((err) => {
      if (err.duplicated) {
        Swal.fire({
          icon: 'error',
          title: 'ที่นั่งถูกจองแล้ว',
          text: '❌ ที่นั่งต่อไปนี้ถูกจองไปแล้ว: ' + err.duplicated.join(", "),
      });
      } else {
        console.error("Booking Error:", err);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาดในการจอง',
          text: 'เกิดข้อผิดพลาดในการจอง: ' + err.message,
      });
    }
  });
}