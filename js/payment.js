window.addEventListener("DOMContentLoaded", () => {
  const booking = JSON.parse(localStorage.getItem("booking"));
  if (!booking) {
    alert("ไม่พบข้อมูลการจอง");
    return;
  }

  
  document.getElementById("movieTitle").textContent = booking.movie;
  document.getElementById("movieTime").textContent = booking.time;
  document.getElementById("cinema").textContent = booking.cinema;

  
  const summaryContainer = document.querySelector(".order-summary");

  const seatHTML = booking.seats.map(seat => `
    <div class="item">
      <div class="seat-info">
        <img src="/img/seat-icon.png" alt="seat" />
        <span>${seat}</span>
      </div>
      <span class="price">${booking.pricePerSeat} บาท</span>
    </div>
  `).join("");

  summaryContainer.innerHTML = `
    ${seatHTML}
    <hr />
    <div class="total">
      <span>ราคารวม</span>
      <span class="price">${booking.totalPrice} บาท</span>
    </div>
  `;
});
