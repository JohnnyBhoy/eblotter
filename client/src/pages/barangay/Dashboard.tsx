import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.js';
import StatsCard from '../../components/reports/StatsCard.js';
import IncidentTypeChart from '../../components/reports/IncidentTypeChart.js';
import MonthlyTrendChart from '../../components/reports/MonthlyTrendChart.js';
import StatusBadge from '../../components/common/StatusBadge.js';
import { formatDate } from '../../utils/formatters.js';
import api from '../../utils/api.js';
import type { DashboardStats, Blotter } from '../../types/index.js';

export default function BarangayDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Blotter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<DashboardStats>('/blotters/stats').then(r => r.data),
      api.get<{ blotters: Blotter[] }>('/blotters', { params: { limit: 10 } }).then(r => r.data)
    ]).then(([statsData, blotterData]) => {
      setStats(statsData);
      setRecent(blotterData.blotters || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLayout><div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full animate-spin"></div></div></PageLayout>;

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#003366]">Barangay Dashboard</h1>
        <Link to="/barangay/blotters/create" className="bg-[#003366] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002147] transition">
          + Create New Blotter
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard label="Total Blotters" value={stats?.total} icon="📋" color="bg-[#003366]" />
        <StatsCard label="This Month" value={stats?.thisMonth} icon="📅" color="bg-blue-600" />
        <StatsCard label="Under Mediation" value={stats?.pending} icon="⚖️" color="bg-yellow-500" />
        <StatsCard label="Settled / Closed" value={stats?.settled} icon="✅" color="bg-green-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-3">Incidents by Type</h2>
          <IncidentTypeChart data={stats?.typeBreakdown || []} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-3">Monthly Trend (12 months)</h2>
          <MonthlyTrendChart data={stats?.monthlyTrend || []} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-800">Recent Blotters</h2>
          <Link to="/barangay/blotters" className="text-sm text-[#003366] hover:underline">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase">
                <th className="pb-2 text-left font-medium">Blotter No.</th>
                <th className="pb-2 text-left font-medium">Incident</th>
                <th className="pb-2 text-left font-medium">Complainant</th>
                <th className="pb-2 text-left font-medium">Date</th>
                <th className="pb-2 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recent.map(b => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="py-2 font-medium text-[#003366]">
                    <Link to={`/barangay/blotters/${b._id}`} className="hover:underline">{b.blotterNumber}</Link>
                  </td>
                  <td className="py-2 text-gray-700">{b.incident?.type}</td>
                  <td className="py-2 text-gray-600">
                    {b.complainant ? `${b.complainant.lastName}, ${b.complainant.firstName}` : 'N/A'}
                  </td>
                  <td className="py-2 text-gray-500 whitespace-nowrap">{formatDate(b.dateRecorded)}</td>
                  <td className="py-2"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-gray-400">No blotters yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}
