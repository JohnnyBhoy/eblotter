import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.js';
import ConfirmModal from '../../components/common/ConfirmModal.js';
import { formatDate } from '../../utils/formatters.js';
import api from '../../utils/api.js';
import axios from 'axios';
import type { User, UserRole } from '../../types/index.js';

const ROLE_STYLES: Record<string, React.CSSProperties> = {
  barangay: { background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', color: '#93c5fd' },
  municipal: { background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#c4b5fd' },
  provincial: { background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', color: '#fdba74' },
  super_admin: { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' },
};

interface UserListData {
  users: User[];
  total: number;
  totalPages: number;
}

interface Filters {
  page: number;
  limit: number;
  search: string;
  role: string;
  isActive: string;
}

interface ConfirmState {
  type: 'toggle' | 'delete';
  user: User;
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  color: '#cbd5e1',
  fontSize: 13,
  padding: '7px 12px',
  outline: 'none',
};

export default function AccountManagement() {
  const [data, setData] = useState<UserListData>({ users: [], total: 0, totalPages: 1 });
  const [filters, setFilters] = useState<Filters>({ page: 1, limit: 20, search: '', role: '', isActive: '' });
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const load = useCallback((params: Filters) => {
    setLoading(true);
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ''));
    api.get<UserListData>('/users', { params: clean }).then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(filters); }, []);

  function handleFilter(key: keyof Filters, value: string | number) {
    const next = { ...filters, [key]: value, page: 1 };
    setFilters(next);
    load(next);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load(filters);
  }

  async function toggleActive(user: User) {
    try {
      await api.patch(`/users/${user.id}/toggle`);
      load(filters);
    } catch (err) {
      alert(axios.isAxiosError(err) ? (err.response?.data as { message?: string })?.message ?? 'Failed to toggle account' : 'Failed to toggle account');
    }
    setConfirm(null);
  }

  async function deleteUser(user: User) {
    try {
      await api.delete(`/users/${user.id}`);
      load(filters);
    } catch (err) {
      alert(axios.isAxiosError(err) ? (err.response?.data as { message?: string })?.message ?? 'Failed to delete account' : 'Failed to delete account');
    }
    setConfirm(null);
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Account Management</h1>
          <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Manage all system user accounts</p>
        </div>
        <Link
          to="/superadmin/accounts/add"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow: '0 4px 20px rgba(37,99,235,0.4)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Account
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-2xl p-4 mb-4 flex flex-wrap gap-2 items-end" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-48">
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="Search name, username, email..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'rgba(37,99,235,0.8)', border: '1px solid rgba(59,130,246,0.4)' }}
          >
            Search
          </button>
        </form>
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={filters.role} onChange={e => handleFilter('role', e.target.value)}>
          <option value="" style={{ background: '#0a1628' }}>All Roles</option>
          <option value="barangay" style={{ background: '#0a1628' }}>Barangay</option>
          <option value="municipal" style={{ background: '#0a1628' }}>Municipal</option>
          <option value="provincial" style={{ background: '#0a1628' }}>Provincial</option>
          <option value="super_admin" style={{ background: '#0a1628' }}>Super Admin</option>
        </select>
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={filters.isActive} onChange={e => handleFilter('isActive', e.target.value)}>
          <option value="" style={{ background: '#0a1628' }}>All Status</option>
          <option value="true" style={{ background: '#0a1628' }}>Active</option>
          <option value="false" style={{ background: '#0a1628' }}>Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['Full Name', 'Username', 'Role', 'Scope', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#475569' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm" style={{ color: '#334155' }}>No accounts found.</td>
                </tr>
              ) : data.users.map((u, idx) => (
                <tr
                  key={u.id}
                  style={{
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'; }}
                >
                  <td className="px-4 py-3 font-semibold text-white text-xs">{u.fullName}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#64748b' }}>@{u.username}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={ROLE_STYLES[u.role] || { background: 'rgba(100,116,139,0.12)', color: '#94a3b8' }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#475569' }}>{u.scopeLabel || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={u.isActive
                        ? { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7' }
                        : { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }
                      }
                    >
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#64748b' }}>{formatDate(u.createdAt ?? null)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setConfirm({ type: 'toggle', user: u })}
                        className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-all"
                        style={u.isActive
                          ? { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }
                          : { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7' }
                        }
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => setConfirm({ type: 'delete', user: u })}
                        className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-all"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs" style={{ color: '#475569' }}>Page {filters.page} of {data.totalPages} ({data.total} total)</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => handleFilter('page', filters.page - 1)}
              disabled={filters.page <= 1}
              className="px-3 py-1.5 text-xs rounded-lg disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
            >
              ‹ Prev
            </button>
            <button
              onClick={() => handleFilter('page', filters.page + 1)}
              disabled={filters.page >= data.totalPages}
              className="px-3 py-1.5 text-xs rounded-lg disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
            >
              Next ›
            </button>
          </div>
        </div>
      )}

      {confirm?.type === 'toggle' && (
        <ConfirmModal
          message={`Are you sure you want to ${confirm.user.isActive ? 'deactivate' : 'activate'} account @${confirm.user.username}?`}
          onConfirm={() => toggleActive(confirm.user)}
          onCancel={() => setConfirm(null)}
          confirmLabel={confirm.user.isActive ? 'Deactivate' : 'Activate'}
          danger={confirm.user.isActive}
        />
      )}
      {confirm?.type === 'delete' && (
        <ConfirmModal
          message={`Permanently delete account @${confirm.user.username}? This cannot be undone.`}
          onConfirm={() => deleteUser(confirm.user)}
          onCancel={() => setConfirm(null)}
          confirmLabel="Delete"
          danger
        />
      )}
    </PageLayout>
  );
}
