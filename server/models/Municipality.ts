import mongoose, { type Document } from 'mongoose';

export interface IMunicipalityDocument extends Document {
  psgcCode: string;
  name: string;
  province: mongoose.Types.ObjectId | Record<string, unknown>;
  provinceCode?: string;
  isActive: boolean;
  createdAt: Date;
}

const municipalitySchema = new mongoose.Schema<IMunicipalityDocument>({
  psgcCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  province: { type: mongoose.Schema.Types.ObjectId, ref: 'Province', required: true },
  provinceCode: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IMunicipalityDocument>('Municipality', municipalitySchema);
