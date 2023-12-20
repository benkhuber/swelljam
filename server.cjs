const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config({ path: './.env' });

const app = express();
const port = process.env.PORT;
const url = process.env.DB_STRING;

app.use(cors());
app.use(express.json());

const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

run().catch(console.dir);

app.post('/api/addData', async (req, res) => {
  const newData = req.body;

  try {
    const db = client.db('spots');
    const collection = db.collection('surfspots');

    const result = await collection.insertOne(newData);
    console.log('Data inserted:', result);

    res.status(200).json({ message: 'Data added successfully' });
  } catch (insertErr) {
    console.error('Error inserting data:', insertErr);
    res.status(500).json({ error: 'Failed to insert data' });
  }
});

app.post('/api/addSession', async (req, res) => {
  const newData = req.body;

  try {
    const db = client.db('swelljam');
    const collection = db.collection('sessions');

    const result = await collection.insertOne(newData);
    console.log('Data inserted:', result);

    res.status(200).json({ message: 'Data added successfully' });
  } catch (insertErr) {
    console.error('Error inserting data:', insertErr);
    res.status(500).json({ error: 'Failed to insert data' });
  }
});

app.get('/api/getSessions', async (req, res) => {
  try {
    const db = client.db('swelljam');
    const collection = db.collection('sessions');

    const data = await collection.find({}).toArray();

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.put('/api/updateSession/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const updatedData = req.body;

  console.log(updatedData);

  try {
    const db = client.db('swelljam');
    const collection = db.collection('sessions');
    const result = await collection.updateOne(
      { _id: new ObjectId(sessionId) }, // Assuming sessionId is a valid ObjectId
      { $set: updatedData },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ message: 'Session updated successfully' });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/deleteSession/:id', async (req, res) => {
  const db = client.db('swelljam');
  const collection = db.collection('sessions');
  // eslint-disable-next-line prefer-destructuring
  const id = req.params.id;
  console.log('Deleting session with ID:', id);

  try {
    const objectId = new ObjectId(id);
    const result = await collection.deleteOne({ _id: objectId });
    console.log(result);

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Deleted successfully' });
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/getData', async (req, res) => {
  try {
    const db = client.db('spots');
    const collection = db.collection('surfspots');

    const data = await collection.find({}).toArray();

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
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
