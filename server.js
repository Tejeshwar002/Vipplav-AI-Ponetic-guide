const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db'); // Ensure the DB is connected
const teluguTextRoutes = require('./routes/telugu_text'); // Import the routes

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Logging middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use('/', teluguTextRoutes); // Use the routes

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
