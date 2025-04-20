import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ModelYearTrend = ({ data }) => {
  const [selectedModel, setSelectedModel] = useState('');
  const [modelYearData, setModelYearData] = useState([]);
  const [topModels, setTopModels] = useState([]);

  // Process data once on component mount
  useEffect(() => {
    // Safety check
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log("No data available for processing");
      return;
    }

    try {
      console.log("Processing data with length:", data.length);
      console.log("First data item:", data[0]);

      // Create a map of all models and their counts
      const modelCounts = {};

      // Look through each vehicle record
      data.forEach(vehicle => {
        // Try different possible field names for the model
        let model = null;

        if (vehicle.Model !== undefined) {
          model = vehicle.Model;
        } else if (vehicle['Model'] !== undefined) {
          model = vehicle['Model'];
        } else {
          // If we can't find a model field, skip this record
          return;
        }

        // Skip empty model names
        if (!model || model === '') return;

        // Count this model
        if (!modelCounts[model]) {
          modelCounts[model] = 0;
        }
        modelCounts[model]++;
      });

      console.log("Model counts:", modelCounts);

      // Sort models by count and take top 20
      const sortedModels = Object.entries(modelCounts)
        .sort((a, b) => b[1] - a[1]) // Sort by count, descending
        .slice(0, 20) // Take top 20
        .map(([model]) => model); // Extract just the model names

      console.log("Top 20 models:", sortedModels);

      // Update state with top models
      setTopModels(sortedModels);

      // Set initial selected model
      if (sortedModels.length > 0) {
        setSelectedModel(sortedModels[0]);
      }
    } catch (error) {
      console.error("Error processing model data:", error);
    }
  }, [data]);

  // Update chart when model selection changes
  useEffect(() => {
    if (!selectedModel || !data || data.length === 0) return;

    try {
      console.log("Preparing data for model:", selectedModel);

      // Filter for just this model
      const modelData = data.filter(vehicle => {
        const model = vehicle.Model || vehicle['Model'] || '';
        return model === selectedModel;
      });

      console.log(`Found ${modelData.length} vehicles for model ${selectedModel}`);

      // Group by year
      const yearCounts = {};

      modelData.forEach(vehicle => {
        // Try different possible field names for year
        let year = null;

        if (vehicle['Model Year'] !== undefined) {
          year = vehicle['Model Year'];
        } else if (vehicle.ModelYear !== undefined) {
          year = vehicle.ModelYear;
        } else if (vehicle.Year !== undefined) {
          year = vehicle.Year;
        } else {
          // If we can't find a year field, skip this record
          return;
        }

        // Convert year to a number if it's not already
        year = Number(year);

        // Skip invalid years
        if (isNaN(year) || year < 1990 || year > 2030) return;

        // Count this year
        if (!yearCounts[year]) {
          yearCounts[year] = 0;
        }
        yearCounts[year]++;
      });

      // Convert to array format for the chart
      const chartData = Object.entries(yearCounts)
        .map(([year, count]) => ({ year: Number(year), count }))
        .sort((a, b) => a.year - b.year); // Sort by year

      console.log("Chart data:", chartData);

      setModelYearData(chartData);
    } catch (error) {
      console.error("Error preparing chart data:", error);
    }
  }, [selectedModel, data]);

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">EV Model Popularity Trend by Year</h2>

      {topModels.length > 0 ? (
        <div className="mb-4">
          <label htmlFor="model-select" className="block text-sm font-medium text-green-900 mb-1">
            Select Model:
          </label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={handleModelChange}
            className="block w-full p-2 border border-gray-300 rounded-md bg-green-100 text-green-900"
          >
            {topModels.map(model => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-100 rounded">
          <p>Identifying top models... If this message persists, there may be an issue with the data format.</p>
        </div>
      )}

      {modelYearData.length > 0 ? (
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={modelYearData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                label={{ value: 'Year', position: 'insideBottomRight', offset: -10 }}
              />
              <YAxis
                label={{ value: 'Number of Vehicle', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip formatter={(value) => [`${value} vehicles`, 'Count']} />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                name={selectedModel}
                stroke="#4ade80"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64 bg-gray-50 rounded">
          {selectedModel ? (
            <p>Preparing data for {selectedModel}...</p>
          ) : (
            <p>Select a model to view its trend</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelYearTrend;