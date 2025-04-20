
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const DonutChart2 = ({ data }) => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Colors for the donut chart
    const COLORS = ['#3B82F6', '#10B981'];

    useEffect(() => {
        if (data && data.length > 0) {
            // Filter for only CAFV eligible vehicles
            const eligibleVehicles = data.filter(
                vehicle => vehicle["Clean Alternative Fuel Vehicle (CAFV) Eligibility"] === 'Clean Alternative Fuel Vehicle Eligible'
            );

            // Group by Electric Vehicle Type
            const vehicleTypes = {};
            eligibleVehicles.forEach(vehicle => {
                const type = vehicle["Electric Vehicle Type"];
                if (type && (type.includes('BEV') || type.includes('PHEV'))) {
                    vehicleTypes[type] = (vehicleTypes[type] || 0) + 1;
                }
            });

            // Format data for the chart
            const formattedData = Object.keys(vehicleTypes).map(type => ({
                name: type,
                value: vehicleTypes[type]
            }));

            setChartData(formattedData);
            setLoading(false);
        }
    }, [data]);

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const total = chartData.reduce((sum, entry) => sum + entry.value, 0);
            return (
                <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
                    <p className="font-bold">{payload[0].name}</p>
                    <p className="text-gray-700">Count: {payload[0].value}</p>
                    <p className="text-gray-700">
                        Percentage: {((payload[0].value / total) * 100).toFixed(1)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom label that handles long text by using smaller font and line breaks
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        // Abbreviate the labels
        let displayName = name;
        if (name.includes('PHEV')) {
            displayName = 'PHEV';
        } else if (name.includes('BEV')) {
            displayName = 'BEV';
        }

        return (
            <text
                x={x}
                y={y}
                fill={COLORS[index % COLORS.length]}
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={12}
                fontWeight="bold"
            >
                {`${displayName}: ${(percent * 100).toFixed(1)}%`}
            </text>
        );
    };

    if (loading || chartData.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 min-h-64 flex items-center justify-center">
                <p className="text-gray-500">Loading data or no eligible vehicles found...</p>
            </div>
        );
    }

    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="bg-white rounded-lg p-6 mt-10">
            <h2 className="text-xl font-bold text-center mb-4">CAFV-Eligible Vehicles: BEV vs PHEV</h2>
            <p className="text-center text-gray-600 mb-6">
                Total eligible vehicles: {total}
            </p>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            labelLine={false}
                            label={renderCustomizedLabel}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => {
                                if (value === "Battery Electric Vehicle (BEV)") {
                                    return <span style={{ fontSize: '0.9rem' }}>Battery Electric Vehicle (BEV)</span>;
                                }
                                if (value === "Plug-in Hybrid Electric Vehicle (PHEV)") {
                                    return <span style={{ fontSize: '0.9rem' }}>Plug-in Hybrid Electric Vehicle (PHEV)</span>;
                                }
                                return value;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {chartData.map((item, index) => (
                    <div key={index} className="p-3 rounded-lg flex items-center" style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}>
                        <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-700">
                                {item.value} vehicles ({((item.value / total) * 100).toFixed(1)}%)
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DonutChart2;