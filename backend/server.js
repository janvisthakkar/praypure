const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Assets from Frontend Public Folder
app.use('/assets', express.static(path.join(__dirname, '../frontend/public/assets')));


// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/subscribers', require('./routes/subscribers'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/content', require('./routes/content'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/auth', require('./routes/auth'));
app.get('/api/test', (req, res) => res.send('Test route works'));
app.post('/api/upload', require('./controllers/uploadController').uploadMiddleware, require('./controllers/uploadController').uploadImage);

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Praypure API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});