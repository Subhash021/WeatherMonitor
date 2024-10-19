const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const WebSocket = require('ws');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const server = app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
const wss = new WebSocket.Server({ server });

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

// Weather schema
const weatherSchema = new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    timestamp: { type: Date, default: Date.now }
});

const Weather = mongoose.model('Weather', weatherSchema);

// WebSocket connection
wss.on('connection', (ws) => {
    console.log('Client connected');
});


app.get('/api/weather', async (req, res) => {
    const data = await Weather.find({});
    res.json(data);
});


// Fetch weather data from OpenWeather API
const fetchWeatherData = async () => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);
      const data=response.data
        // console.log(response.data)
        const weatherData = new Weather({
            temperature: data.main.temp,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        });

        // Save to database
        await weatherData.save();
        // Broadcast to WebSocket clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(weatherData));
            }
        });
    } catch (error) {
        console.error(error);
    }
};

// Fetch weather data every 10 minutes
// setInterval(fetchWeatherData, 10 * 60 * 1000);
fetchWeatherData()
