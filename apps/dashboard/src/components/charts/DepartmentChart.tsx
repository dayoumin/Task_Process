/**
 * Department distribution pie chart
 */

import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import type { DepartmentStats } from '@task-process/shared-types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DepartmentChartProps {
  data: DepartmentStats[];
}

const COLORS = [
  'rgb(59, 130, 246)',   // blue
  'rgb(16, 185, 129)',   // green
  'rgb(249, 115, 22)',   // orange
  'rgb(139, 92, 246)',   // purple
  'rgb(236, 72, 153)',   // pink
  'rgb(234, 179, 8)',    // yellow
  'rgb(239, 68, 68)',    // red
  'rgb(20, 184, 166)',   // teal
];

export const DepartmentChart: React.FC<DepartmentChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.departmentName),
    datasets: [
      {
        label: 'Processes',
        data: data.map((d) => d.totalProcesses),
        backgroundColor: COLORS,
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-4">Department Distribution</h3>
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};
