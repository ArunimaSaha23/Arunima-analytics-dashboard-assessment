import React from 'react';

const ModelTable = ({ evData }) => {
  const topModels = evData
    .reduce((acc, curr) => {
      const model = curr.Model;
      acc[model] = (acc[model] || 0) + 1;
      return acc;
    }, {});

  const rows = Object.entries(topModels)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="bg-white p-4 rounded shadow-md overflow-x-auto">
      <h2 className="text-lg font-bold mb-2">Top 10 Models</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="border px-2 py-1">Model</th>
            <th className="border px-2 py-1">Count</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([model, count]) => (
            <tr key={model}>
              <td className="border px-2 py-1">{model}</td>
              <td className="border px-2 py-1">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModelTable;
