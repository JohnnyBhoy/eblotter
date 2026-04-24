import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#003366', '#FFD700', '#e02020', '#16a34a', '#7c3aed', '#ea580c', '#0891b2', '#db2777', '#65a30d', '#b45309'];

export default function IncidentTypeChart({ data = [] }) {
  const chartData = data.map(d => ({ name: d.type || 'Unknown', value: d.count }));
  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data available</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={false}>
          {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={(v) => [v, 'Count']} />
      </PieChart>
    </ResponsiveContainer>
  );
}
