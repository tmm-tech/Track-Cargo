const express = require('express');
require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const UserRoutes = require('./routes/UserRoutes');
const PackageRoutes = require('./routes/PackageRoutes');
const ActivityRoutes = require('./routes/ActivityRoutes');
const LocationRoutes = require('./routes/LocationRoutes'); 
const cookieParser = require('cookie-parser');

const app = express(); 


const allowedOrigins = [
    'https://track-cargo.vercel.app/',
  ];
  
  const corsOptions = {
    origin: true,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware to add token to the request
const addTokenToRequest = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7); // Remove 'Bearer ' from the beginning
        try {
            const decodedToken = await jwt.verify(token, process.env.SECRET);
            req.token = decodedToken;
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token.' });
        }
    }
    next();
};

app.use(addTokenToRequest);

// Route handling
app.use('/users', UserRoutes);
app.use('/package', PackageRoutes);
app.use('/activity', ActivityRoutes);
app.use('/location', LocationRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Confirmed Connection to Texmon LOGISTICS" });
});


// Server setup
const port = process.env.PORT || 4080;
app.listen(port, () => {
    console.log(`Authentication Server Listening on port: ${port}`);
});
