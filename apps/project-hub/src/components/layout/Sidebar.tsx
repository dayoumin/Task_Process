import { NavLink } from 'react-router-dom';
import { Home, Palette, BookOpen, Network, Sparkles } from 'lucide-react';

const navigation = [
  { name: '대시보드', href: '/', icon: Home, color: 'blue' },
  { name: '디자인 시스템', href: '/design-system', icon: Palette, color: 'purple' },
  { name: '학습 센터', href: '/learning', icon: BookOpen, color: 'green' },
  { name: '아키텍처', href: '/architecture', icon: Network, color: 'pink' },
];

const colorClasses = {
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 border-purple-500/20',
  green: 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 border-green-500/20',
  pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/20 border-pink-500/20',
};

export default function Sidebar() {
  return (
    <div className="w-64 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200/50 dark:border-gray-700/50">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Project Hub
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Task Process System
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? `${colorClasses[item.color as keyof typeof colorClasses]} font-semibold shadow-sm border scale-105`
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:scale-102'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`${isActive ? 'animate-pulse' : ''}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Version 0.1.0</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/50" />
              <span className="text-green-600 dark:text-green-400 font-medium">Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
