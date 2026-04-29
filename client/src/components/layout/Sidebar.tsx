import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import type { UserRole } from '../../types/index.js';

interface NavItem { to: string; label: string; icon: React.ReactNode; }

const IconGrid = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>;
const IconDoc = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>;
const IconPlus = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const IconChart = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;
const IconMap = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" /></svg>;
const IconUsers = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>;
const IconBuilding = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>;
const IconSearch = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
const IconShield = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>;
const IconChevron = ({ open }: { open: boolean }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3" style={{ transform: open ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;

const navItems: Record<UserRole, NavItem[]> = {
  barangay: [
    { to: '/barangay/dashboard', label: 'Dashboard', icon: <IconGrid /> },
    { to: '/barangay/blotters', label: 'My Blotters', icon: <IconDoc /> },
    { to: '/barangay/blotters/create', label: 'Create Blotter', icon: <IconPlus /> },
  ],
  municipal: [
    { to: '/municipal/dashboard', label: 'Dashboard', icon: <IconGrid /> },
    { to: '/municipal/blotters', label: 'Blotters', icon: <IconDoc /> },
    { to: '/municipal/reports', label: 'Reports', icon: <IconChart /> },
  ],
  provincial: [
    { to: '/province/dashboard', label: 'Dashboard', icon: <IconGrid /> },
    { to: '/province/blotters', label: 'Blotters', icon: <IconDoc /> },
    { to: '/province/municipal-breakdown', label: 'Municipal Breakdown', icon: <IconMap /> },
    { to: '/province/reports', label: 'Reports', icon: <IconChart /> },
  ],
  super_admin: [
    { to: '/superadmin/dashboard', label: 'Dashboard', icon: <IconGrid /> },
    { to: '/superadmin/accounts', label: 'Accounts', icon: <IconUsers /> },
    { to: '/superadmin/barangays', label: 'Barangays', icon: <IconBuilding /> },
    { to: '/superadmin/municipalities', label: 'Municipalities', icon: <IconMap /> },
    { to: '/superadmin/provinces', label: 'Provinces', icon: <IconMap /> },
    { to: '/superadmin/blotters', label: 'Blotters', icon: <IconDoc /> },
    { to: '/superadmin/reports', label: 'Reports', icon: <IconChart /> },
    { to: '/superadmin/audit', label: 'Audit Log', icon: <IconSearch /> },
  ],
};

const ROLE_LABELS: Record<UserRole, string> = {
  barangay: 'Barangay',
  municipal: 'Municipal',
  provincial: 'Provincial',
  super_admin: 'Super Admin',
};

export default function Sidebar() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const items = user?.role ? (navItems[user.role] ?? []) : [];

  return (
    <aside
      className="flex flex-col flex-shrink-0 transition-all duration-300 relative"
      style={{
        width: collapsed ? '64px' : '220px',
        background: 'linear-gradient(180deg, #060d24 0%, #04091a 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', minHeight: '64px' }}>
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0" style={{ boxShadow: '0 4px 16px rgba(37,99,235,0.4)' }}>
          <IconShield />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm leading-tight truncate">e-Blotter</p>
            <p className="text-slate-600 text-xs truncate">Antique · PNP</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {!collapsed && (
          <p className="text-slate-700 text-xs font-bold uppercase tracking-widest px-2 mb-2">Menu</p>
        )}
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-all duration-150 ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'rgba(59,130,246,0.12)',
              border: '1px solid rgba(59,130,246,0.2)',
              boxShadow: '0 0 16px rgba(59,130,246,0.08)',
            } : { border: '1px solid transparent' }}
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      {!collapsed && user && (
        <div className="px-4 py-3 border-t mx-2 mb-2 rounded-lg" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">
              {user.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '??'}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">{user.fullName}</p>
              <p className="text-slate-600 text-xs truncate">{ROLE_LABELS[user.role] ?? user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors z-10"
        style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)' }}
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        <IconChevron open={!collapsed} />
      </button>
    </aside>
  );
}
