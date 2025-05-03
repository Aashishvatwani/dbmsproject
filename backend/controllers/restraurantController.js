const csv = require('csvtojson');
const path = require('path');

// Path to your CSV file
const csvFilePath = path.join(__dirname, '../archive/hotels2.csv'); // adjust the path as needed

// Get hotels by city
exports.getCityDetails = async (req, res) => {
  const { city } = req.params;

  try {
    // Parse the CSV file to JSON
    const hotels = await csv().fromFile(csvFilePath);

    // Filter hotels based on the requested city name
    const filteredHotels = hotels.filter(hotel => 
      hotel.City && hotel.City.toLowerCase() === city.toLowerCase()
    );

    if (filteredHotels.length === 0) {
      return res.status(404).json({ message: `No hotels found for city: ${city}` });
    }

    // Prepare hotel data to send
    const hotelsData = filteredHotels.map(hotel => ({
      name: hotel.Hotel_Name,
      rating: hotel.Hotel_Rating,
      price: hotel.Hotel_Price,
      features: {
        feature_1: hotel.Feature_1,
        feature_2: hotel.Feature_2,
        feature_3: hotel.Feature_3,
        feature_4: hotel.Feature_4,
        feature_5: hotel.Feature_5,
        feature_6: hotel.Feature_6,
        feature_7: hotel.Feature_7,
        feature_8: hotel.Feature_8,
        feature_9: hotel.Feature_9,
      }
    }));

    res.json({
      city: city,
      hotels: hotelsData
    });

  } catch (error) {
    console.error('Error reading hotel data:', error);
    res.status(500).json({ message: 'Failed to fetch city details from local dataset', error: error.message });
  }
};
