import mongoose, { type Document, type Model } from 'mongoose';
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
interface IUserModel extends Model<IUserDocument> {
}
declare const _default: IUserModel;
export default _default;
