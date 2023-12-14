const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Replace with your MongoDB Atlas connection string
const mongoString = "mongodb+srv://MERN:mernstack@cluster0.36bh8a0.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoString, {})
 .then(() => console.log('Connected to MongoDB database.'))
 .catch(error => console.error('MongoDB connection error:', error));

// Define a schema for the data
const SensorDataSchema = new mongoose.Schema({
 sensorId: String,
 timestamp: Date,
 value: Number,
});

// Create a model from the schema
const SensorData = mongoose.model('SensorData', SensorDataSchema);

// Create an Express application
const app = express();

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

// Set up a POST route to receive data from the gateway
app.post('/gateway', async (req, res) => {
 try {
   // Create a new document from the incoming data
   const sensorData = new SensorData(req.body);

   // Save the document to the MongoDB database
   const savedData = await sensorData.save();
   console.log('Data saved successfully:', savedData);
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
