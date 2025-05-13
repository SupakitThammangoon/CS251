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
        password: formData.get("password")
    };

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        alert(result.message); // แจ้งผลลัพธ์

    } catch (error) {
        console.error("เกิดข้อผิดพลาด", error);
        alert("สมัครไม่สำเร็จ");
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
            alert("เข้าสู่ระบบสำเร็จ");
            window.location.href = "../home.html"; // หรือ profile.html ถ้าจะเด้งไปหน้านั้นเลย
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }
});




