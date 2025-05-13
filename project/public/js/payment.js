window.addEventListener("DOMContentLoaded", () => {
  const booking = JSON.parse(localStorage.getItem("latestTicket"));
  if (!booking) {
    alert("ไม่พบข้อมูลการจอง");
    return;
  }

  document.getElementById("movieTitle").textContent = booking.movie;
  document.getElementById("movieTime").textContent = booking.time;
  document.getElementById("cinema").textContent = booking.cinema;

  const summaryContainer = document.querySelector(".order-summary");
  const pricePerSeat = booking.total / booking.seats.length;

  const seatHTML = booking.seats.map(seat => `
    <div class="item">
      <div class="seat-info">
        <img src="../img/seat.png" alt="seat" />
        <span>${seat}</span>
      </div>
      <span class="price">${pricePerSeat} บาท</span>
    </div>
  `).join("");

  summaryContainer.innerHTML = `
    ${seatHTML}
    <hr />
    <div class="total">
      <span>ราคารวม</span>
      <span class="price">${booking.total} บาท</span>
    </div>
  `;
});

document.querySelector(".payment-options").addEventListener("click", () => {
  window.location.href = "../html/ticket.html";
});

document.querySelectorAll(".payment-options .option").forEach(option => {
  option.addEventListener("click", () => {
    window.location.href = "../html/ticket.html";
  });
});

