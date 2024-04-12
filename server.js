import dotenv from 'dotenv';
import Express from 'express';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from 'mongoose';
// eslint-disable-next-line import/extensions
import BuoyReading from './src/classes/BuoyReadingClass.js';

dotenv.config({ path: './.env' });

const app = Express();
const port = process.env.PORT;
const url = process.env.DB_STRING;

mongoose.connect(url);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const BuoyDataSchema = new mongoose.Schema({
  reading: Date,
  station: String,
  buoyReading: Object,
});

const fetchData = async (stationId) => {
  try {
    const BuoyData = mongoose.model('BuoyData', BuoyDataSchema, `${stationId}`);

    // Parse Dominant Buoy Data
    const buoyResponse = await axios.get(`https://www.ndbc.noaa.gov/data/realtime2/${stationId}.txt`);

    const lines = buoyResponse.data.toString().split('\n');
    const currentReading = lines[2].trim().split(/\s+/);

    // Parse Spectral Buoy Data
    const detailedBuoyResponse = await axios.get(`https://www.ndbc.noaa.gov/data/realtime2/${stationId}.spec`);

    const spectralLines = detailedBuoyResponse.data.toString().split('\n');
    const currentSpectralReading = spectralLines[2].trim().split(/\s+/);

    // Combine buoy and spectral responses into one buoyObject
    const buoyObject = new BuoyReading(stationId, currentReading, currentSpectralReading);

    // New Station Reading
    const current = new BuoyData({
      reading: buoyObject.readingDate,
      station: buoyObject.stationId,
      buoyReading: buoyObject,
    });

    await current.save();
  } catch (error) {
    console.error('Error fetching data', error);
  }
};

const availableBuoys = ['46253', '46222', '46277'];

const queryAllBuoys = () => {
  availableBuoys.forEach((buoyStation) => {
    fetchData(buoyStation);
  });
};

app.get('/', (req, res) => {
  res.send('Hello, World');
});

queryAllBuoys();
setInterval(queryAllBuoys, 3600000);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
