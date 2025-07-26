const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

// Use port from environment (e.g., Render) or default to 3000 for local dev
const port = process.env.PORT || 3000;

// Your secure secret key for protected routes
const secretKey = 'DIVYANSH';

app.use(cors());
app.use(express.json());

// POST /vote - Receive RSVP submission and append to answer.txt
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

// GET /answers - Securely serve the answer.txt file contents if the correct key is provided
app.get('/answers', (req, res) => {
  const key = req.query.key;

  if (key !== secretKey) {
    return res.status(403).send('Forbidden: Invalid key');
  }

  const filePath = path.join(__dirname, 'answer.txt');

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

// POST /clear - Securely clear the contents of answer.txt if the correct key is provided
app.post('/clear', (req, res) => {
  const key = req.query.key;

  if (key !== secretKey) {
    return res.status(403).json({ status: 'error', message: 'Forbidden: Invalid key' });
  }

  const filePath = path.join(__dirname, 'answer.txt');

  fs.writeFile(filePath, '', err => {
    if (err) {
      console.error('Error clearing file:', err);
      return res.status(500).json({ status: 'error', message: 'Could not clear answer file' });
    }
    res.json({ status: 'ok', message: 'Answer file cleared successfully' });
  });
});

// Optional: root route for testing server status
app.get('/', (req, res) => {
  res.send('RSVP backend server is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
