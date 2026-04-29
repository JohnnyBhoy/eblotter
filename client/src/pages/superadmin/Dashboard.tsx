import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.js';
import StatsCard from '../../components/reports/StatsCard.js';
import IncidentTypeChart from '../../components/reports/IncidentTypeChart.js';
import MonthlyTrendChart from '../../components/reports/MonthlyTrendChart.js';
import StatusBadge from '../../components/common/StatusBadge.js';
import api from '../../utils/api.js';
import type { DashboardStats, Blotter, User } from '../../types/index.js';

const IconDoc = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-blue-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>;
const IconCalendar = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-violet-400"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>;
const IconScale = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-amber-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5 0c-.99.143-1.99.317-3 .52m3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" /></svg>;
const IconCar = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-orange-400"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>;

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

  if (loading) return (
    <PageLayout>
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
          <span className="text-sm" style={{ color: '#475569' }}>Loading dashboard…</span>
        </div>
      </div>
    </PageLayout>
  );

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">System Dashboard</h1>
        <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Real-time overview of the e-Blotter system</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          label="Total Blotters"
          value={stats?.total}
          icon={<IconDoc />}
          glowColor="rgba(59,130,246,0.15)"
        />
        <StatsCard
          label="This Month"
          value={stats?.thisMonth}
          icon={<IconCalendar />}
          glowColor="rgba(139,92,246,0.15)"
        />
        <StatsCard
          label="Under Mediation"
          value={stats?.pending}
          icon={<IconScale />}
          glowColor="rgba(245,158,11,0.15)"
        />
        <StatsCard
          label="Referred to PNP"
          value={stats?.referred}
          icon={<IconCar />}
          glowColor="rgba(249,115,22,0.15)"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom,#3b82f6,#1d4ed8)' }} />
            <h2 className="text-sm font-semibold text-white">Incidents by Type</h2>
          </div>
          <IncidentTypeChart data={stats?.typeBreakdown || []} />
        </div>
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom,#8b5cf6,#6d28d9)' }} />
            <h2 className="text-sm font-semibold text-white">Monthly Trend</h2>
          </div>
          <MonthlyTrendChart data={stats?.monthlyTrend || []} />
        </div>
      </div>

      {/* Recent lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Accounts */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom,#10b981,#059669)' }} />
              <h2 className="text-sm font-semibold text-white">Recent Accounts</h2>
            </div>
            <Link
              to="/superadmin/accounts"
              className="text-xs font-semibold transition-colors"
              style={{ color: '#3b82f6' }}
            >
              View All →
            </Link>
          </div>
          <div className="space-y-1">
            {users.length === 0 && (
              <p className="text-sm py-4 text-center" style={{ color: '#334155' }}>No accounts yet.</p>
            )}
            {users.map(u => (
              <div
                key={u.id}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors"
                style={{ border: '1px solid transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa' }}>
                    {u.fullName?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{u.fullName}</div>
                    <div className="text-xs" style={{ color: '#475569' }}>@{u.username} · {u.role}</div>
                  </div>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={u.isActive
                    ? { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7' }
                    : { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }
                  }
                >
                  {u.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blotters */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom,#f59e0b,#d97706)' }} />
              <h2 className="text-sm font-semibold text-white">Recent Blotters</h2>
            </div>
            <Link
              to="/superadmin/blotters"
              className="text-xs font-semibold transition-colors"
              style={{ color: '#3b82f6' }}
            >
              View All →
            </Link>
          </div>
          <div className="space-y-1">
            {blotters.length === 0 && (
              <p className="text-sm py-4 text-center" style={{ color: '#334155' }}>No blotters yet.</p>
            )}
            {blotters.map(b => (
              <div
                key={b._id}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors"
                style={{ border: '1px solid transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
              >
                <div>
                  <div className="text-xs font-semibold" style={{ color: '#60a5fa' }}>{b.blotterNumber}</div>
                  <div className="text-xs" style={{ color: '#475569' }}>{b.incident?.type} · {b.barangay?.name}</div>
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
