import mongoose from 'mongoose';

const provinceSchema = new mongoose.Schema({
  psgcCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  regionCode: String,
  regionName: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Province', provinceSchema);
