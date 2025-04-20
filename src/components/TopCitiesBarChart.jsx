import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopCitiesBarChart = ({ evData }) => {
    const cityCounts = {};

    evData.forEach(ev => {
        const city = ev["City"];
        if (city) {
            cityCounts[city] = (cityCounts[city] || 0) + 1;
        }
    });

    const topCities = Object.entries(cityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const data = {
        labels: topCities.map(([city]) => city),
        datasets: [
            {
                label: "EV Count",
                data: topCities.map(([_, count]) => count),
                backgroundColor: "rgba(34, 197, 94, 0.8)", // green
            },
        ],
    };

    const options = {
        indexAxis: "y",
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "Top 10 Cities by EV Count",
                font: {
                    size: 18,
                },
                color: "#000"
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "EV Count",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "City",
                },
            },
        },
    };

    return (
        <div className="bg-white p-4 rounded-2xl my-4">
            <Bar data={data} options={options} />
        </div>
    );
};

export default TopCitiesBarChart;
