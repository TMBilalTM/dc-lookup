const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/api/captcha', (req, res) => {
  try {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);

    const correctAnswer = num1 + num2;

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
