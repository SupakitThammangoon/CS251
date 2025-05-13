document.querySelector('.edit-button').addEventListener('click', () => {
    alert('กำลังไปที่หน้าแก้ไขโปรไฟล์...');
});

document.querySelector('.search-bar button').addEventListener('click', () => {
    const query = document.querySelector('.search-bar input').value;
    if (query) {
        alert(`กำลังค้นหา: ${query}`);
    }
});