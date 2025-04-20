import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';

export default function TopRangeModelsChart({ data }) {
    const [topModels, setTopModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('All');
    const [modelStats, setModelStats] = useState({
        cumulative: 0,
        average: 0,
        count: 0
    });

    useEffect(() => {
        if (!data || data.length === 0) return;

        // Filter out entries with Electric Range of 0
        const validData = data.filter(item =>
            item["Electric Range"] &&
            Number(item["Electric Range"]) > 0
        );

        // Calculate stats for all models
        const allModelStats = {};
        validData.forEach(item => {
            const model = item.Model;
            if (!allModelStats[model]) {
                allModelStats[model] = {
                    model,
                    ranges: [],
                    count: 0
                };
            }
            const range = Number(item["Electric Range"]);
            allModelStats[model].ranges.push(range);
            allModelStats[model].count += 1;
        });

        // Process stats for each model
        Object.values(allModelStats).forEach(stat => {
            stat.cumulative = stat.ranges.reduce((sum, range) => sum + range, 0);
            stat.average = stat.cumulative / stat.count;
            stat.min = Math.min(...stat.ranges);
            stat.max = Math.max(...stat.ranges);
        });

        // Get top 20 models by count for dropdown
        const sortedByCount = Object.values(allModelStats)
            .sort((a, b) => b.count - a.count)
            .slice(0, 20);

        setTopModels(sortedByCount.map(item => item.model));

    }, [data]);

    const getTopVehiclesForModel = (model) => {
        if (!data) return [];

        // Filter valid data
        const validData = data.filter(item =>
            item["Electric Range"] &&
            Number(item["Electric Range"]) > 0
        );

        // If 'All', show top 10 across all models
        if (model === 'All') {
            return validData
                .sort((a, b) => Number(b["Electric Range"]) - Number(a["Electric Range"]))
                .slice(0, 10)
                .map(vehicle => ({
                    model: vehicle.Model,
                    make: vehicle.Make,
                    year: vehicle["Model Year"],
                    range: Number(vehicle["Electric Range"])
                }));
        }

        // Otherwise, show top 10 for selected model
        return validData
            .filter(item => item.Model === model)
            .sort((a, b) => Number(b["Electric Range"]) - Number(a["Electric Range"]))
            .slice(0, 10)
            .map(vehicle => ({
                model: vehicle.Model,
                make: vehicle.Make,
                year: vehicle["Model Year"],
                range: Number(vehicle["Electric Range"])
            }));
    };

    const [topVehicles, setTopVehicles] = useState([]);

    useEffect(() => {
        const vehicles = getTopVehiclesForModel(selectedModel);
        setTopVehicles(vehicles);

        // Calculate cumulative and average for selected model
        if (selectedModel !== 'All' && data) {
            const validData = data.filter(item =>
                item.Model === selectedModel &&
                item["Electric Range"] &&
                Number(item["Electric Range"]) > 0
            );

            const ranges = validData.map(item => Number(item["Electric Range"]));
            const cumulative = ranges.reduce((sum, range) => sum + range, 0);
            const average = cumulative / ranges.length;
            const count = ranges.length;

            setModelStats({
                cumulative,
                average: Math.round(average * 10) / 10,
                count
            });
        } else {
            setModelStats({
                cumulative: 0,
                average: 0,
                count: 0
            });
        }
    }, [selectedModel, data]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 rounded shadow border">
                    <p className="font-bold">{data.make} {data.model}</p>
                    <p>Year: {data.year}</p>
                    <p>Range: {data.range} miles</p>
                    {selectedModel !== 'All' && (
                        <>
                            <p className="mt-2 pt-2 border-t">Model Statistics:</p>
                            <p>Average Range: {modelStats.average} miles</p>
                            <p>Cumulative Range: {modelStats.cumulative} miles</p>
                            <p>Vehicle Count: {modelStats.count}</p>
                        </>
                    )}
                </div>
            );
        }
        return null;
    };

    // Calculate running total for cumulative visualization
    const cumulativeData = [...topVehicles].map((vehicle, index, array) => {
        let cumulativeRange = 0;
        for (let i = 0; i <= index; i++) {
            cumulativeRange += array[i].range;
        }
        return {
            ...vehicle,
            cumulativeRange
        };
    });

    return (
        <div className="w-full h-full p-4">
            <h2 className="text-xl font-bold mb-4">Top 10 Vehicles by Electric Range</h2>
            <div className="mb-4">
                <label className="mr-2 font-medium">Select Model:</label>
                <select
                    className="p-2 border rounded bg-green-300"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                >
                    <option value="All">All Models</option>
                    {topModels.map(model => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                </select>
            </div>

            {selectedModel !== 'All' && (
                <div className="mb-4 p-4 bg-blue-50 rounded border border-blue-200">
                    <h3 className="font-bold text-lg mb-2">{selectedModel} Statistics</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded shadow">
                            <p className="text-sm text-gray-600">Average Range</p>
                            <p className="text-2xl font-bold">{modelStats.average} miles</p>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <p className="text-sm text-gray-600">Cumulative Range</p>
                            <p className="text-2xl font-bold">{modelStats.cumulative.toLocaleString()} miles</p>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <p className="text-sm text-gray-600">Vehicle Count</p>
                            <p className="text-2xl font-bold">{modelStats.count}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={cumulativeData}
                        margin={{ top: 25, right: 80, left: 20, bottom: 50 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="model"
                            label={{ value: 'Vehicle Model', position: 'insideBottom', offset: -10 }}
                            tick={props => {
                                const { x, y, payload } = props;
                                return (
                                    <g transform={`translate(${x},${y})`}>
                                        <text
                                            x={0}
                                            y={0}
                                            dy={16}
                                            textAnchor="middle"
                                            fill="#666"
                                            fontSize={12}
                                        >
                                            {payload.value}
                                        </text>
                                        {topVehicles.find(v => v.model === payload.value)?.make && (
                                            <text
                                                x={0}
                                                y={0}
                                                dy={32}
                                                textAnchor="middle"
                                                fill="#666"
                                                fontSize={10}
                                            >
                                                {topVehicles.find(v => v.model === payload.value).make}
                                            </text>
                                        )}
                                    </g>
                                );
                            }}
                            height={60}
                        />
                        <YAxis
                            yAxisId="left"
                            label={{ value: 'Range (miles)', angle: -90, position: 'insideLeft' }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            label={{
                                value: 'Cumulative Range (miles)',
                                angle: 90,
                                position: 'insideRight',
                                offset: 1,
                                style: { textAnchor: 'middle' }
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="top"
                            height={36} />
                        <Bar
                            yAxisId="left"
                            dataKey="range"
                            name="Individual Range (miles)"
                            fill="#82ca9d"
                            radius={[4, 4, 0, 0]}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="cumulativeRange"
                            name="Cumulative Range (miles)"
                            stroke="#ff7300"
                            dot={{ stroke: '#ff7300', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {selectedModel === 'All' ? (
                <div className="mt-4 text-sm text-gray-600">
                    Showing top 10 vehicles with longest electric range across all models
                </div>
            ) : (
                <div className="mt-4 text-sm text-gray-600">
                    Showing top 10 {selectedModel} vehicles with longest electric range.
                    The orange line shows the cumulative range across these top 10 vehicles.
                </div>
            )}
        </div>
    );
}