const axios = require('axios');

// Fetch Google Maps Static Image (city map)
exports.getMap = async (req, res) => {
    const { city } = req.params;  // City name from the URL parameter
    const googleMapsAPIKey = 'YOUR_GOOGLE_MAPS_API_KEY';  // Use your Google Maps API key
    try {
        const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${city}&zoom=12&size=600x600&key=${googleMapsAPIKey}`;
        res.json({ mapUrl });
    } catch (error) {
        console.error('Error fetching map:', error);
        res.status(500).send('Failed to fetch map');
    }
};
