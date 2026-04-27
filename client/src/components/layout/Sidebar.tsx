import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import type { UserRole } from '../../types/index.js';

interface NavItem { to: string; label: string; icon: string; }

const navItems: Record<UserRole, NavItem[]> = {
  barangay: [
    { to: '/barangay/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/barangay/blotters', label: 'My Blotters', icon: '📋' },
    { to: '/barangay/blotters/create', label: 'Create Blotter', icon: '➕' },
  ],
  municipal: [
    { to: '/municipal/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/municipal/blotters', label: 'Blotters', icon: '📋' },
    { to: '/municipal/reports', label: 'Reports', icon: '📊' },
  ],
  provincial: [
    { to: '/province/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/province/blotters', label: 'Blotters', icon: '📋' },
    { to: '/province/municipal-breakdown', label: 'Municipal Breakdown', icon: '🗺️' },
    { to: '/province/reports', label: 'Reports', icon: '📊' },
  ],
  super_admin: [
    { to: '/superadmin/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/superadmin/accounts', label: 'Accounts', icon: '👥' },
    { to: '/superadmin/barangays', label: 'Barangays', icon: '🏘️' },
    { to: '/superadmin/municipalities', label: 'Municipalities', icon: '🏙️' },
    { to: '/superadmin/provinces', label: 'Provinces', icon: '🗺️' },
    { to: '/superadmin/blotters', label: 'Blotters', icon: '📋' },
    { to: '/superadmin/reports', label: 'Reports', icon: '📊' },
    { to: '/superadmin/audit', label: 'Audit Log', icon: '🔍' },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const items = user?.role ? (navItems[user.role] ?? []) : [];

  return (
    <aside className={`bg-[#002147] text-white flex flex-col transition-all duration-200 ${collapsed ? 'w-14' : 'w-64'} min-h-0 flex-shrink-0`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        {!collapsed && (
          <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest">Navigation</span>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="text-white/60 hover:text-white ml-auto"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-[#FFD700]/20 text-[#FFD700] border-r-4 border-[#FFD700]'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            }
            title={collapsed ? item.label : undefined}
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      {!collapsed && user && (
        <div className="px-4 py-3 border-t border-white/10 text-xs text-blue-300">
          <div className="font-semibold text-white truncate">{user.fullName}</div>
          <div className="truncate">{user.scopeLabel ?? user.role}</div>
        </div>
      )}
    </aside>
  );
}
