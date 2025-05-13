document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    alert("กรุณาเข้าสู่ระบบก่อนใช้งานหน้านี้");
    window.location.href = "../html/login.html";
    return;
  }

  // แสดงข้อมูลบนหน้า
  document.getElementById("profile-name").textContent = user.username;
  document.getElementById("profile-email").textContent = user.email;
  document.getElementById("profile-phone").textContent = user.phone;
});
