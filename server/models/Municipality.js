import mongoose from 'mongoose';

const municipalitySchema = new mongoose.Schema({
  psgcCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  province: { type: mongoose.Schema.Types.ObjectId, ref: 'Province', required: true },
  provinceCode: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Municipality', municipalitySchema);
