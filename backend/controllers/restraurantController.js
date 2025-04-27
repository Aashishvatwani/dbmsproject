const axios = require('axios');

// Fetch Restaurants in a city
exports.getRestaurants = async (req, res) => {
    const { city } = req.params;  // City name from the URL parameter
    try {
        const response = await axios.get(`https://api.yelp.com/v3/businesses/search`, {
            headers: {
                'Authorization': 'Bearer 5d56f4eecfmsh9ead906ba1e319fp11edcdjsnb4b5ec4e9217'  // Use your Yelp API key
            },
            params: {
                location: city,  // Dynamic city from the URL parameter
                categories: 'restaurants'
            }
        });
        const restaurants = response.data.businesses;
        res.json(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).send('Failed to fetch restaurants');
    }
};

// Fetch Hotels in a city
exports.getHotels = async (req, res) => {
    const { city } = req.params;  // City name from the URL parameter
    try {
        const response = await axios.get(`https://api.yelp.com/v3/businesses/search`, {
            headers: {
                'Authorization': 'Bearer 5d56f4eecfmsh9ead906ba1e319fp11edcdjsnb4b5ec4e9217'  // Use your Yelp API key
            },
            params: {
                location: city,  // Dynamic city from the URL parameter
                categories: 'hotels'
            }
        });
        const hotels = response.data.businesses;
        res.json(hotels);
    } catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).send('Failed to fetch hotels');
    }
};
