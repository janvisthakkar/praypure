const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const { mainDB } = require('./config/db');
require('dotenv').config();

const createAdmin = async () => {
    try {
        console.log("Connecting to main database...");
        // Ensure mainDB is connected
        const mainConnStr = (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/praypure').replace('localhost', '127.0.0.1');
        await mainDB.openUri(mainConnStr, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const email = 'janvisthakkar@gmail.com';
        
        // Check if admin exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            console.log(`Admin ${email} already exists!`);
            process.exit(0);
        }

        const admin = new Admin({
            username: 'Janvi Thakkar',
            email: email,
            password: 'google_oauth_placeholder_password_123!@#', // Required by schema but bypassed by google auth
            role: 'superadmin'
        });

        await admin.save();
        console.log(`Successfully created admin account for ${email}!`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
