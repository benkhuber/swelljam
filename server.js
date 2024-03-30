import dotenv from 'dotenv';
import Express from 'express';
import axios from 'axios';

dotenv.config({ path: './.env' });

const app = Express();
const port = process.env.PORT;
const apiUrl = 'https://www.ndbc.noaa.gov/data/realtime2/46253.txt';

const fetchData = async () => {
  try {
    const response = await axios.get(apiUrl);

    const lines = response.data.toString().split('\n');
    const currentReading = lines[2].trim().split(/\s+/);

    const year = currentReading[0];
    const month = currentReading[1];
    const day = currentReading[2];
    const hour = currentReading[3];
    const minute = currentReading[4];
    const waveHeight = currentReading[8];
    const meanWaveDirection = currentReading[11];
    const dominantPeriod = currentReading[9];
    const waterTemperature = currentReading[14];

    const utcDate = `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
    const newLocalDate = new Date(utcDate);

    console.log(utcDate);
    console.log(newLocalDate);

    const current = {
      buoyStationId: '46253',
      localDate: newLocalDate,
      significantHeight: waveHeight,
      dominantSwellDirection: meanWaveDirection,
      peakPeriod: dominantPeriod,
      currentWaterTemperature: waterTemperature,
    };

    console.log(current);
  } catch (error) {
    console.error('Error fetching data', error);
  }
};

app.get('/', (req, res) => {
  res.send('Hello, World');
});

fetchData();
setInterval(fetchData, 3600000);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
