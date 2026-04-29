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

const IconDoc = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-blue-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>;
const IconCalendar = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-violet-400"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>;
const IconCar = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-orange-400"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>;
const IconCheck = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-emerald-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

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

const CustomBarTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0a1628', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '10px', padding: '8px 14px' }}>
        <p style={{ color: '#64748b', fontSize: 11, marginBottom: 3 }}>{label}</p>
        <p style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>{payload[0].value} <span style={{ color: '#64748b', fontSize: 11, fontWeight: 400 }}>blotters</span></p>
      </div>
    );
  }
  return null;
};

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

  if (loading) return (
    <PageLayout>
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
          <span className="text-sm" style={{ color: '#475569' }}>Loading…</span>
        </div>
      </div>
    </PageLayout>
  );

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Provincial Dashboard — Antique</h1>
        <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Province-wide blotter activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard label="Total Province-Wide" value={stats?.total} icon={<IconDoc />} glowColor="rgba(59,130,246,0.15)" />
        <StatsCard label="This Month" value={stats?.thisMonth} icon={<IconCalendar />} glowColor="rgba(139,92,246,0.15)" />
        <StatsCard label="Referred to PNP" value={stats?.referred} icon={<IconCar />} glowColor="rgba(249,115,22,0.15)" />
        <StatsCard label="Settled / Closed" value={stats?.settled} icon={<IconCheck />} glowColor="rgba(16,185,129,0.15)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom,#3b82f6,#1d4ed8)' }} />
            <h2 className="text-sm font-semibold text-white">By Incident Type</h2>
          </div>
          <IncidentTypeChart data={stats?.typeBreakdown || []} />
        </div>
        <div className="rounded-2xl p-5 col-span-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom,#10b981,#059669)' }} />
            <h2 className="text-sm font-semibold text-white">By Municipality</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={munChartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="count" fill="#3b82f6" name="Blotters" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl p-5 mb-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom,#8b5cf6,#6d28d9)' }} />
          <h2 className="text-sm font-semibold text-white">Monthly Trend</h2>
        </div>
        <MonthlyTrendChart data={stats?.monthlyTrend || []} />
      </div>

      <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom,#f59e0b,#d97706)' }} />
            <h2 className="text-sm font-semibold text-white">All Blotters</h2>
          </div>
          <Link to="/province/blotters" className="text-xs font-semibold" style={{ color: '#3b82f6' }}>View All →</Link>
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
