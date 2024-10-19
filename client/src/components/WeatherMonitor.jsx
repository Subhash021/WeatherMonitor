import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherMonitor = () => {
    const [weatherData, setWeatherData] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await axios.get('http://localhost:3000/api/weather');
    //         setWeatherData(response.data);
    //     };

    //     const ws = new WebSocket('ws://localhost:3000');
    //     ws.onmessage = (event) => {
    //         const newWeatherData = JSON.parse(event.data);
    //         setWeatherData((prevData) => [...prevData, newWeatherData]);
    //     };

    //     fetchData();

    //     return () => ws.close();
    // }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/weather');
                console.log('Fetched weather data:', response.data); // Log the fetched data
                setWeatherData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        const ws = new WebSocket('ws://localhost:3000');
        ws.onmessage = (event) => {
            const newWeatherData = JSON.parse(event.data);
            console.log('Received WebSocket data:', newWeatherData); // Log incoming WebSocket data
            setWeatherData((prevData) => [...prevData, newWeatherData]);
        };
    
        fetchData();
    
        return () => ws.close();
    }, []);
    



    return (
        <div>
            <h1>Weather Monitoring</h1>
            <ul>
                {weatherData.map((data, index) => (
                    <li key={index}>
                        {`Temp: ${data.temperature}°C, Humidity: ${data.humidity}%, Wind: ${data.windSpeed} m/s`}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WeatherMonitor;