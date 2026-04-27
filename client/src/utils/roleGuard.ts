import type { UserRole, User } from '../types/index.js';

export const roleRedirect: Record<UserRole, string> = {
  barangay: '/barangay/dashboard',
  municipal: '/municipal/dashboard',
  provincial: '/province/dashboard',
  super_admin: '/superadmin/dashboard',
};

export function hasRole(user: User | null, role: UserRole | UserRole[]): boolean {
  if (!user) return false;
  if (Array.isArray(role)) return role.includes(user.role);
  return user.role === role;
}

export function getDashboardPath(role?: UserRole): string {
  if (!role) return '/login';
  return roleRedirect[role] || '/login';
}
