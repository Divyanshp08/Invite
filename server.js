const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(require('cors')());

app.post('/vote', (req, res) => {
  const { name, answer } = req.body;
  if (!name || !answer) {
    res.status(400).json({ status: 'error', message: 'Missing name or answer' });
    return;
  }

  try {
    fs.appendFileSync('answer.txt', `${name}: ${answer}\n`);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Error writing file:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
