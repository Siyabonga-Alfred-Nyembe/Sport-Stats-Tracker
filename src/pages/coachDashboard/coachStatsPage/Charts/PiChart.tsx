// src/pages/coachDashboard/charts/WinsChart.tsx
import React from 'react';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, defaults } from "chart.js/auto";

interface Props {
  label: string[];
  values: number[];
  title: string;
}

const PiChart: React.FC<Props> = ({ label, values, title }) => (
  <section className='chart-container'>
    <Doughnut
      data={{
        labels: label,
        datasets: [
          {
            label: title,
            data: values,
            backgroundColor: [
              "rgba(43, 63, 229, 0.8)",
              "rgba(250, 192, 19, 0.8)",
              "rgba(253, 135, 135, 0.8)",
            ],
            borderColor: [
              "rgba(43, 63, 229, 0.8)",
              "rgba(250, 192, 19, 0.8)",
              "rgba(253, 135, 135, 0.8)",
            ],
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title,
          },
          legend: {
            position: "bottom",
          },
        },
      }}
    />
  </section>
);

export default PiChart;