/**
 * Bottleneck analysis horizontal bar chart
 */

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import type { BottleneckData } from '@task-process/shared-types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BottleneckChartProps {
  data: BottleneckData[];
}

export const BottleneckChart: React.FC<BottleneckChartProps> = ({ data }) => {
  // Show top 10 bottlenecks
  const topBottlenecks = data.slice(0, 10);

  const chartData = {
    labels: topBottlenecks.map((d) => `${d.stepTitle.substring(0, 30)}...`),
    datasets: [
      {
        label: 'Avg Time (minutes)',
        data: topBottlenecks.map((d) => d.avgTimeSpent),
        backgroundColor: topBottlenecks.map((d) =>
          d.avgTimeSpent > 60 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(249, 115, 22, 0.8)'
        ),
        borderColor: topBottlenecks.map((d) =>
          d.avgTimeSpent > 60 ? 'rgb(239, 68, 68)' : 'rgb(249, 115, 22)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            const index = context.dataIndex;
            const bottleneck = topBottlenecks[index];
            return [
              `Process: ${bottleneck.processType}`,
              `90th Percentile: ${bottleneck.percentile90.toFixed(1)} min`,
              `Occurrences: ${bottleneck.occurrences}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Minutes',
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-4">
        Bottleneck Analysis (Top 10 Slowest Steps)
      </h3>
      <div className="h-96">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};
