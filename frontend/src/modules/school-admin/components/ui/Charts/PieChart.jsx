import React from 'react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#4f46e5', '#f43f5e', '#eab308', '#10b981', '#a855f7'];

export const PieChart = ({ data, nameKey, valueKey, height = 300 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey={valueKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '12px'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};
