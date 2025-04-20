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

const EVTypeBarChart = ({ evData }) => {
    const filtered = evData.filter(ev => ev["Model Year"] && ev["Electric Vehicle Type"]);

    const yearTypeCounts = {};
    filtered.forEach(ev => {
        const year = ev["Model Year"];
        const type = ev["Electric Vehicle Type"];

        if (!yearTypeCounts[year]) {
            yearTypeCounts[year] = { BEV: 0, PHEV: 0, Other: 0 };
        }

        if (type === "Battery Electric Vehicle (BEV)") {
            yearTypeCounts[year].BEV += 1;
        } else if (type === "Plug-in Hybrid Electric Vehicle (PHEV)") {
            yearTypeCounts[year].PHEV += 1;
        } else {
            yearTypeCounts[year].Other += 1;
        }
    });

    const years = Object.keys(yearTypeCounts).sort();
    const bevCounts = years.map(year => yearTypeCounts[year].BEV);
    const phevCounts = years.map(year => yearTypeCounts[year].PHEV);
    const otherCounts = years.map(year => yearTypeCounts[year].Other);

    const data = {
        labels: years,
        datasets: [
            {
                label: "BEV",
                data: bevCounts,
                backgroundColor: "rgba(34, 197, 94, 0.8)",
            },
            {
                label: "PHEV",
                data: phevCounts,
                backgroundColor: "rgba(59, 130, 246, 0.8)",
            },
            {
                label: "Other",
                data: otherCounts,
                backgroundColor: "rgba(234, 179, 8, 0.8)",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
            },
            title: {
                display: true,
                text: "EV Type Distribution Over Years",
                font: {
                    size: 20,
                },
                color: "#000"
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Model Year",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Count",
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className=" p-6 rounded-2xl  my-6 w-full max-w-[1000px] mx-auto h-[500px]">
            <Bar data={data} options={options} />
        </div>
    );
};

export default EVTypeBarChart;
