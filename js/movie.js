document.querySelectorAll('.movie-card').forEach(card => {
    card.addEventListener('click', () => {
        alert('คลิกเพื่อดูรายละเอียดภาพยนตร์!');
    });
});

document.querySelector('.search-bar button').addEventListener('click', () => {
    const query = document.querySelector('.search-bar input').value;
    if (query) {
        alert(`กำลังค้นหา: ${query}`);
    }
});

document.querySelector('.movie-search button').addEventListener('click', () => {
    const query = document.querySelector('.movie-search input').value;
    if (query) {
        alert(`ค้นหาในหน้านี้: ${query}`);
    }
});