import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Highlight, themes } from 'prism-react-renderer';
import { BookOpen, Code, Database, Sparkles, Lightbulb, CheckCircle } from 'lucide-react';

const topics = [
  { id: '01-introduction', title: '소개', file: '01-introduction.md', icon: BookOpen, color: 'blue' },
  { id: '02-monorepo-structure', title: '모노레포 구조', file: '02-monorepo-structure.md', icon: Database, color: 'purple' },
  { id: '03-type-system', title: '타입 시스템', file: '03-type-system.md', icon: Code, color: 'green' },
  { id: '04-ai-testing', title: 'AI 테스트', file: '04-ai-testing.md', icon: Sparkles, color: 'pink' },
  { id: '05-real-examples', title: '실전 예제', file: '05-real-examples.md', icon: Lightbulb, color: 'orange' },
  { id: '06-best-practices', title: '모범 사례', file: '06-best-practices.md', icon: CheckCircle, color: 'teal' },
];

const colorClasses = {
  blue: {
    active: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300',
    inactive: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700',
    icon: 'text-blue-500',
  },
  purple: {
    active: 'bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-700 dark:text-purple-300',
    inactive: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-700',
    icon: 'text-purple-500',
  },
  green: {
    active: 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300',
    inactive: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-300 dark:hover:border-green-700',
    icon: 'text-green-500',
  },
  pink: {
    active: 'bg-pink-50 dark:bg-pink-900/20 border-pink-500 text-pink-700 dark:text-pink-300',
    inactive: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-300 dark:hover:border-pink-700',
    icon: 'text-pink-500',
  },
  orange: {
    active: 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 text-orange-700 dark:text-orange-300',
    inactive: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-orange-300 dark:hover:border-orange-700',
    icon: 'text-orange-500',
  },
  teal: {
    active: 'bg-teal-50 dark:bg-teal-900/20 border-teal-500 text-teal-700 dark:text-teal-300',
    inactive: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-teal-300 dark:hover:border-teal-700',
    icon: 'text-teal-500',
  },
};

export default function Learning() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const currentTopic = topic || '01-introduction';

  useEffect(() => {
    const loadContent = async () => {
      try {
        const topicData = topics.find((t) => t.id === currentTopic);
        if (!topicData) return;

        const response = await fetch(`/src/content/learning/${topicData.file}`);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error('Failed to load content:', error);
        setContent('# 오류\n\n콘텐츠를 불러오는데 실패했습니다. 다시 시도해주세요.');
      }
    };

    loadContent();
  }, [currentTopic]);

  return (
    <div className="space-y-6">
      {/* 탭 카드 섹션 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {topics.map((t) => {
          const Icon = t.icon;
          const isActive = currentTopic === t.id;
          const colors = colorClasses[t.color as keyof typeof colorClasses];

          return (
            <button
              key={t.id}
              onClick={() => navigate(`/learning/${t.id}`)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                isActive ? colors.active : colors.inactive
              }`}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <Icon className={`w-8 h-8 ${isActive ? colors.icon : 'text-gray-400 dark:text-gray-500'}`} />
                <span className="text-sm font-medium leading-tight">
                  {t.title}
                </span>
              </div>
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-current to-transparent rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
        <div className="p-8 md:p-12">
          <article className="markdown-content prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const code = String(children).replace(/\n$/, '');

                  return match ? (
                    <Highlight theme={themes.oneDark} code={code} language={match[1]}>
                      {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <pre className={className} style={{ ...style, borderRadius: '0.75rem', padding: '1.5rem' }}>
                          {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                              {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                              ))}
                            </div>
                          ))}
                        </pre>
                      )}
                    </Highlight>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}