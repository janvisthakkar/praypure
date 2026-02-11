import mongoose from 'mongoose';

const ScanSchemaMongoose = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ip: String,
  userAgent: String,
  country: String,
  city: String,
  region: String,
  latitude: Number,
  longitude: Number
});

const QRCodeSchemaMongoose = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['url', 'text', 'email', 'phone'], required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  scans: [ScanSchemaMongoose],
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

export default mongoose.models.QRCode || mongoose.model('QRCode', QRCodeSchemaMongoose);