import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Highlight, themes } from 'prism-react-renderer';

const topics = [
  { id: '01-introduction', title: 'Introduction', file: '01-introduction.md' },
  { id: '02-monorepo-structure', title: 'Monorepo Structure', file: '02-monorepo-structure.md' },
  { id: '03-type-system', title: 'Type System', file: '03-type-system.md' },
  { id: '04-ai-testing', title: 'AI Testing', file: '04-ai-testing.md' },
  { id: '05-real-examples', title: 'Real Examples', file: '05-real-examples.md' },
  { id: '06-best-practices', title: 'Best Practices', file: '06-best-practices.md' },
];

export default function Learning() {
  const { topic } = useParams();
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
        setContent('# Error\n\nFailed to load content. Please try again.');
      }
    };

    loadContent();
  }, [currentTopic]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 sticky top-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Topics
          </h3>
          <nav className="space-y-1">
            {topics.map((t) => (
              <Link
                key={t.id}
                to={`/learning/${t.id}`}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentTopic === t.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {t.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
          <article className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const code = String(children).replace(/\n$/, '');

                  return match ? (
                    <Highlight theme={themes.oneDark} code={code} language={match[1]}>
                      {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <pre className={className} style={style}>
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
