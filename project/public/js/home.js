document.querySelectorAll('.movie-card').forEach(card => {
    card.addEventListener('click', () => {
        alert('คลิกเพื่อดูรายละเอียดภาพยนตร์!');
    });
});

document.querySelector('.search-bar button')?.addEventListener('click', () => {
    const query = document.querySelector('.search-bar input')?.value;
    if (query) {
        alert(`กำลังค้นหา: ${query}`);
    }
});