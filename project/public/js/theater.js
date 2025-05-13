let currentLink = null;

// ตั้งค่าเริ่มต้นเป็น "กรุงเทพ" เมื่อหน้าโหลด
document.addEventListener('DOMContentLoaded', () => {
    const defaultTarget = 'bangkok';
    document.querySelectorAll('.theater-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(defaultTarget).classList.add('active');
    currentLink = document.querySelector(`[data-target="${defaultTarget}"]`);
    currentLink.classList.add('active');
});

document.querySelectorAll('.theater-menu a').forEach(link => {
    link.addEventListener('mouseover', () => {
        const target = link.getAttribute('data-target');
        document.querySelectorAll('.theater-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(target).classList.add('active');

        // ลบสถานะ active จากลิงก์ก่อนหน้าและเพิ่มให้ลิงก์ปัจจุบัน
        if (currentLink) {
            currentLink.classList.remove('active');
        }
        currentLink = link;
        currentLink.classList.add('active');
    });
});

document.querySelector('.search-bar button').addEventListener('click', () => {
    const query = document.querySelector('.search-bar input').value;
    if (query) {
        alert(`กำลังค้นหาโรงภาพยนต์: ${query}`);
    }
});