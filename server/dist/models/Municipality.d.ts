import mongoose, { type Document } from 'mongoose';
export interface IMunicipalityDocument extends Document {
    psgcCode: string;
    name: string;
    province: mongoose.Types.ObjectId | Record<string, unknown>;
    provinceCode?: string;
    isActive: boolean;
    createdAt: Date;
}
declare const _default: mongoose.Model<IMunicipalityDocument, {}, {}, {}, mongoose.Document<unknown, {}, IMunicipalityDocument, {}, {}> & IMunicipalityDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
