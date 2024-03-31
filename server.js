import dotenv from 'dotenv';
import Express from 'express';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from 'mongoose';

dotenv.config({ path: './.env' });

const app = Express();
const port = process.env.PORT;
const url = process.env.DB_STRING;
const stationId = '46253';

mongoose.connect(url);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const BuoyDataSchema = new mongoose.Schema({
  readingDate: Date,
  waveHeight: Number,
  meanWaveDirection: Number,
  averagePeriod: Number,
  dominantWavePeriod: Number,
  waterTemperature: Number,
});

const StationReadingSchema = new mongoose.Schema({
  buoyStationId: String,
  buoyReading: BuoyDataSchema,
});

const StationReading = mongoose.model('StationReading', StationReadingSchema, 'BuoyReadings');
const BuoyData = mongoose.model('BuoyData', BuoyDataSchema, 'BuoyReadings');

const fetchData = async () => {
  try {
    const buoyResponse = await axios.get(`https://www.ndbc.noaa.gov/data/realtime2/${stationId}.txt`);
    const detailedBuoyResponse = await axios.get(`https://www.ndbc.noaa.gov/data/realtime2/${stationId}.spec`);

    const lines = buoyResponse.data.toString().split('\n');
    const currentReading = lines[2].trim().split(/\s+/);

    const year = currentReading[0];
    const month = currentReading[1];
    const day = currentReading[2];
    const hour = currentReading[3];
    const minute = currentReading[4];
    const waveHeight = currentReading[8];
    const averagePeriod = currentReading[10];
    const meanWaveDirection = currentReading[11];
    const dominantWavePeriod = currentReading[9];
    const waterTemperature = currentReading[14];

    const utcDate = `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
    const readingDate = new Date(utcDate);

    const current = new StationReading({
      buoyStationId: '46253',
      buoyReading: new BuoyData({
        readingDate,
        waveHeight,
        meanWaveDirection,
        averagePeriod,
        dominantWavePeriod,
        waterTemperature,
      }),
    });

    console.log(current);

    await current.save();
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
