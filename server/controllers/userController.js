import User from '../models/User.js';
import Barangay from '../models/Barangay.js';
import Municipality from '../models/Municipality.js';
import Province from '../models/Province.js';
import AuditLog from '../models/AuditLog.js';

export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search, isActive } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .populate('barangay', 'name')
      .populate('municipality', 'name')
      .populate('province', 'name')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({ users, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { username, password, role, fullName, email, contactNumber, barangayId, municipalityId, provinceId } = req.body;

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already taken' });

    let scopeLabel = '';
    let barangay, municipality, province;

    if (role === 'barangay' && barangayId) {
      barangay = await Barangay.findById(barangayId).populate('municipality').populate('province');
      if (!barangay) return res.status(400).json({ message: 'Barangay not found' });
      municipality = barangay.municipality;
      province = barangay.province;
      scopeLabel = `${barangay.name}, ${municipality?.name}, ${province?.name}`;
    } else if (role === 'municipal' && municipalityId) {
      municipality = await Municipality.findById(municipalityId).populate('province');
      if (!municipality) return res.status(400).json({ message: 'Municipality not found' });
      province = municipality.province;
      scopeLabel = `${municipality.name}, ${province?.name}`;
    } else if (role === 'provincial' && provinceId) {
      province = await Province.findById(provinceId);
      if (!province) return res.status(400).json({ message: 'Province not found' });
      scopeLabel = province.name;
    }

    const user = await User.create({
      username, password, role, fullName, email, contactNumber,
      barangay: barangay?._id,
      municipality: municipality?._id,
      province: province?._id,
      scopeLabel,
      createdBy: req.user._id
    });

    await AuditLog.create({
      action: 'CREATE_ACCOUNT',
      performedBy: req.user._id,
      targetUser: user._id,
      details: `Created ${role} account: ${username}`,
      ipAddress: req.ip
    });

    const result = await User.findById(user._id).select('-password')
      .populate('barangay', 'name').populate('municipality', 'name').populate('province', 'name');
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
      .populate('barangay').populate('municipality').populate('province');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { fullName, email, contactNumber, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (contactNumber) user.contactNumber = contactNumber;
    if (password) {
      if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
      user.password = password;
    }
    await user.save();

    await AuditLog.create({
      action: 'UPDATE_ACCOUNT',
      performedBy: req.user._id,
      targetUser: user._id,
      details: `Updated account: ${user.username}`,
      ipAddress: req.ip
    });

    const result = await User.findById(user._id).select('-password')
      .populate('barangay', 'name').populate('municipality', 'name').populate('province', 'name');
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const toggleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();

    await AuditLog.create({
      action: user.isActive ? 'ACTIVATE_ACCOUNT' : 'DEACTIVATE_ACCOUNT',
      performedBy: req.user._id,
      targetUser: user._id,
      details: `${user.isActive ? 'Activated' : 'Deactivated'} account: ${user.username}`,
      ipAddress: req.ip
    });

    res.json({ message: `Account ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await AuditLog.create({
      action: 'DELETE_ACCOUNT',
      performedBy: req.user._id,
      targetUser: req.params.id,
      details: `Deleted account: ${user.username}`,
      ipAddress: req.ip
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    next(err);
  }
};
