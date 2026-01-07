import { useState } from 'react';
import { Button } from '@task-process/shared-ui';
import { AlertCircle, CheckCircle, Info, XCircle, Sparkles, Palette, Bell, Type } from 'lucide-react';

export default function DesignSystem() {
  const [buttonStates, setButtonStates] = useState({
    primary: false,
    secondary: false,
    outline: false,
  });

  return (
    <div className="space-y-8">
      {/* Buttons Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            버튼
          </h3>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-xl shadow-lg border border-purple-200 dark:border-purple-800">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                onClick={() =>
                  setButtonStates((s) => ({ ...s, primary: !s.primary }))
                }
                className="shadow-md hover:shadow-xl transition-all"
              >
                주요 버튼
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  setButtonStates((s) => ({ ...s, secondary: !s.secondary }))
                }
                className="shadow-md hover:shadow-xl transition-all"
              >
                보조 버튼
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setButtonStates((s) => ({ ...s, outline: !s.outline }))
                }
                className="shadow-md hover:shadow-xl transition-all"
              >
                아웃라인 버튼
              </Button>
              <Button variant="ghost" className="hover:shadow-md transition-all">고스트 버튼</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="sm" className="shadow-md hover:shadow-lg transition-all">
                작게
              </Button>
              <Button variant="primary" size="md" className="shadow-md hover:shadow-lg transition-all">
                중간
              </Button>
              <Button variant="primary" size="lg" className="shadow-md hover:shadow-lg transition-all">
                크게
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" disabled>
                비활성화
              </Button>
              <Button variant="primary" className="w-full shadow-md hover:shadow-lg transition-all">
                전체 폭
              </Button>
            </div>
          </div>
          <div className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-inner border border-purple-200/50 dark:border-purple-700/50">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              버튼 상태: 주요 <span className={buttonStates.primary ? 'text-green-600 dark:text-green-400 font-bold' : 'text-gray-500'}>{buttonStates.primary ? '켜짐' : '꺼짐'}</span>,
              보조 <span className={buttonStates.secondary ? 'text-green-600 dark:text-green-400 font-bold' : 'text-gray-500'}>{buttonStates.secondary ? '켜짐' : '꺼짐'}</span>, 아웃라인{' '}
              <span className={buttonStates.outline ? 'text-green-600 dark:text-green-400 font-bold' : 'text-gray-500'}>{buttonStates.outline ? '켜짐' : '꺼짐'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Colors Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            색상 팔레트
          </h3>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-xl shadow-lg border border-blue-200 dark:border-blue-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: '주요색', color: 'bg-blue-500', gradient: 'from-blue-400 to-blue-600' },
              { name: '성공', color: 'bg-green-500', gradient: 'from-green-400 to-green-600' },
              { name: '경고', color: 'bg-yellow-500', gradient: 'from-yellow-400 to-yellow-600' },
              { name: '위험', color: 'bg-red-500', gradient: 'from-red-400 to-red-600' },
              { name: '보라', color: 'bg-purple-500', gradient: 'from-purple-400 to-purple-600' },
              { name: '분홍', color: 'bg-pink-500', gradient: 'from-pink-400 to-pink-600' },
              { name: '청록', color: 'bg-teal-500', gradient: 'from-teal-400 to-teal-600' },
              { name: '주황', color: 'bg-orange-500', gradient: 'from-orange-400 to-orange-600' },
            ].map((item) => (
              <div key={item.name} className="space-y-3 group">
                <div className={`bg-gradient-to-br ${item.gradient} h-24 rounded-xl shadow-lg transform group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300 border-2 border-white dark:border-gray-700`} />
                <p className="text-sm font-semibold text-center text-gray-700 dark:text-gray-300">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            알림 컴포넌트
          </h3>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-xl shadow-lg border border-green-200 dark:border-green-800">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-2 border-blue-300 dark:border-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="p-2 bg-blue-500 rounded-lg shadow-md">
                <Info className="w-5 h-5 text-white flex-shrink-0" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 dark:text-blue-100 text-lg">
                  정보
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  추가 정보가 포함된 정보 알림입니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-5 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-2 border-green-300 dark:border-green-700 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="p-2 bg-green-500 rounded-lg shadow-md">
                <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-green-900 dark:text-green-100 text-lg">
                  성공
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  작업이 성공적으로 완료되었습니다!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-5 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="p-2 bg-yellow-500 rounded-lg shadow-md">
                <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-yellow-900 dark:text-yellow-100 text-lg">
                  경고
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  경고 메시지를 주의 깊게 검토하세요.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-5 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-2 border-red-300 dark:border-red-700 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="p-2 bg-red-500 rounded-lg shadow-md">
                <XCircle className="w-5 h-5 text-white flex-shrink-0" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-red-900 dark:text-red-100 text-lg">
                  오류
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  오류가 발생했습니다. 다시 시도하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Typography Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            타이포그래피
          </h3>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-8 rounded-xl shadow-lg border border-indigo-200 dark:border-indigo-800">
          <div className="space-y-6">
            <div className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-md border border-indigo-200/50 dark:border-indigo-700/50">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                제목 1
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                4xl / 굵게 / 그라디언트
              </p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-md border border-indigo-200/50 dark:border-indigo-700/50">
              <h2 className="text-3xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                제목 2
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                3xl / 준굵게 / 그라디언트
              </p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-md border border-indigo-200/50 dark:border-indigo-700/50">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                제목 3
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                2xl / 준굵게
              </p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-md border border-indigo-200/50 dark:border-indigo-700/50">
              <p className="text-base text-gray-900 dark:text-white">
                본문 텍스트 - 일반 굵기의 일반 문단
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                기본 / 일반
              </p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-md border border-indigo-200/50 dark:border-indigo-700/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                작은 텍스트 - 캡션 및 보조 정보에 사용
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                작음 / 일반
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
