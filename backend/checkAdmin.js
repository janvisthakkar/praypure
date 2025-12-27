const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const admin = await Admin.findOne({ email: 'admin@praypure.com' });
        if (admin) {
            console.log('Admin found:', admin.username);
        } else {
            console.log('Admin NOT found');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkAdmin();
