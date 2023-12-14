const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Replace with your MongoDB Atlas connection string
const mongoUri = "mongodb+srv://MERN:mernstack@cluster0.36bh8a0.mongodb.net/?retryWrites=true&w=majority";

let client;

// Connect to MongoDB using MongoClient
async function connectToDatabase() {
  try {
    client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB database.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Set up a POST route to receive data from the gateway
app.post('/gateway', async (req, res) => {
  try {
    if (!client || !client.isConnected()) {
      await connectToDatabase();
    }

    // Access the database and collection
    const database = client.db('BLE'); // Replace with your actual database name
    const collection = database.collection('SensorData'); // Replace with your actual collection name

    // Create a new document from the incoming data
    const sensorData = req.body;

    // Save the document to the MongoDB database
    const result = await collection.insertOne(sensorData);

    console.log('Data saved successfully:', result);
    res.status(200).send('Data received and saved');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
