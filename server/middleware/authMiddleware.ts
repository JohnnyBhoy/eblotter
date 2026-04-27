import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';

interface JwtPayload {
  id: string;
  role: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  const token = authHeader.split(' ')[1]!;
  try {
    const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as JwtPayload;
    const user = await User.findById(decoded.id)
      .populate('barangay')
      .populate('municipality')
      .populate('province');
    if (!user) { res.status(401).json({ message: 'User not found' }); return; }
    if (!user.isActive) { res.status(403).json({ message: 'Account is deactivated' }); return; }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
