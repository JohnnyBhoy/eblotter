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
declare const _default: mongoose.Model<IBarangayDocument, {}, {}, {}, mongoose.Document<unknown, {}, IBarangayDocument, {}, {}> & IBarangayDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
