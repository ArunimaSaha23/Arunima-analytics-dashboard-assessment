import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const MakeBarChart = ({ evData }) => {
  const makeCounts = evData.reduce((acc, curr) => {
    const make = curr.Make;
    acc[make] = (acc[make] || 0) + 1;
    return acc;
  }, {});

  const topMakes = Object.entries(makeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const data = {
    labels: topMakes.map(([make]) => make),
    datasets: [
      {
        label: 'Top 10 Makes',
        data: topMakes.map(([, count]) => count),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">Top EV Makes</h2>
      <Bar data={data} />
    </div>
  );
};

export default MakeBarChart;
