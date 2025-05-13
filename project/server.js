const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// ให้ Express เสิร์ฟไฟล์ static จากโฟลเดอร์ 'public'
app.use(express.static(path.join(__dirname, 'public')));

// เส้นทาง root ('/') ให้แสดง home.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
