import React, { useEffect, useState } from 'react';
import PageLayout from '../../components/layout/PageLayout.jsx';
import ExportBar from '../../components/reports/ExportBar.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../../utils/api.js';

const COLORS = ['#003366', '#FFD700', '#e02020', '#16a34a', '#7c3aed'];

export default function MunicipalBreakdown() {
  const [blotters, setBlotters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blotters', { params: { limit: 1000 } })
      .then(r => setBlotters(r.data.blotters || []))
      .finally(() => setLoading(false));
  }, []);

  const munData = {};
  blotters.forEach(b => {
    const name = b.municipality?.name || 'Unknown';
    if (!munData[name]) munData[name] = { name, total: 0, statuses: {} };
    munData[name].total++;
    const s = b.status || 'recorded';
    munData[name].statuses[s] = (munData[name].statuses[s] || 0) + 1;
  });
  const tableData = Object.values(munData).sort((a, b) => b.total - a.total);
  const chartData = tableData.map(m => ({ name: m.name, count: m.total }));

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#003366]">Municipal Breakdown</h1>
        <ExportBar summaryParams={{}} />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Blotters per Municipality</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" name="Blotters">
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#003366] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Municipality</th>
                  <th className="px-4 py-3 text-center">Total</th>
                  <th className="px-4 py-3 text-center">Draft</th>
                  <th className="px-4 py-3 text-center">Recorded</th>
                  <th className="px-4 py-3 text-center">Under Mediation</th>
                  <th className="px-4 py-3 text-center">Settled</th>
                  <th className="px-4 py-3 text-center">Referred PNP</th>
                  <th className="px-4 py-3 text-center">Closed</th>
                  <th className="px-4 py-3 text-center">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tableData.map((m, idx) => (
                  <tr key={m.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium text-[#003366]">{m.name}</td>
                    <td className="px-4 py-3 text-center font-bold">{m.total}</td>
                    <td className="px-4 py-3 text-center text-gray-500">{m.statuses.draft || 0}</td>
                    <td className="px-4 py-3 text-center text-blue-600">{m.statuses.recorded || 0}</td>
                    <td className="px-4 py-3 text-center text-yellow-600">{m.statuses.under_mediation || 0}</td>
                    <td className="px-4 py-3 text-center text-green-600">{m.statuses.settled || 0}</td>
                    <td className="px-4 py-3 text-center text-orange-600">{m.statuses.referred_to_pnp || 0}</td>
                    <td className="px-4 py-3 text-center text-slate-500">{m.statuses.closed || 0}</td>
                    <td className="px-4 py-3 text-center">{blotters.length > 0 ? `${((m.total / blotters.length) * 100).toFixed(1)}%` : '0%'}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-bold">
                  <td className="px-4 py-3 text-[#003366]">TOTAL</td>
                  <td className="px-4 py-3 text-center">{blotters.length}</td>
                  <td colSpan={7}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </PageLayout>
  );
}
