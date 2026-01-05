import { Link } from 'react-router-dom';
import { Package, Users, Activity, TrendingUp } from 'lucide-react';

const stats = [
  { name: 'Total Packages', value: '8', icon: Package, change: '+2 this week' },
  { name: 'Active Apps', value: '3', icon: Users, change: 'All running' },
  { name: 'Build Status', value: '100%', icon: Activity, change: 'All passing' },
  { name: 'Type Coverage', value: '96%', icon: TrendingUp, change: '+4% improved' },
];

const recentActivity = [
  { id: 1, title: 'Added Project Hub app', time: '2 hours ago', type: 'feature' },
  { id: 2, title: 'Updated shared-ui components', time: '1 day ago', type: 'update' },
  { id: 3, title: 'Fixed TypeScript strict mode issues', time: '2 days ago', type: 'fix' },
  { id: 4, title: 'Migrated to monorepo structure', time: '3 days ago', type: 'refactor' },
];

const quickLinks = [
  { name: 'Builder App', href: 'http://localhost:5174', description: 'Create process flows' },
  { name: 'Executor App', href: 'http://localhost:5175', description: 'Run processes' },
  { name: 'Dashboard App', href: 'http://localhost:5173', description: 'View analytics' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Overview
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {stat.change}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Links
          </h3>
          <div className="space-y-3">
            {quickLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {link.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {link.description}
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'feature'
                      ? 'bg-green-500'
                      : activity.type === 'update'
                        ? 'bg-blue-500'
                        : activity.type === 'fix'
                          ? 'bg-yellow-500'
                          : 'bg-purple-500'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Getting Started
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/learning"
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Learn the Basics
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Explore interactive tutorials and documentation
            </p>
          </Link>
          <Link
            to="/design-system"
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              UI Components
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View shared components and design patterns
            </p>
          </Link>
          <Link
            to="/architecture"
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              System Architecture
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Understand the monorepo structure and data flow
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
