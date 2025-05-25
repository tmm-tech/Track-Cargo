const express = require('express');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const UserRoutes = require('./routes/UserRoutes');
const ImageRoutes = require('./routes/ImageRoutes');
const ProgramRoutes = require('./routes/ProgramRoutes');
const NewsRoutes = require('./routes/NewsRoutes');
const CareerRoutes = require('./routes/CareerRoutes');
const EmployeeRoutes = require('./routes/EmployeeRoutes');
const NotificationRoutes = require('./routes/NotificationRoutes'); 
const cookieParser = require('cookie-parser');

const app = express(); 

// Middleware setup
app.use(cookieParser());
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const allowedOrigins = [
    'https://ketrb-cms-one.vercel.app',
    'https://ketrb.netlify.app'
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
app.use('/images', ImageRoutes);
app.use('/programs', ProgramRoutes);
app.use('/notifications', NotificationRoutes);
app.use('/employees', EmployeeRoutes);
app.use('/careers', CareerRoutes);
app.use('/news', NewsRoutes);
app.get('/', (req, res) => {
    res.json({ message: "Confirmed Connection to KETRB CMS" });
});

app.get('/check-file/:folder/:filename', (req, res) => {
    const { folder, filename } = req.params;
    const filePath = path.join(__dirname, 'public', folder, filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist
            return res.status(404).json({ message: 'File not found' });
        }
        // File exists
        return res.status(200).json({ message: 'File exists', filePath });
    });
});

// Server setup
const port = process.env.PORT || 4080;
app.listen(port, () => {
    console.log(`Authentication Server Listening on port: ${port}`);
});
