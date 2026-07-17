import React from 'react';
import { ResponsiveContainer, BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

export const BarChart = ({ data, dataKey, xKey, height = 300, color = "#059669" }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsBar data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey={xKey} 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: 'none', 
              borderRadius: '12px',
              color: '#fff',
              fontSize: '11px',
              fontFamily: 'sans-serif'
            }} 
          />
          <Bar dataKey={dataKey} radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={color} opacity={0.85 + (index % 2 ? 0.15 : 0)} />
            ))}
          </Bar>
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  );
};
export default BarChart;
