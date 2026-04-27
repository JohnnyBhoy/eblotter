import React, { useEffect, useState } from 'react';
import PageLayout from '../../components/layout/PageLayout.js';
import StatsCard from '../../components/reports/StatsCard.js';
import IncidentTypeChart from '../../components/reports/IncidentTypeChart.js';
import MonthlyTrendChart from '../../components/reports/MonthlyTrendChart.js';
import ExportBar from '../../components/reports/ExportBar.js';
import api from '../../utils/api.js';
import type { DashboardStats } from '../../types/index.js';

export default function ProvinceReports() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<DashboardStats>('/blotters/stats').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#003366]">Provincial Reports</h1>
        <ExportBar summaryParams={{ dateFrom, dateTo }} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date From</label>
          <input type="date" className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date To</label>
          <input type="date" className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatsCard label="Province-Wide Total" value={stats?.total} icon="📋" />
            <StatsCard label="This Month" value={stats?.thisMonth} icon="📅" color="bg-blue-600" />
            <StatsCard label="Under Mediation" value={stats?.pending} icon="⚖️" color="bg-yellow-500" />
            <StatsCard label="Referred to PNP" value={stats?.referred} icon="🚔" color="bg-orange-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-base font-semibold text-gray-800 mb-3">By Incident Type</h2>
              <IncidentTypeChart data={stats?.typeBreakdown || []} />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-base font-semibold text-gray-800 mb-3">Monthly Trend</h2>
              <MonthlyTrendChart data={stats?.monthlyTrend || []} />
            </div>
          </div>
        </>
      )}
    </PageLayout>
  );
}
