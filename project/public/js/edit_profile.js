// ✅ ดึง userId จาก URL (เช่น ?id=1)
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

// ✅ ถ้าไม่พบ userId → redirect กลับหน้า login
if (!userId) {
  Swal.fire("เกิดข้อผิดพลาด", "ไม่พบผู้ใช้", "error").then(() => {
    window.location.href = "../html/login.html";
  });
}

// ✅ โหลดข้อมูลโปรไฟล์เมื่อเปิดหน้า
fetch(`http://localhost:3000/api/profile/${userId}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById('username').value = data.username;
    document.getElementById('email').value = data.email;
    document.getElementById('phone').value = data.phone;
  })
  .catch(err => {
    console.error("❌ Error loading profile:", err);
    Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลได้", "error");
  });

// ✅ จัดการ submit form
document.getElementById('profileForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const payload = {
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value
  };

  fetch(`http://localhost:3000/api/profile/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error("Update failed");

      // ✅ อัปเดตเสร็จ → ดึงข้อมูลใหม่จาก DB แล้วเซต localStorage
      return fetch(`http://localhost:3000/api/profile/${userId}`);
    })
    .then(res => res.json())
    .then(updatedUser => {
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser)); // ✅ อัปเดตข้อมูลใน localStorage
      Swal.fire("สำเร็จ", "อัปเดตโปรไฟล์เรียบร้อยแล้ว", "success").then(() => {
        window.location.href = "../html/profile.html"; // ✅ กลับหน้าโปรไฟล์
      });
    })
    .catch(err => {
      console.error("❌ Error updating profile:", err);
      Swal.fire("ผิดพลาด", "ไม่สามารถอัปเดตได้", "error");
    });
});

// ✅ ปุ่ม Logout
function logout() {
  Swal.fire({
    title: "คุณแน่ใจหรือไม่?",
    text: "คุณต้องการออกจากระบบ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ใช่, ออกจากระบบ",
    cancelButtonText: "ยกเลิก"
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("loggedInUser");
      window.location.href = "../html/login.html";
    }
  });
}
