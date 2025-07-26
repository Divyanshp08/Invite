const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;
const secretKey = 'DIVYANSH'; // <-- Change this to a strong secret!

app.use(cors());
app.use(express.json());

app.post('/vote', (req, res) => {
  const { name, answer } = req.body;
  if (!name || !answer) {
    return res.status(400).json({ status: 'error', message: 'Missing name or answer' });
  }
  try {
    fs.appendFileSync('answer.txt', `${name}: ${answer}\n`);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Error writing file:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Secure route to download/view the answer.txt file
app.get('/answers', (req, res) => {
  const key = req.query.key;
  if (key !== secretKey) {
    return res.status(403).send('Forbidden: Invalid key');
  }

  const filePath = path.join(__dirname, 'answer.txt');

  // Check if file exists before sending
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('No answers recorded yet.');
  }

  res.sendFile(filePath, err => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Could not load answer file');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
