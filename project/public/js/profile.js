document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    window.location.href = "../html/login.html";
    return;
  }

  try {
    // ดึงข้อมูลโปรไฟล์จาก API
    const res = await fetch(`/api/profile/${user.id}`);
    if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลโปรไฟล์ได้");

    const data = await res.json();
    localStorage.setItem("loggedInUser", JSON.stringify(user));


    // แสดงข้อมูลบนหน้า (ถ้าไม่มีข้อมูลจาก API ใช้ข้อมูลเก่า)
    document.getElementById("profile-name").textContent = data.username || user.username;
    document.getElementById("profile-email").textContent = data.email || user.email;
    document.getElementById("profile-phone").textContent = data.phone || user.phone;

    // แสดงปุ่ม admin หากเป็นผู้ดูแลระบบ
   if (user.role === "admin") {
  const adminBtn = document.createElement("button");
  adminBtn.textContent = "Admin Panel";
  adminBtn.className = "btn";
  adminBtn.style.marginTop = "10px";
  adminBtn.onclick = () => {
    window.location.href = "../html/admin.html";
  };

  const section = document.getElementById("admin-section");
  if (section) section.appendChild(adminBtn);
}
  } catch (error) {
    console.error(error);
    Swal.fire("ผิดพลาด", "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้", "error");
  }
});

function logout() {
  // ลบข้อมูลออกก่อน
  localStorage.removeItem("loggedInUser");

  // เด้ง popup
  Swal.fire({
    icon: "success",
    title: "ออกจากระบบแล้ว",
    text: "ขอบคุณที่ใช้งาน!",
    confirmButtonColor: "#ff66b2",
    showConfirmButton: false,
    background: "#fff0f5",
    color: "#333",
    timer: 2000,
    timerProgressBar: true,
    position: "center",
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
