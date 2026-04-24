import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout.jsx';
import StatsCard from '../../components/reports/StatsCard.jsx';
import IncidentTypeChart from '../../components/reports/IncidentTypeChart.jsx';
import MonthlyTrendChart from '../../components/reports/MonthlyTrendChart.jsx';
import BlotterTable from '../../components/reports/BlotterTable.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../utils/api.js';

export default function MunicipalDashboard() {
  const [stats, setStats] = useState(null);
  const [blotterData, setBlotterData] = useState({ blotters: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/blotters/stats').then(r => r.data),
      api.get('/blotters', { params: { limit: 20 } }).then(r => r.data)
    ]).then(([statsData, blotters]) => {
      setStats(statsData);
      setBlotterData(blotters);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLayout><div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full animate-spin"></div></div></PageLayout>;

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-[#003366] mb-6">Municipal Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard label="Total Blotters" value={stats?.total} icon="📋" color="bg-[#003366]" />
        <StatsCard label="This Month" value={stats?.thisMonth} icon="📅" color="bg-blue-600" />
        <StatsCard label="Referred to PNP" value={stats?.referred} icon="🚔" color="bg-orange-500" />
        <StatsCard label="Settled / Closed" value={stats?.settled} icon="✅" color="bg-green-600" />
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

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-800">Blotter Records</h2>
          <Link to="/municipal/blotters" className="text-sm text-[#003366] hover:underline">View All →</Link>
        </div>
        <BlotterTable
          blotters={blotterData.blotters}
          total={blotterData.total}
          page={blotterData.page}
          totalPages={blotterData.totalPages}
          viewPath="/municipal/blotters"
          readOnly
        />
      </div>
    </PageLayout>
  );
}
