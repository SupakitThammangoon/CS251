document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    window.location.href = "../html/login.html";
    return;
  }

  // แสดงข้อมูลบนหน้า
  document.getElementById("profile-name").textContent = user.username;
  document.getElementById("profile-email").textContent = user.email;
  document.getElementById("profile-phone").textContent = user.phone;
});

function logout() {
    // ลบข้อมูลออกก่อน
    localStorage.removeItem("loggedInUser");

    // เด้ง popup
    Swal.fire({
        icon: 'success',
        title: 'ออกจากระบบแล้ว',
        text: 'ขอบคุณที่ใช้งาน!',
        confirmButtonColor: '#ff66b2',
        showConfirmButton: false,
        background: '#fff0f5',
        color: '#333',
        timer: 2000,
        timerProgressBar: true,
        position: 'center'
    }).then(() => {
        // พอ popup หาย → เด้งไปหน้าอื่น
        window.location.href = "../html/login.html"; // หรือ home.html
    });
}

function editProfile() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user || !user.id) {
        Swal.fire("ไม่พบข้อมูลผู้ใช้", "กรุณาเข้าสู่ระบบใหม่", "error");
        return;
    }

    // ส่งไปยังหน้าแก้ไขโปรไฟล์พร้อมแนบ user ID
    window.location.href = `../html/edit_profile.html?id=${user.id}`;
}


