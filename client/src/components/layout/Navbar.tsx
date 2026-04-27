import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api.js';
import axios from 'axios';

const ROLE_LABELS: Record<string, string> = {
  barangay: 'Barangay',
  municipal: 'Municipal',
  provincial: 'Provincial',
  super_admin: 'Super Admin',
};

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess('Password changed successfully!');
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? (err.response?.data as { message?: string })?.message ?? 'Failed to change password'
          : 'Failed to change password'
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#003366]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <h2 className="text-lg font-bold text-[#003366] mb-5">Change Password</h2>
        {success ? (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">{success}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Current Password</label>
              <input
                type="password"
                className={inputClass}
                value={form.currentPassword}
                onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">New Password</label>
              <input
                type="password"
                className={inputClass}
                value={form.newPassword}
                onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm New Password</label>
              <input
                type="password"
                className={inputClass}
                value={form.confirmPassword}
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                required
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 bg-[#003366] text-white rounded-lg text-sm font-semibold hover:bg-[#002147] transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <>
      <header className="bg-[#003366] text-white px-4 py-3 flex items-center justify-between shadow-md z-10 relative">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <span className="font-bold text-lg tracking-wide" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Barangay e-Blotter System
          </span>
        </div>

        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1.5 transition"
            >
              <div className="w-8 h-8 rounded-full bg-[#FFD700] text-[#003366] flex items-center justify-center font-bold text-sm">
                {initials}
              </div>
              <div className="text-sm hidden sm:block text-left">
                <div className="font-semibold leading-tight">{user.fullName}</div>
                <div className="text-xs text-blue-200">{ROLE_LABELS[user.role] ?? user.role}</div>
              </div>
              <svg className="w-3.5 h-3.5 text-blue-200 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50">
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 truncate">{user.fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{user.scopeLabel ?? user.role}</p>
                </div>
                <button
                  onClick={() => { setDropdownOpen(false); setShowChangePassword(true); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                >
                  <span>🔑</span> Change Password
                </button>
                <div className="border-t border-gray-100 mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
    </>
  );
}
