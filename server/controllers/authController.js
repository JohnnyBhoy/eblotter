import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password required' });

    const user = await User.findOne({ username })
      .populate('barangay')
      .populate('municipality')
      .populate('province');

    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid username or password' });

    if (!user.isActive)
      return res.status(403).json({ message: 'Account is deactivated. Contact your administrator.' });

    user.lastLogin = new Date();
    await user.save();

    const token = signToken(user._id, user.role);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        scopeLabel: user.scopeLabel,
        barangay: user.barangay,
        municipality: user.municipality,
        province: user.province,
        isActive: user.isActive,
        lastLogin: user.lastLogin
      }
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Both current and new password required' });

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ message: 'Current password is incorrect' });

    if (newPassword.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
      scopeLabel: req.user.scopeLabel,
      barangay: req.user.barangay,
      municipality: req.user.municipality,
      province: req.user.province,
      isActive: req.user.isActive,
      lastLogin: req.user.lastLogin
    }
  });
};
