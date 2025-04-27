const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const cityRoutes = require('./routes/cityRoutes');  // Import city routes
const packageRoutes = require('./routes/packageRoutes');  // Import package routes

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use('/api/cities', cityRoutes);
app.use('/api/packages', packageRoutes);  // Add package route

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
