import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import api from '../../utils/api.js';
import { getDashboardPath } from '../../utils/roleGuard.js';
import axios from 'axios';
import type { User } from '../../types/index.js';

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) => open ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) { setError('Username and password are required.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await api.post<{ token: string; user: User }>('/auth/login', { username, password });
      const { token, user } = res.data;
      await login(token);
      navigate(getDashboardPath(user.role), { replace: true });
    } catch (err) {
      setError(axios.isAxiosError(err) ? (err.response?.data as { message?: string })?.message ?? 'Invalid credentials.' : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#04091a', fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #e2e8f0 0%, #93c5fd 40%, #fff 50%, #93c5fd 60%, #e2e8f0 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .dot-grid {
          background-image: radial-gradient(rgba(99,179,237,0.12) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .input-field {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .input-field::placeholder { color: rgba(148,163,184,0.5); }
        .input-field:focus {
          outline: none;
          border-color: rgba(59,130,246,0.6);
          background: rgba(59,130,246,0.06);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12), 0 0 20px rgba(59,130,246,0.1);
        }
        .btn-primary {
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
          box-shadow: 0 8px 32px rgba(37,99,235,0.45);
          transition: all 0.25s ease;
        }
        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 12px 40px rgba(37,99,235,0.6);
          transform: translateY(-1px);
        }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .card-fade-in {
          opacity: 0;
          transform: translateY(24px) scale(0.98);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .card-fade-in.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      `}</style>

      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden px-14 py-12"
        style={{ background: 'linear-gradient(135deg, #040e2a 0%, #071230 50%, #060f28 100%)' }}>

        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-60" />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.2) 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', animation: 'float 11s ease-in-out infinite 3s' }} />

        {/* Decorative ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(59,130,246,0.07)', animation: 'spin-slow 30s linear infinite' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none"
          style={{ border: '1px dashed rgba(59,130,246,0.05)', animation: 'spin-slow 20s linear infinite reverse' }} />

        {/* Top brand */}
        <div className="relative flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white"
            style={{ boxShadow: '0 4px 20px rgba(37,99,235,0.5)' }}>
            <ShieldIcon />
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-tight">Barangay e-Blotter</p>
            <p className="text-slate-500 text-xs">NAPOLCOM Region VI</p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-8"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#93c5fd' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
            Province of Antique · PNP
          </div>
          <h2 className="text-4xl xl:text-5xl font-black leading-tight mb-5">
            <span className="shimmer-text">Unified</span>
            <br />
            <span className="text-white">Crime Record</span>
            <br />
            <span className="text-white">System</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            A joint initiative of NAPOLCOM VI &amp; PNP Antique — harmonizing barangay incident records across the province in real-time.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            {[{ n: '5', label: 'Municipalities' }, { n: '114+', label: 'Barangays' }, { n: 'FREE', label: 'For All Units' }].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black text-white">{s.n}</div>
                <div className="text-xs text-slate-600 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-slate-700 text-xs">SP Resolution No. 707-2024 · Province of Antique</p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <ShieldIcon />
          </div>
          <span className="font-bold text-white">Barangay e-Blotter</span>
        </div>

        <div
          className={`card-fade-in w-full max-w-sm ${mounted ? 'visible' : ''}`}
          style={{ transitionDelay: '100ms' }}
        >
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-white mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in with your assigned credentials</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Username</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <UserIcon />
                </div>
                <input
                  type="text"
                  className="input-field w-full rounded-xl pl-11 pr-4 py-3.5 text-sm"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoFocus
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <LockIcon />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field w-full rounded-xl pl-11 pr-12 py-3.5 text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Forgot password */}
          <div className="mt-5 text-center">
            <Link to="/forgot-password" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              Forgot your password?
            </Link>
          </div>

          {/* Security notice */}
          <div className="mt-8 flex items-start gap-3 px-4 py-3.5 rounded-xl"
            style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.12)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-blue-500 shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authorized personnel only. All access is monitored and logged per RA 10175.
            </p>
          </div>

          {/* Back to landing */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-slate-700 hover:text-slate-500 transition-colors inline-flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to homepage
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="absolute bottom-6 text-xs text-slate-800">
          &copy; 2024–2025 NAPOLCOM Region VI
        </p>
      </div>
    </div>
  );
}
