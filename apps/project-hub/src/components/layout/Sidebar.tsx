import { NavLink } from 'react-router-dom';
import { Home, Palette, BookOpen, Network } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Design System', href: '/design-system', icon: Palette },
  { name: 'Learning', href: '/learning', icon: BookOpen },
  { name: 'Architecture', href: '/architecture', icon: Network },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Project Hub
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Task Process System
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Version 0.1.0
          </p>
        </div>
      </div>
    </div>
  );
}
