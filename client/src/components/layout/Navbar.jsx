import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const ROLE_LABELS = {
  barangay: 'Barangay',
  municipal: 'Municipal',
  provincial: 'Provincial',
  super_admin: 'Super Admin',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <header className="bg-[#003366] text-white px-4 py-3 flex items-center justify-between shadow-md z-10">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🛡️</span>
        <span className="font-bold text-lg tracking-wide" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
          Barangay e-Blotter System
        </span>
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FFD700] text-[#003366] flex items-center justify-center font-bold text-sm">
              {initials}
            </div>
            <div className="text-sm hidden sm:block">
              <div className="font-semibold leading-tight">{user.fullName}</div>
              <div className="text-xs text-blue-200">{ROLE_LABELS[user.role] || user.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
