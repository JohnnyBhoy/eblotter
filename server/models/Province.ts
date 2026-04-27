import mongoose, { type Document } from 'mongoose';

export interface IProvinceDocument extends Document {
  psgcCode: string;
  name: string;
  regionCode?: string;
  regionName?: string;
  isActive: boolean;
  createdAt: Date;
}

const provinceSchema = new mongoose.Schema<IProvinceDocument>({
  psgcCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  regionCode: String,
  regionName: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProvinceDocument>('Province', provinceSchema);
