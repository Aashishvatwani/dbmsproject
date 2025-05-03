const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const db = require('./models/db');
const cityRoutes = require('./routes/cityRoutes');
const packageRoutes = require('./routes/packageRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userDetailRoutes = require('./routes/userdetail');
const finalRoutes = require('./routes/finals');
const addHotel = require('./routes/hoteladd');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ✅ Google Generative AI Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ROUTES
app.use('/api/cities', cityRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/userdetail', userDetailRoutes);
app.use('/api/finals', finalRoutes);

// ✅ Add Hotel Route
app.use('/api/addhotel', addHotel);

// ✅ User existence check
app.get('/api/userexists', (req, res) => {
  const { uid } = req.query;

  db.query('SELECT id FROM userdata WHERE id = ?', [uid], (err, results) => {
    if (err) {
      console.error('Error checking user existence:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length > 0) {
      return res.json({ exists: true, user_id: results[0].id });
    } else {
      return res.json({ exists: false });
    }
  });
});

// ✅ Delete user by Firebase UID
app.delete('/api/deleteuserbyuid/:firebaseUid', (req, res) => {
  const firebaseUid = req.params.firebaseUid;

  db.query('DELETE FROM userdata WHERE id = ?', [firebaseUid], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'User deleted successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  });
});

// ✅ Generate city description and places using Gemini AI
app.post('/api/generate-text', async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: "City name is required" });
  }

  try {
    // Create the model instance using getGenerativeModel
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Using gemini-2.0-flash

    // Define content to request from Gemini model
    const content = `Give me a concise one-line description of the city "${city}". Then provide exactly four tourist places to visit in the city as a numbered list.`;

    // Generate content with the model
    const result = await model.generateContent(content);
    const response = await result.response;
    const text = response.text();

    // Split the text into lines
    const lines = text.split('\n').filter(line => line.trim());
    const description = lines.length > 0 ? lines[0] : "";
    const facts = lines.slice(1).filter(line => /^\d+\./.test(line)).slice(0, 4);

    res.json({ description, facts });
    console.log('Gemini response:', { description, facts });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ message: 'Error generating text', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});