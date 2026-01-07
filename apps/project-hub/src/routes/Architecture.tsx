import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Network, GitBranch, Workflow, TestTube2 } from 'lucide-react';

const diagrams = [
  {
    id: 'monorepo-structure',
    title: '모노레포 구조',
    file: 'monorepo-structure.mmd',
    icon: Network,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
    darkBgGradient: 'dark:from-blue-900/30 dark:to-blue-800/30',
    border: 'border-blue-300 dark:border-blue-700',
    description: '전체 프로젝트 구조 살펴보기'
  },
  {
    id: 'dependency-graph',
    title: '의존성 그래프',
    file: 'dependency-graph.mmd',
    icon: GitBranch,
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-50 to-purple-100',
    darkBgGradient: 'dark:from-purple-900/30 dark:to-purple-800/30',
    border: 'border-purple-300 dark:border-purple-700',
    description: '패키지 간 의존성 관계'
  },
  {
    id: 'data-flow',
    title: '데이터 흐름',
    file: 'data-flow.mmd',
    icon: Workflow,
    color: 'green',
    gradient: 'from-green-500 to-green-600',
    bgGradient: 'from-green-50 to-green-100',
    darkBgGradient: 'dark:from-green-900/30 dark:to-green-800/30',
    border: 'border-green-300 dark:border-green-700',
    description: '데이터가 흐르는 방식'
  },
  {
    id: 'test-workflow',
    title: '테스트 워크플로우',
    file: 'test-workflow.mmd',
    icon: TestTube2,
    color: 'pink',
    gradient: 'from-pink-500 to-pink-600',
    bgGradient: 'from-pink-50 to-pink-100',
    darkBgGradient: 'dark:from-pink-900/30 dark:to-pink-800/30',
    border: 'border-pink-300 dark:border-pink-700',
    description: 'AI 기반 테스트 프로세스'
  },
];

export default function Architecture() {
  const [selectedDiagram, setSelectedDiagram] = useState('monorepo-structure');
  const [diagramContent, setDiagramContent] = useState('');
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    });
  }, []);

  useEffect(() => {
    const loadDiagram = async () => {
      try {
        const diagram = diagrams.find((d) => d.id === selectedDiagram);
        if (!diagram) return;

        const response = await fetch(`/src/content/diagrams/${diagram.file}`);
        const text = await response.text();
        setDiagramContent(text);
      } catch (error) {
        console.error('Failed to load diagram:', error);
        setDiagramContent('graph TD\n  A[Error] --> B[Failed to load diagram]');
      }
    };

    loadDiagram();
  }, [selectedDiagram]);

  useEffect(() => {
    if (diagramContent && mermaidRef.current) {
      mermaidRef.current.innerHTML = diagramContent;
      mermaid.run({ nodes: [mermaidRef.current] });
    }
  }, [diagramContent]);

  const selectedDiagramData = diagrams.find((d) => d.id === selectedDiagram);

  return (
    <div className="space-y-8">
      {/* Diagram Selector Cards */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/50 dark:to-gray-900/50 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          시스템 아키텍처
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          대화형 다이어그램을 통해 태스크 프로세스 시스템의 아키텍처를 살펴보세요. 카드를 선택하여 세부 정보를 확인하세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {diagrams.map((diagram) => {
            const Icon = diagram.icon;
            const isSelected = selectedDiagram === diagram.id;

            return (
              <button
                key={diagram.id}
                onClick={() => setSelectedDiagram(diagram.id)}
                className={`
                  group relative overflow-hidden
                  p-6 rounded-xl transition-all duration-300
                  ${isSelected
                    ? `bg-gradient-to-br ${diagram.bgGradient} ${diagram.darkBgGradient} border-2 ${diagram.border} shadow-xl scale-105`
                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-102'
                  }
                `}
              >
                {/* Icon Background */}
                <div className={`
                  absolute top-0 right-0 w-24 h-24 opacity-10
                  bg-gradient-to-br ${diagram.gradient}
                  rounded-bl-full
                `} />

                {/* Content */}
                <div className="relative z-10">
                  <div className={`
                    inline-flex p-3 rounded-lg mb-3
                    bg-gradient-to-br ${diagram.gradient}
                    shadow-md group-hover:shadow-lg transition-shadow
                  `}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h4 className={`
                    font-bold text-lg mb-2
                    ${isSelected
                      ? `text-${diagram.color}-900 dark:text-${diagram.color}-100`
                      : 'text-gray-900 dark:text-white'
                    }
                  `}>
                    {diagram.title}
                  </h4>

                  <p className={`
                    text-sm
                    ${isSelected
                      ? `text-${diagram.color}-700 dark:text-${diagram.color}-300`
                      : 'text-gray-600 dark:text-gray-400'
                    }
                  `}>
                    {diagram.description}
                  </p>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className={`
                    absolute bottom-0 left-0 right-0 h-1
                    bg-gradient-to-r ${diagram.gradient}
                  `} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Diagram Display */}
      <div className={`
        bg-gradient-to-br ${selectedDiagramData?.bgGradient} ${selectedDiagramData?.darkBgGradient}
        p-8 rounded-xl shadow-xl
        border-2 ${selectedDiagramData?.border}
      `}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-inner">
          <div className="flex items-center justify-center min-h-[400px]">
            <div ref={mermaidRef} className="mermaid w-full" />
          </div>
        </div>
      </div>

      {/* Architecture Overview */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-8 rounded-xl shadow-lg border border-indigo-200 dark:border-indigo-800">
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          아키텍처 개요
        </h4>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Monorepo Structure */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-indigo-200/50 dark:border-indigo-700/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                <Network className="w-5 h-5 text-white" />
              </div>
              <h5 className="font-bold text-gray-900 dark:text-white">
                모노레포 구조
              </h5>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              pnpm 워크스페이스를 사용한 모노레포 아키텍처로 모든 애플리케이션과 패키지 간 코드 공유 및 일관된 의존성 관리를 실현합니다.
            </p>
          </div>

          {/* Shared Packages */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-indigo-200/50 dark:border-indigo-700/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
                <GitBranch className="w-5 h-5 text-white" />
              </div>
              <h5 className="font-bold text-gray-900 dark:text-white">
                공유 패키지
              </h5>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>shared-types:</strong> 공통 TypeScript 타입</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>shared-ui:</strong> 재사용 가능한 컴포넌트</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>shared-utils:</strong> 유틸리티 함수</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>config-*:</strong> 공통 설정</span>
              </li>
            </ul>
          </div>

          {/* Applications */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-indigo-200/50 dark:border-indigo-700/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md">
                <Workflow className="w-5 h-5 text-white" />
              </div>
              <h5 className="font-bold text-gray-900 dark:text-white">
                애플리케이션
              </h5>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>builder:</strong> 프로세스 빌더 (5174)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>executor:</strong> 실행 엔진 (5175)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>dashboard:</strong> 분석 보고 (5173)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>project-hub:</strong> 학습 센터 (5176)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
