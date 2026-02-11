import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: {
        type: String,
        enum: ['ADMIN', 'EDITOR', 'VIEWER'],
        default: 'VIEWER'
    },
    created: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
