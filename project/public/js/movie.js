// จัดการการเลือกแท็บ
document.querySelectorAll('.movie-tabs a').forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.movie-tabs a').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// จัดการการค้นหา
document.querySelector('.movie-search button').addEventListener('click', () => {
    const query = document.querySelector('.movie-search input').value.trim();
    if (query) {
        alert(`กำลังค้นหา: ${query}`);
        // ตัวอย่าง: สามารถเปลี่ยนไปหน้าใหม่หรือกรองผลลัพธ์ได้ที่นี่
        // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
});

// รองรับการกด Enter ใน input
document.querySelector('.movie-search input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
            alert(`กำลังค้นหา: ${query}`);
            // ตัวอย่าง: สามารถเปลี่ยนไปหน้าใหม่หรือกรองผลลัพธ์ได้ที่นี่
            // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    }
});