import mongoose, { type Document, type Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserDocument extends Document {
  username: string;
  password: string;
  role: 'barangay' | 'municipal' | 'provincial' | 'super_admin';
  fullName?: string;
  email?: string;
  contactNumber?: string;
  barangay?: mongoose.Types.ObjectId | Record<string, unknown>;
  municipality?: mongoose.Types.ObjectId | Record<string, unknown>;
  province?: mongoose.Types.ObjectId | Record<string, unknown>;
  scopeLabel?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

interface IUserModel extends Model<IUserDocument> {}

const userSchema = new mongoose.Schema<IUserDocument, IUserModel>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['barangay', 'municipal', 'provincial', 'super_admin'],
    required: true
  },
  fullName: String,
  email: String,
  contactNumber: String,
  barangay: { type: mongoose.Schema.Types.ObjectId, ref: 'Barangay' },
  municipality: { type: mongoose.Schema.Types.ObjectId, ref: 'Municipality' },
  province: { type: mongoose.Schema.Types.ObjectId, ref: 'Province' },
  scopeLabel: String,
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password as string);
};

export default mongoose.model<IUserDocument, IUserModel>('User', userSchema);
