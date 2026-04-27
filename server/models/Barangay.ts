import mongoose, { type Document } from 'mongoose';

export interface IBarangayDocument extends Document {
  psgcCode: string;
  name: string;
  municipality: mongoose.Types.ObjectId | Record<string, unknown>;
  municipalityCode?: string;
  province: mongoose.Types.ObjectId | Record<string, unknown>;
  punongBarangay?: string;
  barangaySecretary?: string;
  contactNumber?: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
}

const barangaySchema = new mongoose.Schema<IBarangayDocument>({
  psgcCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  municipality: { type: mongoose.Schema.Types.ObjectId, ref: 'Municipality', required: true },
  municipalityCode: String,
  province: { type: mongoose.Schema.Types.ObjectId, ref: 'Province', required: true },
  punongBarangay: String,
  barangaySecretary: String,
  contactNumber: String,
  address: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IBarangayDocument>('Barangay', barangaySchema);
