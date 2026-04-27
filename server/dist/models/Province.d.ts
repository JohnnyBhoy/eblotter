import mongoose, { type Document } from 'mongoose';
export interface IProvinceDocument extends Document {
    psgcCode: string;
    name: string;
    regionCode?: string;
    regionName?: string;
    isActive: boolean;
    createdAt: Date;
}
declare const _default: mongoose.Model<IProvinceDocument, {}, {}, {}, mongoose.Document<unknown, {}, IProvinceDocument, {}, {}> & IProvinceDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
