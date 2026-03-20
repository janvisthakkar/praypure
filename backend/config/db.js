const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Force IPv4 loopback to avoid Node 17+ IPv6 issues
        // Replace localhost with 127.0.0.1 in the connection string
        const connStr = (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/praypure').replace('localhost', '127.0.0.1');

        const conn = await mongoose.connect(connStr, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;