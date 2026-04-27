import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
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
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});
userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};
export default mongoose.model('User', userSchema);
//# sourceMappingURL=User.js.map