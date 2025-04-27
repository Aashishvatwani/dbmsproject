const axios = require('axios');

// Function to map city names to their images manually
const cityImages = {
  'Goa': 'https://images.unsplash.com/photo-1576402187871-9b3c59e99367?auto=format&fit=crop&w=800&q=60',
  'Manali': 'https://images.unsplash.com/photo-1586258327305-861dedf7c4d6?auto=format&fit=crop&w=800&q=60',
  'Jaipur': 'https://images.unsplash.com/photo-1601209864207-20805c9a7b97?auto=format&fit=crop&w=800&q=60',
  // Add more cities manually or dynamically if you want
};

// Fetch cities from external API
exports.getCities = async (req, res) => {
  try {
    const response = await axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
      headers: {
        'X-RapidAPI-Key': '5d56f4eecfmsh9ead906ba1e319fp11edcdjsnb4b5ec4e9217',   // your key
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      },
      params: {
        countryIds: 'IN', // Example: India
        limit: 10 // Limit to 10 cities
      }
    });

    console.log(response.data);  // Inspect the structure of the response

    const citiesData = response.data.data || []; // Fallback to empty array if no data

    // If no cities returned, send a meaningful error response
    if (citiesData.length === 0) {
      return res.status(404).send('No cities found');
    }

    const citiesWithImages = citiesData.slice(0, 10).map(city => ({
      name: city.name,
      imageUrl: cityImages[city.name] || `https://source.unsplash.com/800x600/?${city.name},city`
      // If not manually mapped, fallback to Unsplash search
    }));

    res.json({ cities: citiesWithImages });

  } catch (error) {
    console.error('Error fetching cities:', error.response ? error.response.data : error.message);
    res.status(500).send('Failed to fetch cities');
  }
};
