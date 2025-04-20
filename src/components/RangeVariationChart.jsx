import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RangeVariationChart({ data }) {
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

        // Calculate stats by model
        const modelStats = {};
        validData.forEach(item => {
            const model = item.Model;
            if (!modelStats[model]) {
                modelStats[model] = {
                    model,
                    ranges: [],
                    count: 0
                };
            }
            const range = Number(item["Electric Range"]);
            modelStats[model].ranges.push(range);
            modelStats[model].count += 1;
        });

        // Calculate average, std dev, and prepare chart data
        const processedData = Object.values(modelStats)
            .filter(stat => stat.count >= 5) // Only include models with at least 5 vehicles for meaningful std dev
            .map(stat => {
                const sum = stat.ranges.reduce((a, b) => a + b, 0);
                const avg = sum / stat.ranges.length;
                const variance = stat.ranges.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / stat.ranges.length;
                const stdDev = Math.sqrt(variance);

                return {
                    model: stat.model,
                    averageRange: Math.round(avg * 10) / 10,
                    stdDev: Math.round(stdDev * 100) / 100,
                    count: stat.count,
                    min: Math.min(...stat.ranges),
                    max: Math.max(...stat.ranges)
                };
            });

        // Sort by standard deviation (highest variation first)
        const sortedData = processedData.sort((a, b) => b.stdDev - a.stdDev);

        // Get top 20 models by count for dropdown
        const sortedByCount = [...processedData].sort((a, b) => b.count - a.count);
        const top20Models = sortedByCount.slice(0, 20).map(item => item.model);
        setTopModels(top20Models);

        setChartData(sortedData);
    }, [data]);

    const filteredData = selectedModel === 'All'
        ? chartData.slice(0, 20) // Show top 20 models with highest std dev
        : chartData.filter(item => item.model === selectedModel);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 rounded shadow border">
                    <p className="font-bold">{data.model}</p>
                    <p>Standard Deviation: {data.stdDev} miles</p>
                    <p>Average Range: {data.averageRange} miles</p>
                    <p>Range: {data.min} - {data.max} miles</p>
                    <p>Vehicle Count: {data.count}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full p-4">
            <h2 className="text-xl font-bold mb-4">Electric Range Variation by Model</h2>
            <div className="mb-4">
                <label className="mr-2 font-medium">Select Model:</label>
                <select
                    className="p-2 border rounded bg-green-200"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                >
                    <option value="All">Top 20 Models by Variation</option>
                    {topModels.map(model => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                </select>
            </div>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={filteredData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" label={{ value: 'Standard Deviation (miles)', position: 'insideBottom', offset: -5 }} />
                        <YAxis
                            dataKey="model"
                            type="category"
                            width={80}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                            dataKey="stdDev"
                            name="Range Variation (Std Dev)"
                            fill="#10B981"
                            radius={[0, 4, 4, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-600">
                Higher standard deviation indicates wider variation in electric range among vehicles of the same model
            </div>
        </div>
    );
}