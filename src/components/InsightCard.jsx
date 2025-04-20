import React from 'react';

const InsightCard = ({ evData }) => {
  const totalRecords = evData.length;
  const evTypes = [...new Set(evData.map(d => d['Electric Vehicle Type']))];
  const bevCount = evData.filter(d => d['Electric Vehicle Type'] === 'Battery Electric Vehicle (BEV)').length;
  const phevCount = evData.filter(d => d['Electric Vehicle Type'] === 'Plug-in Hybrid Electric Vehicle (PHEV)').length;

  const electricRanges = evData
    .map(d => parseFloat(d['Electric Range']))
    .filter(range => !isNaN(range));
  const avgRange = electricRanges.length > 0
    ? (electricRanges.reduce((a, b) => a + b, 0) / electricRanges.length).toFixed(2)
    : 'N/A';

  return (
    <div className="w-full px-6 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-60">
        {/* Card 1 */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center h-[150px] w-[230px]">
          <h3 className="text-gray-800 text-lg font-medium">Total Records</h3>
          <p className="text-green-700 text-2xl font-bold">{totalRecords}</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center h-[150px] w-[230px] text-center">
          <h3 className="text-gray-800 text-lg font-medium">EV Types</h3>
          <div className="text-green-700 mt-2">
            {evTypes.map((type, i) => (
              <p key={i} className="font-semibold">{type}</p>
            ))}
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center h-[150px] w-[230px]">
          <h3 className="text-gray-800 text-lg font-medium">Total BEVs</h3>
          <p className="text-green-700 text-2xl font-bold">{bevCount}</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center h-[150px] w-[230px] ">
          <h3 className="text-gray-800 text-lg font-medium">Total PHEVs</h3>
          <p className="text-green-700 text-2xl font-bold">{phevCount}</p>
        </div>

        {/* Card 5 */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center h-[150px] w-[230px]">
          <h3 className="text-gray-800 text-lg font-medium text-center">Avg Electric Range</h3>
          <p className="text-green-700 text-2xl font-bold">{avgRange} mi</p>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
