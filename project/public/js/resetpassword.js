document.addEventListener("DOMContentLoaded", () => {
      const form = document.getElementById("changePasswordForm");

      form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const oldPassword = this.oldPassword.value.trim();
        const newPassword = this.newPassword.value.trim();
        const confirmPassword = this.confirmPassword.value.trim();

        if (newPassword !== confirmPassword) {
          return Swal.fire("รหัสผ่านไม่ตรง", "โปรดยืนยันรหัสผ่านใหม่ให้ตรงกัน", "warning");
        }

        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!user) {
          return Swal.fire("ยังไม่ได้เข้าสู่ระบบ", "โปรดเข้าสู่ระบบก่อนเปลี่ยนรหัสผ่าน", "error")
            .then(() => window.location.href = "../html/login.html");
        }

        try {
          const res = await fetch("/api/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: user.username,
              oldPassword,
              newPassword
            })
          });

          const result = await res.json();

          if (result.success) {
            Swal.fire("สำเร็จ!", result.message, "success");
            this.reset();
          } else {
            Swal.fire("ล้มเหลว!", result.message, "error");
          }

        } catch (err) {
          console.error("Change Password Error:", err);
          Swal.fire("ระบบผิดผลาด!", "เกิดข้อผิดพลาดขณะเปลี่ยนรหัสผ่าน", "error");
        }
      });
    });