import { Link } from 'react-router-dom';
import { Package, Users, Activity, TrendingUp } from 'lucide-react';

const stats = [
  { name: '전체 패키지', value: '8', icon: Package, change: '이번 주 +2', color: 'blue', gradient: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30', iconColor: 'text-blue-600 dark:text-blue-400' },
  { name: '활성 앱', value: '3', icon: Users, change: '모두 실행 중', color: 'purple', gradient: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30', iconColor: 'text-purple-600 dark:text-purple-400' },
  { name: '빌드 상태', value: '100%', icon: Activity, change: '모두 통과', color: 'green', gradient: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30', iconColor: 'text-green-600 dark:text-green-400' },
  { name: '타입 커버리지', value: '96%', icon: TrendingUp, change: '+4% 개선', color: 'orange', gradient: 'from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30', iconColor: 'text-orange-600 dark:text-orange-400' },
];

const recentActivity = [
  { id: 1, title: 'Project Hub 앱 추가', time: '2시간 전', type: 'feature' },
  { id: 2, title: 'shared-ui 컴포넌트 업데이트', time: '1일 전', type: 'update' },
  { id: 3, title: 'TypeScript strict mode 이슈 수정', time: '2일 전', type: 'fix' },
  { id: 4, title: '모노레포 구조로 전환', time: '3일 전', type: 'refactor' },
];

const quickLinks = [
  { name: 'Builder 앱', href: 'http://localhost:5173', description: '프로세스 플로우 생성' },
  { name: 'Executor 앱', href: 'http://localhost:5174', description: '프로세스 실행' },
  { name: 'Dashboard 앱', href: 'http://localhost:5175', description: '분석 대시보드 확인' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          개요
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-xl border border-white/20 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-white/30 dark:bg-white/10 backdrop-blur`}>
                  <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-4">
                {stat.change}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            빠른 링크
          </h3>
          <div className="space-y-3">
            {quickLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-xl bg-white dark:bg-gray-700/50 border border-gray-200/60 dark:border-gray-600/50 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 group"
              >
                <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {link.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {link.description}
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            최근 활동
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-700/30 border border-gray-200/60 dark:border-gray-600/30 hover:shadow-md transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500"
              >
                <div
                  className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 shadow-md ${
                    activity.type === 'feature'
                      ? 'bg-gradient-to-r from-green-400 to-green-600'
                      : activity.type === 'update'
                        ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                        : activity.type === 'fix'
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                          : 'bg-gradient-to-r from-purple-400 to-purple-600'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
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

      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          시작 가이드
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/learning"
            className="group p-6 rounded-xl bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-900/20 dark:to-blue-800/10 border-2 border-gradient-to-r border-blue-200 dark:border-blue-700/50 hover:shadow-lg hover:scale-105 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white mb-3">
              <span className="text-lg">📚</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              기초 학습
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              인터랙티브 튜토리얼과 문서 탐색
            </p>
          </Link>
          <Link
            to="/design-system"
            className="group p-6 rounded-xl bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-900/20 dark:to-purple-800/10 border-2 border-purple-200 dark:border-purple-700/50 hover:shadow-lg hover:scale-105 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 text-white mb-3">
              <span className="text-lg">🎨</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              UI 컴포넌트
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              공유 컴포넌트와 디자인 패턴 확인
            </p>
          </Link>
          <Link
            to="/architecture"
            className="group p-6 rounded-xl bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-900/20 dark:to-green-800/10 border-2 border-green-200 dark:border-green-700/50 hover:shadow-lg hover:scale-105 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white mb-3">
              <span className="text-lg">🏗️</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              시스템 아키텍처
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              모노레포 구조와 데이터 플로우 이해
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
