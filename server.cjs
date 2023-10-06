const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001;
const url = 'mongodb+srv://benkhuber:fFkbGyL1fhm7AgLY@spots.yfq671c.mongodb.net/?retryWrites=true&w=majority'

app.use(cors());
app.use(express.json());

const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

run().catch(console.dir);

app.post('/api/addData', async (req, res) => {
  const newData = req.body;

  try {
    const db = client.db('spots');
    const collection = db.collection('surfspots'); // Replace with your collection name

    const result = await collection.insertOne(newData);
    console.log('Data inserted:', result);

    res.status(200).json({ message: 'Data added successfully' });
  } catch (insertErr) {
    console.error('Error inserting data:', insertErr);
    res.status(500).json({ error: 'Failed to insert data' });
  }
});

app.get('/api/buoydata/realtime/:stationId', async (req, res) => {
  try {
    const { stationId } = req.params;
    const apiUrl = `https://www.ndbc.noaa.gov/data/realtime2/${stationId}.txt`;
    const response = await axios.get(apiUrl);
    const { data } = response;
    res.setHeader('Content-Type', 'text/plain');
    res.send(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.get('/api/buoydata/spectral/:stationId', async (req, res) => {
  try {
    const { stationId } = req.params;
    const apiUrl = `https://www.ndbc.noaa.gov/data/realtime2/${stationId}.spec`;
    const response = await axios.get(apiUrl);
    const { data } = response;
    res.setHeader('Content-Type', 'text/plain');
    res.send(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.get('/api/buoydata/allstations', async (req, res) => {
  try {
    const apiUrl = 'https://www.ndbc.noaa.gov/activestations.xml';
    const response = await axios.get(apiUrl);
    const { data } = response;
    res.send(data);
  } catch (error) {
    console.error('Error fetching station data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
