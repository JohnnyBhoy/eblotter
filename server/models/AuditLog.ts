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

const auditLogSchema = new mongoose.Schema<IAuditLogDocument>({
  action: String,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetBlotter: { type: mongoose.Schema.Types.ObjectId, ref: 'Blotter' },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  details: String,
  ipAddress: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IAuditLogDocument>('AuditLog', auditLogSchema);
