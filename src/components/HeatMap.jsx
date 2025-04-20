import React, { useEffect, useState } from 'react';

const HeatMap = ({ data }) => {
    const [cityData, setCityData] = useState({});
    const [maxCount, setMaxCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [topCities, setTopCities] = useState([]);

    useEffect(() => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            setLoading(true);
            return;
        }

        setLoading(true);

        // Process data to count EVs by city
        const cities = {};

        data.forEach(vehicle => {
            // Try to extract city information from Electric Utility field
            // This is a bit hacky but works based on the sample data
            if (vehicle["Electric Utility"]) {
                // Extract cities from strings like "CITY OF SEATTLE - (WA)"
                const utilityString = vehicle["Electric Utility"];
                const cityMatches = utilityString.match(/CITY OF ([A-Za-z\s]+) -/g);

                if (cityMatches && cityMatches.length > 0) {
                    cityMatches.forEach(match => {
                        const city = match.replace("CITY OF ", "").replace(" -", "").trim();
                        if (!cities[city]) {
                            cities[city] = 0;
                        }
                        cities[city]++;
                    });
                } else {
                    // If no city match, check if there's a utility company that implies a location
                    if (utilityString.includes("PUGET SOUND")) {
                        const city = "PUGET SOUND REGION";
                        if (!cities[city]) {
                            cities[city] = 0;
                        }
                        cities[city]++;
                    } else {
                        const city = "OTHER";
                        if (!cities[city]) {
                            cities[city] = 0;
                        }
                        cities[city]++;
                    }
                }
            }
        });

        // Find the maximum count for color scaling
        const max = Math.max(...Object.values(cities));

        // Get top cities by count
        const sortedCities = Object.entries(cities)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(([city]) => city);

        setCityData(cities);
        setMaxCount(max);
        setTopCities(sortedCities);
        setLoading(false);
    }, [data]);

    // Calculate color based on count relative to max
    const getColor = (count) => {
        if (!count) return '#f0f0f0'; // Default for cities with no data

        const intensity = Math.min(1, count / maxCount);
        // Green gradient from light to dark
        return `rgb(${Math.round(240 - 180 * intensity)}, ${Math.round(250 - 100 * intensity)}, ${Math.round(240 - 200 * intensity)})`;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">EV Distribution by City in Washington</h2>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p>Processing city data...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-4 gap-3 mx-auto max-w-4xl">
                        {topCities.map((city) => (
                            <div
                                key={city}
                                className="p-3 border rounded flex flex-col items-center justify-center h-24"
                                style={{ backgroundColor: getColor(cityData[city]) }}
                            >
                                <div className="text-xs font-bold text-center">{city}</div>
                                <div className="text-sm mt-1">{cityData[city] || 0}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center items-center mt-4">
                        <div className="flex items-center">
                            <div className="w-4 h-4 mr-1" style={{ backgroundColor: getColor(0) }}></div>
                            <span className="text-xs mr-3">0</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 mr-1" style={{ backgroundColor: getColor(Math.floor(maxCount / 4)) }}></div>
                            <span className="text-xs mr-3">{Math.floor(maxCount / 4)}</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 mr-1" style={{ backgroundColor: getColor(Math.floor(maxCount / 2)) }}></div>
                            <span className="text-xs mr-3">{Math.floor(maxCount / 2)}</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 mr-1" style={{ backgroundColor: getColor(maxCount) }}></div>
                            <span className="text-xs">{maxCount}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default HeatMap;