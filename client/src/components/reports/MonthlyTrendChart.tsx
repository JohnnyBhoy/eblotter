import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MonthlyTrendChartProps {
  data?: Array<{ year: number; month: number; count: number }>;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
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

export default function MonthlyTrendChart({ data = [] }: MonthlyTrendChartProps) {
  const chartData = data.map(d => ({
    name: `${MONTH_NAMES[(d.month ?? 1) - 1]} ${d.year}`,
    count: d.count
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2" style={{ color: '#334155' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 opacity-40">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
        <span className="text-sm">No data available</span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#blueGradient)"
          dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#60a5fa', strokeWidth: 0 }}
          name="Blotters"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
