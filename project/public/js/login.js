function setupToggleEye(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);

    toggle.addEventListener("click", () => {
        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";
        toggle.classList.toggle("fa-eye");
        toggle.classList.toggle("fa-eye-slash");
    });
}

setupToggleEye("loginPassword", "loginToggle");
setupToggleEye("registerPassword", "registerToggle");

document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  };

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
      // บันทึกผู้ใช้
      localStorage.setItem("loggedInUser", JSON.stringify(result.user || data));

      Swal.fire({
        icon: 'success',
        title: 'ลงทะเบียนสำเร็จ!',
        text: `ยินดีต้อนรับ, ${data.username}`,
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "profile.html";
      });
    } else {
      Swal.fire("ไม่ผ่าน!", result.message, "error");
    }
  } catch (error) {
    console.error("Register Error:", error);
    Swal.fire("เกิดข้อผิดพลาด!", "เซิร์ฟเวอร์ผิดปกติ", "error");
  }
});

document.querySelector(".login .btn").addEventListener("click", async function () {
    const username = document.querySelector(".login input[type='text']").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (result.success) {
            // บันทึกข้อมูล user ลง localStorage
            localStorage.setItem("loggedInUser", JSON.stringify(result.user));
             Swal.fire({
                icon: 'success',
                title: 'เข้าสู่ระบบสำเร็จ!',
                text: `ยินดีต้อนรับ, ${result.user.username}`,
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "../home.html"; // หรือ profile.html
            });

        } else {
            Swal.fire("ไม่ผ่าน!", result.message || "ชื่อผู้ใช้หรือรหัสผ่านผิด", "error");
        }
    } catch (error) {
        console.error("Login Error:", error);
                Swal.fire("เกิดข้อผิดผลาด!", "เซิร์ฟเวอร์ผิดปกติ", "error");
    }
});




