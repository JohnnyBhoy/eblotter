import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'];

interface IncidentTypeChartProps {
  data?: Array<{ type?: string; count: number }>;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { fill: string } }> }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 12px' }}>
        <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 2 }}>{payload[0].name}</p>
        <p style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{payload[0].value} <span style={{ color: '#64748b', fontSize: 11, fontWeight: 400 }}>cases</span></p>
      </div>
    );
  }
  return null;
};

export default function IncidentTypeChart({ data = [] }: IncidentTypeChartProps) {
  const chartData = data.map(d => ({ name: d.type ?? 'Unknown', value: d.count }));
  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2" style={{ color: '#334155' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 opacity-40">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
        <span className="text-sm">No data available</span>
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%" cy="50%"
          outerRadius={85}
          innerRadius={40}
          dataKey="value"
          strokeWidth={0}
        >
          {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span style={{ color: '#64748b', fontSize: 11 }}>{value}</span>}
          iconSize={8}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
