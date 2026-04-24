import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.jsx';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import { formatDate } from '../../utils/formatters.js';
import api from '../../utils/api.js';

const ROLE_COLORS = {
  barangay: 'bg-blue-100 text-blue-700',
  municipal: 'bg-purple-100 text-purple-700',
  provincial: 'bg-orange-100 text-orange-700',
  super_admin: 'bg-red-100 text-red-700',
};

export default function AccountManagement() {
  const [data, setData] = useState({ users: [], total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ page: 1, limit: 20, search: '', role: '', isActive: '' });
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback((params) => {
    setLoading(true);
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ''));
    api.get('/users', { params: clean }).then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(filters); }, []);

  function handleFilter(key, value) {
    const next = { ...filters, [key]: value, page: 1 };
    setFilters(next);
    load(next);
  }

  function handleSearch(e) {
    e.preventDefault();
    load(filters);
  }

  async function toggleActive(user) {
    try {
      await api.patch(`/users/${user._id}/toggle`);
      load(filters);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle account');
    }
    setConfirm(null);
  }

  async function deleteUser(user) {
    try {
      await api.delete(`/users/${user._id}`);
      load(filters);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete account');
    }
    setConfirm(null);
  }

  const selectClass = 'border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none';

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#003366]">Account Management</h1>
        <Link to="/superadmin/accounts/add" className="bg-[#003366] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002147] transition">
          + Add Account
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3 items-end">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-48">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
            placeholder="Search name, username, email..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          />
          <button type="submit" className="px-3 py-1.5 bg-[#003366] text-white rounded-lg text-sm hover:bg-[#002147]">Search</button>
        </form>
        <select className={selectClass} value={filters.role} onChange={e => handleFilter('role', e.target.value)}>
          <option value="">All Roles</option>
          <option value="barangay">Barangay</option>
          <option value="municipal">Municipal</option>
          <option value="provincial">Provincial</option>
          <option value="super_admin">Super Admin</option>
        </select>
        <select className={selectClass} value={filters.isActive} onChange={e => handleFilter('isActive', e.target.value)}>
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-[#003366] text-white text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Full Name</th>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Scope</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.users.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No accounts found.</td></tr>
              ) : data.users.map((u, idx) => (
                <tr key={u._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium">{u.fullName}</td>
                  <td className="px-4 py-3 text-gray-500">@{u.username}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.scopeLabel || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirm({ type: 'toggle', user: u })}
                        className={`text-xs px-2 py-1 rounded ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => setConfirm({ type: 'delete', user: u })}
                        className="text-xs px-2 py-1 rounded bg-gray-50 text-red-600 hover:bg-red-50"
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
          <span className="text-sm text-gray-500">Page {filters.page} of {data.totalPages} ({data.total} total)</span>
          <div className="flex gap-1">
            <button onClick={() => handleFilter('page', filters.page - 1)} disabled={filters.page <= 1} className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40">‹ Prev</button>
            <button onClick={() => handleFilter('page', filters.page + 1)} disabled={filters.page >= data.totalPages} className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40">Next ›</button>
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
