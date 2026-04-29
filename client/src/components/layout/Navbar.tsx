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
    if (form.newPassword !== form.confirmPassword) { setError('New passwords do not match.'); return; }
    if (form.newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/change-password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSuccess('Password changed successfully!');
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(axios.isAxiosError(err) ? (err.response?.data as { message?: string })?.message ?? 'Failed to change password' : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-sm mx-4 rounded-2xl p-6" style={{ background: '#0a1628', border: '1px solid rgba(59,130,246,0.25)', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
        <h2 className="text-lg font-bold text-white mb-5">Change Password</h2>
        {success ? (
          <div className="p-3 rounded-xl text-sm text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#86efac' }}>{success}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>{error}</div>}
            {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map((field) => (
              <div key={field}>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#475569' }}>
                  {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
                </label>
                <input
                  type="password"
                  value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  required
                  autoFocus={field === 'currentPassword'}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            ))}
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors" style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', background: 'transparent' }}>Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow: '0 4px 20px rgba(37,99,235,0.4)' }}>
                {loading ? 'Saving…' : 'Save Password'}
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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleLogout() { logout(); navigate('/login'); }

  const initials = user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';

  return (
    <>
      <header className="flex items-center justify-between px-6 h-16 shrink-0 relative z-20"
        style={{ background: 'rgba(4,9,26,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Breadcrumb placeholder */}
        <div className="text-slate-600 text-xs font-medium tracking-wide uppercase hidden sm:block">
          Barangay e-Blotter System
        </div>

        {user && (
          <div className="relative ml-auto" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-white/5"
              style={{ border: '1px solid transparent' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-blue-300"
                style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}>
                {initials}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-white text-xs font-semibold leading-tight">{user.fullName}</p>
                <p className="text-slate-600 text-xs">{ROLE_LABELS[user.role] ?? user.role}</p>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-slate-600 hidden sm:block"
                style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl py-1 z-50 overflow-hidden"
                style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
                <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <p className="text-white text-sm font-semibold truncate">{user.fullName}</p>
                  <p className="text-slate-500 text-xs truncate mt-0.5">{user.scopeLabel ?? user.role}</p>
                </div>
                <button
                  onClick={() => { setDropdownOpen(false); setShowChangePassword(true); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                  Change Password
                </button>
                <div className="border-t my-1" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors"
                  style={{ color: '#f87171' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
    </>
  );
}
