const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Captcha oluşturma endpoint'i
app.get('/api/captcha', (req, res) => {
  try {
    // Rasgele olarak iki sayı seçelim
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);

    // Doğru cevabı hesaplayalım
    const correctAnswer = num1 + num2;

    // Captcha verilerini gönderelim
    res.status(200).json({
      num1,
      num2,
      operation: '+',
      correctAnswer,
    });
  } catch (error) {
    console.error('Error generating captcha:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
