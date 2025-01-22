const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 80;
app.use(cors());

// Function to fetch TLE data
async function fetchTLEs() {
  try {
    const response = await axios.get('https://celestrak.org/NORAD/elements/gp.php?GROUP=iridium-NEXT&FORMAT=tle');
    const tleData = response.data;

    // Save TLE data to a file
    fs.writeFileSync('public/tle-data.txt', tleData);
    console.log('TLE data saved successfully!');
  } catch (error) {
    console.error('Error fetching TLE data:', error.message);
  }
}

// Schedule the task to run daily at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Fetching TLE data...');
  fetchTLEs();
});

// Endpoint to serve the TLE file
app.get('/tle-data', (req, res) => {
  const filePath = './public/tle-data.txt';

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath, { root: __dirname });
  } else {
    res.status(404).send('TLE data not found. Please wait for the daily update.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  
  // Fetch TLEs on server start as well
  //fetchTLEs();
});


// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));


// Fallback route for unmatched URLs
app.use((req, res) => {
  res.status(404).send('Page not found');
});
