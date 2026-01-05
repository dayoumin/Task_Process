/**
 * Process type bar chart
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
import type { ProcessTypeStats } from '@task-process/shared-types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProcessChartProps {
  data: ProcessTypeStats[];
}

export const ProcessChart: React.FC<ProcessChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.processType),
    datasets: [
      {
        label: 'Total Processes',
        data: data.map((d) => d.count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Completed',
        data: data.map((d) => d.completedCount),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            const index = context.dataIndex;
            const stats = data[index];
            return `Completion Rate: ${stats.completionRate.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-4">Process Type Distribution</h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};
