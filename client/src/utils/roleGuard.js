export const roleRedirect = {
  barangay: '/barangay/dashboard',
  municipal: '/municipal/dashboard',
  provincial: '/province/dashboard',
  super_admin: '/superadmin/dashboard',
};

export function hasRole(user, role) {
  if (!user) return false;
  if (Array.isArray(role)) return role.includes(user.role);
  return user.role === role;
}

export function getDashboardPath(role) {
  return roleRedirect[role] || '/login';
}
