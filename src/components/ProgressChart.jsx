import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const ProgressChart = ({ data, normMean }) => {
  const dataWithNorm = data.map(d => ({ ...d, norm: normMean }));

  return (
    <div style={{ width: '100%', height: 300, direction: 'rtl' }}>
      <ResponsiveContainer>
        <LineChart data={dataWithNorm}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={3} name="ציון הילד" />
          <Line type="monotone" dataKey="norm" stroke="#82ca9d" strokeDasharray="5 5" strokeWidth={2} name="נורמה" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
