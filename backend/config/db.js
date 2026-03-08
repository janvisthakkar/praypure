const mongoose = require('mongoose');

// Create the connections (they don't block the event loop, they'll connect asynchronously)
const mainDB = mongoose.createConnection();
const qrDB = mongoose.createConnection();

const connectDB = async () => {
    try {
        // Main Database (Admins, Products, etc.)
        const mainConnStr = (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/praypure').replace('localhost', '127.0.0.1');
        await mainDB.openUri(mainConnStr, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Main MongoDB Connected: ${mainDB.host}`);

        // QR Database (Exclusively for QRCodes)
        const qrConnStr = (process.env.MONGODB_URI_QR || 'mongodb://127.0.0.1:27017/praypure-qr-db').replace('localhost', '127.0.0.1');
        await qrDB.openUri(qrConnStr, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`QR MongoDB Connected: ${qrDB.host}`);
        
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { connectDB, mainDB, qrDB };