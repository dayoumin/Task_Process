import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

const diagrams = [
  { id: 'monorepo-structure', title: 'Monorepo Structure', file: 'monorepo-structure.mmd' },
  { id: 'dependency-graph', title: 'Dependency Graph', file: 'dependency-graph.mmd' },
  { id: 'data-flow', title: 'Data Flow', file: 'data-flow.mmd' },
  { id: 'test-workflow', title: 'Test Workflow', file: 'test-workflow.mmd' },
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

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          System Architecture
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Explore the architecture of the Task Process system through interactive
          diagrams. Select a diagram to view details.
        </p>
        <div className="flex flex-wrap gap-2">
          {diagrams.map((diagram) => (
            <button
              key={diagram.id}
              onClick={() => setSelectedDiagram(diagram.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedDiagram === diagram.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {diagram.title}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center min-h-[400px]">
          <div ref={mermaidRef} className="mermaid w-full" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Architecture Overview
        </h4>
        <div className="space-y-4 text-gray-600 dark:text-gray-400">
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">
              Monorepo Structure
            </h5>
            <p>
              The project uses a monorepo architecture with pnpm workspaces,
              enabling code sharing and consistent dependency management across
              all applications and packages.
            </p>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">
              Shared Packages
            </h5>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>shared-types: Common TypeScript types and interfaces</li>
              <li>shared-ui: Reusable React components</li>
              <li>shared-utils: Utility functions and helpers</li>
              <li>config-typescript: TypeScript configuration</li>
              <li>config-tailwind: Tailwind CSS configuration</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">
              Applications
            </h5>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>builder: Visual process builder (port 5174)</li>
              <li>executor: Process execution engine (port 5175)</li>
              <li>dashboard: Analytics and reporting (port 5173)</li>
              <li>project-hub: Documentation and learning center (port 5176)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
