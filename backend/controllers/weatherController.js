const axios = require('axios');

// Fetch Weather for a City
exports.getWeather = async (req, res) => {
    const { city } = req.params;  // City name from the URL parameter
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: city,  // City name from the URL
                appid: '5d56f4eecfmsh9ead906ba1e319fp11edcdjsnb4b5ec4e9217',  // Use your OpenWeather API key
                units: 'metric'  // For temperature in Celsius
            }
        });
        const weather = response.data;
        res.json(weather);
    } catch (error) {
        console.error('Error fetching weather:', error);
        res.status(500).send('Failed to fetch weather');
    }
};
