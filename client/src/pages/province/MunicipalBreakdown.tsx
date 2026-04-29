import React, { useEffect, useState } from 'react';
import PageLayout from '../../components/layout/PageLayout.js';
import ExportBar from '../../components/reports/ExportBar.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../../utils/api.js';
import type { Blotter } from '../../types/index.js';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

interface MunData {
  name: string;
  total: number;
  statuses: Record<string, number>;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0a1628', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 10, padding: '8px 14px' }}>
      <div style={{ color: '#93c5fd', fontSize: 12, marginBottom: 2 }}>{label}</div>
      <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{payload[0].value} blotters</div>
    </div>
  );
}

export default function MunicipalBreakdown() {
  const [blotters, setBlotters] = useState<Blotter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ blotters: Blotter[] }>('/blotters', { params: { limit: 1000 } })
      .then(r => setBlotters(r.data.blotters || []))
      .finally(() => setLoading(false));
  }, []);

  const munDataMap: Record<string, MunData> = {};
  blotters.forEach(b => {
    const name = b.municipality?.name || 'Unknown';
    if (!munDataMap[name]) munDataMap[name] = { name, total: 0, statuses: {} };
    munDataMap[name].total++;
    const s = b.status || 'recorded';
    munDataMap[name].statuses[s] = (munDataMap[name].statuses[s] || 0) + 1;
  });
  const tableData = Object.values(munDataMap).sort((a, b) => b.total - a.total);
  const chartData = tableData.map(m => ({ name: m.name, count: m.total }));

  const thStyle: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#475569', whiteSpace: 'nowrap' };
  const thCenter: React.CSSProperties = { ...thStyle, textAlign: 'center' };

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Municipal Breakdown</h1>
        <ExportBar summaryParams={{}} />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin"></div></div>
      ) : (
        <>
          <div
            className="rounded-2xl p-5 mb-6"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom,#3b82f6,#8b5cf6)' }} />
              <h2 className="text-sm font-semibold text-white">Blotters per Municipality</h2>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="count" name="Blotters" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '12px 16px' }}>
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom,#3b82f6,#06b6d4)' }} />
                <span className="text-sm font-semibold text-white">Breakdown Table</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <tr>
                    <th style={thStyle}>Municipality</th>
                    <th style={thCenter}>Total</th>
                    <th style={thCenter}>Draft</th>
                    <th style={thCenter}>Recorded</th>
                    <th style={thCenter}>Under Mediation</th>
                    <th style={thCenter}>Settled</th>
                    <th style={thCenter}>Referred PNP</th>
                    <th style={thCenter}>Closed</th>
                    <th style={thCenter}>% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((m, idx) => (
                    <tr
                      key={m.name}
                      style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.06)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'; }}
                    >
                      <td className="px-4 py-3 font-medium" style={{ color: '#60a5fa' }}>{m.name}</td>
                      <td className="px-4 py-3 text-center font-bold text-white">{m.total}</td>
                      <td className="px-4 py-3 text-center" style={{ color: '#94a3b8' }}>{m.statuses['draft'] || 0}</td>
                      <td className="px-4 py-3 text-center" style={{ color: '#93c5fd' }}>{m.statuses['recorded'] || 0}</td>
                      <td className="px-4 py-3 text-center" style={{ color: '#fcd34d' }}>{m.statuses['under_mediation'] || 0}</td>
                      <td className="px-4 py-3 text-center" style={{ color: '#6ee7b7' }}>{m.statuses['settled'] || 0}</td>
                      <td className="px-4 py-3 text-center" style={{ color: '#fdba74' }}>{m.statuses['referred_to_pnp'] || 0}</td>
                      <td className="px-4 py-3 text-center" style={{ color: '#94a3b8' }}>{m.statuses['closed'] || 0}</td>
                      <td className="px-4 py-3 text-center" style={{ color: '#475569' }}>{blotters.length > 0 ? `${((m.total / blotters.length) * 100).toFixed(1)}%` : '0%'}</td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: '1px solid rgba(59,130,246,0.2)', background: 'rgba(59,130,246,0.06)' }}>
                    <td className="px-4 py-3 font-bold" style={{ color: '#60a5fa' }}>TOTAL</td>
                    <td className="px-4 py-3 text-center font-bold text-white">{blotters.length}</td>
                    <td colSpan={7}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </PageLayout>
  );
}
