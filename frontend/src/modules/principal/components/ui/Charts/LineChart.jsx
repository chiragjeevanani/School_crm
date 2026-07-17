import React from 'react';
import { ResponsiveContainer, LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const LineChart = ({ data, dataKey, xKey, height = 300, color = "#059669" }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsLine data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 1, fill: '#fff' }}
            activeDot={{ r: 6 }}
          />
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  );
};
export default LineChart;
