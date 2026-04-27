import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';

const signToken = (id: unknown, role: string): string =>
  jwt.sign({ id, role }, process.env['JWT_SECRET']!, {
    expiresIn: (process.env['JWT_EXPIRES_IN'] || '8h') as jwt.SignOptions['expiresIn']
  });

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body as { username?: string; password?: string };
    if (!username || !password) {
      res.status(400).json({ message: 'Username and password required' });
      return;
    }

    const user = await User.findOne({ username })
      .populate('barangay')
      .populate('municipality')
      .populate('province');

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ message: 'Account is deactivated. Contact your administrator.' });
      return;
    }

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

export const logout = (_req: Request, res: Response): void => {
  res.json({ message: 'Logged out successfully' });
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body as { currentPassword?: string; newPassword?: string };
    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Both current and new password required' });
      return;
    }

    const user = await User.findById(req.user!._id);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters' });
      return;
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

export const getMe = (req: Request, res: Response): void => {
  const u = req.user!;
  res.json({
    user: {
      id: u._id,
      username: u.username,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      scopeLabel: u.scopeLabel,
      barangay: u.barangay,
      municipality: u.municipality,
      province: u.province,
      isActive: u.isActive,
      lastLogin: u.lastLogin
    }
  });
};
