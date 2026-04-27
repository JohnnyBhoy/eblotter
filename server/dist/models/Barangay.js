import mongoose from 'mongoose';
const barangaySchema = new mongoose.Schema({
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
export default mongoose.model('Barangay', barangaySchema);
//# sourceMappingURL=Barangay.js.map