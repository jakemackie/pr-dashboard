"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const data = {
  labels,
  datasets: [
    {
      label: "Orders",
      data: [24, 31, 28, 43, 39, 30, 34],
      borderRadius: 8,
      backgroundColor: "rgba(245, 158, 11, 0.9)",
      hoverBackgroundColor: "rgba(245, 158, 11, 1)",
      maxBarThickness: 42,
    },
    {
      label: "Revenue ($k)",
      data: [12, 18, 14, 22, 21, 16, 19],
      borderRadius: 8,
      backgroundColor: "rgba(34, 197, 94, 0.85)",
      hoverBackgroundColor: "rgba(34, 197, 94, 1)",
      maxBarThickness: 42,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: "#e4e4e7",
      },
    },
    title: {
      display: true,
      text: "Weekly Performance",
      color: "#fafafa",
      font: {
        size: 18,
      },
    },
    tooltip: {
      backgroundColor: "rgba(15, 15, 17, 0.95)",
      titleColor: "#fafafa",
      bodyColor: "#e4e4e7",
      borderColor: "rgba(63, 63, 70, 0.9)",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#a1a1aa",
      },
      grid: {
        color: "rgba(63, 63, 70, 0.4)",
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: "#a1a1aa",
      },
      grid: {
        color: "rgba(63, 63, 70, 0.4)",
      },
    },
  },
};

export function SalesChart() {
  return <Bar data={data} options={options} />;
}
