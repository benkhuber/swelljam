const express = require('express');
const axios = require('axios');
const cors = require('cors'); 
const app = express();
const port = 3001;

app.use(cors());

app.use(express.json());

app.get('/api/buoydata', async (req, res) => {
  try {
    const apiUrl = 'https://www.ndbc.noaa.gov/data/realtime2/46253.txt';
    const response = await axios.get(apiUrl);
    const data = response.data;
    res.setHeader('Content-Type', 'text/plain');
    res.send(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});