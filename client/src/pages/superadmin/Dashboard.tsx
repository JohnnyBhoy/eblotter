import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.js';
import StatsCard from '../../components/reports/StatsCard.js';
import IncidentTypeChart from '../../components/reports/IncidentTypeChart.js';
import MonthlyTrendChart from '../../components/reports/MonthlyTrendChart.js';
import StatusBadge from '../../components/common/StatusBadge.js';
import api from '../../utils/api.js';
import type { DashboardStats, Blotter, User } from '../../types/index.js';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [blotters, setBlotters] = useState<Blotter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<DashboardStats>('/blotters/stats').then(r => r.data).catch(() => null),
      api.get<{ users: User[] }>('/users', { params: { limit: 10, page: 1 } }).then(r => r.data).catch(() => ({ users: [] })),
      api.get<{ blotters: Blotter[] }>('/blotters', { params: { limit: 10 } }).then(r => r.data).catch(() => ({ blotters: [] })),
    ]).then(([statsData, usersData, blotterData]) => {
      setStats(statsData);
      setUsers(usersData.users || []);
      setBlotters(blotterData.blotters || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLayout><div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full animate-spin"></div></div></PageLayout>;

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-[#003366] mb-6">System Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard label="Total Blotters" value={stats?.total} icon="📋" />
        <StatsCard label="This Month" value={stats?.thisMonth} icon="📅" color="bg-blue-600" />
        <StatsCard label="Under Mediation" value={stats?.pending} icon="⚖️" color="bg-yellow-500" />
        <StatsCard label="Referred to PNP" value={stats?.referred} icon="🚔" color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-3">Incidents by Type</h2>
          <IncidentTypeChart data={stats?.typeBreakdown || []} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-3">Monthly Trend</h2>
          <MonthlyTrendChart data={stats?.monthlyTrend || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-800">Recent Accounts</h2>
            <Link to="/superadmin/accounts" className="text-sm text-[#003366] hover:underline">View All →</Link>
          </div>
          <div className="space-y-2">
            {users.length === 0 && <p className="text-sm text-gray-400">No accounts yet.</p>}
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-800">{u.fullName}</div>
                  <div className="text-xs text-gray-500">@{u.username} — {u.role}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {u.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-800">Recent Blotters</h2>
            <Link to="/superadmin/blotters" className="text-sm text-[#003366] hover:underline">View All →</Link>
          </div>
          <div className="space-y-2">
            {blotters.length === 0 && <p className="text-sm text-gray-400">No blotters yet.</p>}
            {blotters.map(b => (
              <div key={b._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <div className="text-sm font-medium text-[#003366]">{b.blotterNumber}</div>
                  <div className="text-xs text-gray-500">{b.incident?.type} — {b.barangay?.name}</div>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
