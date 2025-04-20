import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ data, type = "model" }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (!data) return;

        const filtered = data.filter(
            (item) =>
                item["Clean Alternative Fuel Vehicle (CAFV) Eligibility"] ===
                "Clean Alternative Fuel Vehicle Eligible"
        );

        const counts = {};
        filtered.forEach((item) => {
            const key = type === "model" ? item.Model : item.Make;
            if (key) counts[key] = (counts[key] || 0) + 1;
        });

        const sorted = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const labels = sorted.map((entry) => entry[0]);
        const values = sorted.map((entry) => entry[1]);

        setChartData({
            labels,
            datasets: [
                {
                    label: `Top 10 ${type === "model" ? "Car Models" : "Car Manufacturers"}`,
                    data: values,
                    backgroundColor: [
                        "#4caf50", "#81c784", "#66bb6a", "#388e3c",
                        "#a5d6a7", "#2e7d32", "#c8e6c9", "#43a047",
                        "#1b5e20", "#76d275"
                    ],
                    borderWidth: 1
                }
            ]
        });
    }, [data, type]);

    if (!chartData) return <p>Loading {type} donut chart...</p>;

    return (
        <div style={{ maxWidth: 500, margin: "auto" }}>
            <h3 className="text-xl font-semibold text-center mb-2">
                Top 10 {type === "model" ? "Car Models" : "Car Manufacturers"} by CAFV Eligibility
            </h3>
            <Doughnut data={chartData} />
        </div>
    );
};

export default DonutChart;
