const axios = require('axios');

// Manually mapped city images
const cityImages = {
  'Goa': 'https://images.unsplash.com/photo-1576402187871-9b3c59e99367?auto=format&fit=crop&w=800&q=60',
  'Manali': 'https://images.unsplash.com/photo-1586258327305-861dedf7c4d6?auto=format&fit=crop&w=800&q=60',
  'Jaipur': 'https://images.unsplash.com/photo-1601209864207-20805c9a7b97?auto=format&fit=crop&w=800&q=60',
  // Add more if you want
};

// Fetch top cities (default list)
exports.getCities = async (req, res) => {
  try {
    const response = await axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
      headers: {
        'X-RapidAPI-Key': '5d56f4eecfmsh9ead906ba1e319fp11edcdjsnb4b5ec4e9217',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      },
      params: {
        countryIds: 'IN', // India
        limit: 10
      }
    });

    const citiesData = response.data.data || [];

    if (citiesData.length === 0) {
      return res.status(404).send('No cities found');
    }

    const citiesWithImages = citiesData.map(city => ({
      name: city.name,
      imageUrl: cityImages[city.name] || `https://source.unsplash.com/800x600/?${city.name},city`
    }));

    res.json({ cities: citiesWithImages });

  } catch (error) {
    console.error('Error fetching cities:', error.response ? error.response.data : error.message);
    res.status(500).send('Failed to fetch cities');
  }
};

// Search cities based on user input
exports.searchCities = async (req, res) => {
  const searchTerm = req.params.name; // Capture "query" from URL

  if (!searchTerm) {
    return res.status(400).send('Query parameter is required');
  }

  try {
    const response = await axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
      headers: {
        'X-RapidAPI-Key': '5d56f4eecfmsh9ead906ba1e319fp11edcdjsnb4b5ec4e9217',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      },
      params: {
        countryIds: 'IN',
        limit: 10,
        namePrefix: searchTerm // Important for searching
      }
    });

    const citiesData = response.data.data || [];

    if (citiesData.length === 0) {
      return res.status(404).send('No matching cities found');
    }

    const citiesWithImages = citiesData.map(city => ({
      name: city.name,
      imageUrl: cityImages[city.name] || `https://source.unsplash.com/800x600/?${city.name},city`
    }));

    res.json({ cities: citiesWithImages });

  } catch (error) {
    console.error('Error searching cities:', error.response ? error.response.data : error.message);
    res.status(500).send('Failed to search cities');
  }
};
