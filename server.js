const express = require('express');
const path = require('path');

const app = express();
const PORT = 80;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route for unmatched URLs
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
