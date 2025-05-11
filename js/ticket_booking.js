const seatContainer = document.querySelector(".seats");
const selectedSeatSpan = document.getElementById("selectedSeat");
const priceSpan = document.getElementById("price");

const seatPrice = 300; // Fixed price per seat
const selectedSeats = new Set();

// Create seats dynamically inside each row (from E to A)

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

function updateSelectionInfo() {
  selectedSeatSpan.textContent = Array.from(selectedSeats).join(", ") || "-";
  priceSpan.textContent = selectedSeats.size * seatPrice;
}

function submitBooking() {
  if (selectedSeats.size === 0) {
    alert("กรุณาเลือกที่นั่งอย่างน้อยหนึ่งที่นั่ง!");
    return;
  }

  const bookingData = {
    seats: Array.from(selectedSeats),
    totalPrice: selectedSeats.size * seatPrice,
    movie: "Doraemon: Nobita's Space Heroes",
    time: "20 เมษายน 2015 11:00",
    cinema: "พารากอน Cinema 1",
  };

  // ส่งข้อมูลไป backend
  fetch("/api/book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  })
    .then((res) => {
      if (!res.ok) throw new Error("การจองล้มเหลว");
      return res.json();
    })
    .then((data) => {
      alert("จองที่นั่งเรียบร้อย! หมายเลขตั๋ว: " + data.ticketId);
    })
    .catch((err) => alert(err.message));
}
