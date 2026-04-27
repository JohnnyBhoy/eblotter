import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MonthlyTrendChartProps {
  data?: Array<{ year: number; month: number; count: number }>;
}

export default function MonthlyTrendChart({ data = [] }: MonthlyTrendChartProps) {
  const chartData = data.map(d => ({
    name: `${MONTH_NAMES[(d.month ?? 1) - 1]} ${d.year}`,
    count: d.count
  }));

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#003366" strokeWidth={2} dot={{ r: 4 }} name="Blotters" />
      </LineChart>
    </ResponsiveContainer>
  );
}
