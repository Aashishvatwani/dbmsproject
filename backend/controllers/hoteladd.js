const fs = require('fs'); // For createWriteStream
const fsp = require('fs').promises; // For promise-based read/write
const path = require('path');
const csvWriter = require('fast-csv');

const csvFilePath = path.join(__dirname, '../archive/hotels2.csv');
const helloPath = path.join(__dirname, '../../trip-management-system/src/components/hello.json');

exports.saveCityAndHotel = async (req, res) => {
  const {
    city,
    hotel_price,
    hotel_rating,
    city_description,
    cool_features,
    hotel_name,
    hotel_description,
    hotel_features = []   // Default to empty array if not provided
  } = req.body;

  if (!city || !hotel_name) {
    return res.status(400).json({ message: "City and Hotel Name are required." });
  }

  // --- 1. Append city data to hello.json ---
  const cityData = {
    city,
    description: city_description,
    best_places_to_visit: cool_features,
    timestamp: new Date().toISOString()
  };
  
  try {
    let json = [];
    try {
      const data = await fsp.readFile(helloPath, 'utf-8');
      if (data) {
        json = JSON.parse(data);
      }
    } catch (readErr) {
      if (readErr.code === 'ENOENT') {
        console.log("hello.json not found, creating a new one.");
      } else {
        console.error("Error reading hello.json:", readErr);
        return res.status(500).json({ message: "Failed to read city data file." });
      }
    }
  
    const alreadyExists = json.some(entry => entry.city.toLowerCase() === city.toLowerCase());
  
    if (!alreadyExists) {
      json.push(cityData);
      await fsp.writeFile(helloPath, JSON.stringify(json, null, 2));
      console.log("New city added to hello.json");
    } else {
      console.log("City already exists in hello.json, skipping...");
    }
  
  } catch (writeErr) {
    console.error("Error writing to hello.json:", writeErr);
    return res.status(500).json({ message: "Failed to save city data." });
  }

  // --- 2. Append hotel data to CSV file ---
  const newHotel = {
    Hotel_Name: hotel_name,
    Hotel_Rating: hotel_rating, // Optional
    City: city,

    Feature_1: hotel_features[0] || '',
    Feature_2: hotel_features[1] || '',
    Feature_3: hotel_features[2] || '',
    Feature_4: hotel_features[3] || '',
    Feature_5: hotel_features[4] || '',
    Feature_6: hotel_features[5] || '',
    Feature_7: hotel_features[6] || '',
    Feature_8: hotel_features[7] || '',
    Feature_9: hotel_features[8] || '',
    Hotel_Price: hotel_price  
     // Optional
  };

  try {
    const stream = fs.createWriteStream(csvFilePath, { flags: 'a' });
    const csvStream = csvWriter.format({ headers: false ,  rowDelimiter: '\n', });

    stream.on('error', (streamErr) => {
      console.error("Error writing to CSV stream:", streamErr);
      return res.status(500).json({ message: "Failed to save hotel data to CSV." });
    });

    csvStream.pipe(stream).on('finish', () => {
      console.log("Hotel data appended to CSV");
      return res.status(200).json({ message: "City and hotel data saved and added to CSV!" });
    });

    csvStream.write(newHotel);
    csvStream.end();

  } catch (csvError) {
    console.error("Error creating CSV write stream:", csvError);
    return res.status(500).json({ message: "Failed to save hotel data to CSV." });
  }
};
