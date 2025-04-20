import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

const ModelYearLineChart = ({ evData }) => {
  const yearCounts = evData.reduce((acc, curr) => {
    const year = curr['Model Year'];
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(yearCounts),
    datasets: [
      {
        label: 'EVs per Year',
        data: Object.values(yearCounts),
        fill: false,
        borderColor: 'green',
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">Model Year Trend</h2>
      <Line data={data} />
    </div>
  );
};

export default ModelYearLineChart;
