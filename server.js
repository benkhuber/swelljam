import dotenv from 'dotenv';
import Express from 'express';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from 'mongoose';

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
  readingDate: Date,
  significantWaveHeight: Number,
  meanWaveDirection: Number,
  averageWavePeriod: Number,
  dominantWavePeriod: Number,
  waterTemperature: Number,
  swellHeight: Number,
  swellPeriod: Number,
  swellDirection: String,
  windWaveHeight: Number,
  windWavePeriod: Number,
  windWaveDirection: String,
});

const StationReadingSchema = new mongoose.Schema({
  buoyStationId: String,
  buoyReading: BuoyDataSchema,
});

const StationReading = mongoose.model('StationReading', StationReadingSchema, 'BuoyReadings');
const BuoyData = mongoose.model('BuoyData', BuoyDataSchema, 'BuoyReadings');

const fetchData = async (stationId) => {
  try {
    // Parse Dominant Buoy Data
    const buoyResponse = await axios.get(`https://www.ndbc.noaa.gov/data/realtime2/${stationId}.txt`);

    const lines = buoyResponse.data.toString().split('\n');
    const currentReading = lines[2].trim().split(/\s+/);

    const year = currentReading[0];
    const month = currentReading[1];
    const day = currentReading[2];
    const hour = currentReading[3];
    const minute = currentReading[4];
    const significantWaveHeight = currentReading[8];
    const averageWavePeriod = currentReading[10];
    const meanWaveDirection = currentReading[11];
    const dominantWavePeriod = currentReading[9];
    const waterTemperature = currentReading[14];

    const utcDate = `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
    const readingDate = new Date(utcDate);

    // Parse Spectral Buoy Data
    const detailedBuoyResponse = await axios.get(`https://www.ndbc.noaa.gov/data/realtime2/${stationId}.spec`);

    const spectralLines = detailedBuoyResponse.data.toString().split('\n');
    const currentSpectralReading = spectralLines[2].trim().split(/\s+/);

    const swellHeight = currentSpectralReading[6];
    const swellPeriod = currentSpectralReading[7];
    const swellDirection = currentSpectralReading[10];
    const windWaveHeight = currentSpectralReading[8];
    const windWavePeriod = currentSpectralReading[9];
    const windWaveDirection = currentSpectralReading[11];

    // New Station Reading
    const current = new StationReading({
      buoyStationId: `${stationId}`,
      buoyReading: new BuoyData({
        readingDate,
        significantWaveHeight,
        meanWaveDirection,
        averageWavePeriod,
        dominantWavePeriod,
        waterTemperature,
        swellHeight,
        swellPeriod,
        swellDirection,
        windWaveHeight,
        windWavePeriod,
        windWaveDirection,
      }),
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
