import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const modelColors = {
    'MODEL Y': '#ff7300',
    'MODEL S': '#0088fe',
    'MODEL 3': '#00c49f',
    'MODEL X': '#ffbb28',
    'LEAF': '#8884d8',
    'BOLT EV': '#82ca9d',
    'NIRO': '#8dd1e1',
    'IONIQ 5': '#a4de6c',
    'MUSTANG MACH-E': '#d0ed57',
    'ID.4': '#ffc658',
    'TAYCAN': '#ff6b6b',
    'KONA ELECTRIC': '#da77f2',
    'EV6': '#748ffc',
    'PRIUS PRIME': '#9775fa',
    'RAV4 PRIME': '#f783ac',
    'IONIQ 6': '#63e6be',
    'I3': '#a9e34b',
    'ARIYA': '#4dabf7',
    'BZ4X': '#ff8787',
    'BOLT EUV': '#3bc9db'
};

export default function BubbleChart({ data }) {
    const [chartData, setChartData] = useState([]);
    const [topModels, setTopModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('All');

    useEffect(() => {
        if (!data || data.length === 0) return;

        // Filter out entries with Electric Range of 0
        const validData = data.filter(item =>
            item["Electric Range"] &&
            Number(item["Electric Range"]) > 0
        );

        // Calculate average range and count by model
        const modelStats = {};
        validData.forEach(item => {
            const model = item.Model;
            if (!modelStats[model]) {
                modelStats[model] = {
                    model,
                    totalRange: 0,
                    count: 0,
                    values: []
                };
            }
            const range = Number(item["Electric Range"]);
            modelStats[model].totalRange += range;
            modelStats[model].count += 1;
            modelStats[model].values.push(range);
        });

        // Calculate average and prepare chart data
        const processedData = Object.values(modelStats).map(stat => {
            const avg = stat.totalRange / stat.count;
            return {
                model: stat.model,
                averageRange: Math.round(avg * 10) / 10,
                count: stat.count,
                stdDev: calculateStdDev(stat.values, avg)
            };
        });

        // Sort by count to get the most common models
        const sortedByCount = [...processedData].sort((a, b) => b.count - a.count);
        const top20Models = sortedByCount.slice(0, 20).map(item => item.model);
        setTopModels(top20Models);

        // Sort by average range for the chart
        const sortedData = processedData.sort((a, b) => b.averageRange - a.averageRange);
        setChartData(sortedData);

    }, [data]);

    const calculateStdDev = (values, mean) => {
        if (values.length <= 1) return 0;
        const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
        return Math.sqrt(variance);
    };

    const filteredData = selectedModel === 'All'
        ? chartData.filter(item => topModels.includes(item.model))
        : chartData.filter(item => item.model === selectedModel);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 rounded shadow border">
                    <p className="font-bold">{data.model}</p>
                    <p>Average Range: {data.averageRange} miles</p>
                    <p>Vehicle Count: {data.count}</p>
                    <p>Std Deviation: {data.stdDev.toFixed(2)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full p-4">
            <h2 className="text-xl font-bold mb-4">Average Electric Range by Model</h2>
            <div className="mb-4">
                <label className="mr-2 font-medium">Select Model:</label>
                <select
                    className="p-2 border rounded bg-green-300"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                >
                    <option value="All">All Top Models</option>
                    {topModels.map(model => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                </select>
            </div>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="category"
                            dataKey="model"
                            name="Model"
                            allowDuplicatedCategory={false}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="averageRange"
                            name="Average Range"
                            unit=" miles"
                            domain={['auto', 'auto']}
                        />
                        <ZAxis
                            type="number"
                            dataKey="count"
                            range={[50, 500]}
                            name="Count"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {selectedModel === 'All' ? (
                            filteredData.map((entry) => (
                                <Scatter
                                    key={entry.model}
                                    name={entry.model}
                                    data={[entry]}
                                    fill={modelColors[entry.model] || `#${Math.floor(Math.random() * 16777215).toString(16)}`}
                                />
                            ))
                        ) : (
                            <Scatter
                                name={selectedModel}
                                data={filteredData}
                                fill={modelColors[selectedModel] || "#8884d8"}
                            />
                        )}
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-600">
                Bubble size represents the number of vehicles for each model
            </div>
        </div>
    );
}