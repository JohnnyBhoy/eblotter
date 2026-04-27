import mongoose, { type Document } from 'mongoose';
export interface IAuditLogDocument extends Document {
    action?: string;
    performedBy?: mongoose.Types.ObjectId;
    targetBlotter?: mongoose.Types.ObjectId;
    targetUser?: mongoose.Types.ObjectId;
    details?: string;
    ipAddress?: string;
    timestamp: Date;
}
declare const _default: mongoose.Model<IAuditLogDocument, {}, {}, {}, mongoose.Document<unknown, {}, IAuditLogDocument, {}, {}> & IAuditLogDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
