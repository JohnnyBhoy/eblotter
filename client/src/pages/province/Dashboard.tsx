import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.js';
import StatsCard from '../../components/reports/StatsCard.js';
import IncidentTypeChart from '../../components/reports/IncidentTypeChart.js';
import MonthlyTrendChart from '../../components/reports/MonthlyTrendChart.js';
import BlotterTable from '../../components/reports/BlotterTable.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../utils/api.js';
import type { DashboardStats, Blotter } from '../../types/index.js';

interface BlotterListData {
  blotters: Blotter[];
  total: number;
  page: number;
  totalPages: number;
}

interface MunChartEntry {
  name: string;
  count: number;
}

export default function ProvinceDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [blotterData, setBlotterData] = useState<BlotterListData>({ blotters: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<DashboardStats>('/blotters/stats').then(r => r.data),
      api.get<BlotterListData>('/blotters', { params: { limit: 20 } }).then(r => r.data)
    ]).then(([s, b]) => {
      setStats(s);
      setBlotterData(b);
    }).finally(() => setLoading(false));
  }, []);

  const munMap: Record<string, number> = {};
  (blotterData.blotters || []).forEach(b => {
    const name = b.municipality?.name || 'Unknown';
    munMap[name] = (munMap[name] || 0) + 1;
  });
  const munChartData: MunChartEntry[] = Object.entries(munMap).map(([name, count]) => ({ name, count }));

  if (loading) return <PageLayout><div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full animate-spin"></div></div></PageLayout>;

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-[#003366] mb-6">Provincial Dashboard — Antique</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard label="Total Province-Wide" value={stats?.total} icon="📋" />
        <StatsCard label="This Month" value={stats?.thisMonth} icon="📅" color="bg-blue-600" />
        <StatsCard label="Referred to PNP" value={stats?.referred} icon="🚔" color="bg-orange-500" />
        <StatsCard label="Settled / Closed" value={stats?.settled} icon="✅" color="bg-green-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-3">By Incident Type</h2>
          <IncidentTypeChart data={stats?.typeBreakdown || []} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 col-span-2">
          <h2 className="text-base font-semibold text-gray-800 mb-3">By Municipality</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={munChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#003366" name="Blotters" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-3">Monthly Trend</h2>
        <MonthlyTrendChart data={stats?.monthlyTrend || []} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-800">All Blotters</h2>
          <Link to="/province/blotters" className="text-sm text-[#003366] hover:underline">View All →</Link>
        </div>
        <BlotterTable
          blotters={blotterData.blotters}
          total={blotterData.total}
          page={blotterData.page}
          totalPages={blotterData.totalPages}
          viewPath="/province/blotters"
          readOnly
        />
      </div>
    </PageLayout>
  );
}
