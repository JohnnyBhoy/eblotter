import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: String,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetBlotter: { type: mongoose.Schema.Types.ObjectId, ref: 'Blotter' },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  details: String,
  ipAddress: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('AuditLog', auditLogSchema);
