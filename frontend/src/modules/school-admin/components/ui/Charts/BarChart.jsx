import React from 'react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const BarChart = ({ data, xKey, yKey, height = 300, barColor = '#4f46e5' }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
          <XAxis 
            dataKey={xKey} 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            dy={10} 
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            dx={-10} 
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '12px'
            }}
          />
          <Bar 
            dataKey={yKey} 
            fill={barColor} 
            radius={[4, 4, 0, 0]} 
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
