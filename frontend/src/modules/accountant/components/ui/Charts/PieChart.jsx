import React from 'react';
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Tooltip, Legend } from 'recharts';

export const PieChart = ({ data, height = 300, colors = ["#7c3aed", "#8b5cf6", "#a78bfa", "#c084fc", "#d8b4fe"] }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsPie>
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
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}
          />
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  );
};
export default PieChart;
