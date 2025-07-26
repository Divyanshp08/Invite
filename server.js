const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

// Use the port assigned by the environment (e.g., Render) or default to 3000 locally
const port = process.env.PORT || 3000;

// Enable CORS for all origins so your frontend (Netlify) can communicate
app.use(cors());

// Parse incoming JSON bodies
app.use(express.json());

// POST endpoint to receive votes
app.post('/vote', (req, res) => {
  const { name, answer } = req.body;

  // Validate incoming data
  if (!name || !answer) {
    return res.status(400).json({ status: 'error', message: 'Missing name or answer' });
  }

  try {
    // Append vote to answer.txt (creates file if not exists)
    fs.appendFileSync('answer.txt', `${name}: ${answer}\n`);
    // Respond with success status
    res.json({ status: 'ok' });
  } catch (err) {
    // Log error and respond with 500
    console.error('Error writing file:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Optional: Root route to check server status (can remove if not needed)
app.get('/', (req, res) => {
  res.send('RSVP backend server is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
