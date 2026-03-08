const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
require('dotenv').config();
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://admin.praypure.com',
    'https://praypure-frontend.vercel.app',
    'https://praypure-admins.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
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
app.use('/api/qrcodes', require('./routes/qrcodes'));
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