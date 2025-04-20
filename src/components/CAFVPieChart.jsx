import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CAFVPieChart = ({ evData }) => {
  const counts = evData.reduce((acc, curr) => {
    const category = curr['Clean Alternative Fuel Vehicle (CAFV) Eligibility'];
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(counts),
    datasets: [
      {
        label: 'CAFV Eligibility',
        data: Object.values(counts),
        backgroundColor: ['#4ade80', '#facc15', '#60a5fa'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className=" p-4 rounded ">
      <h2 className="text-lg font-bold mb-2 text-center">CAFV Eligibility</h2>
      <div className="relative w-full h-[450px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default CAFVPieChart;
