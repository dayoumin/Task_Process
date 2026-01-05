export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  {
    id: 'home',
    label: 'Dashboard',
    href: '/',
    icon: 'Home',
  },
  {
    id: 'design-system',
    label: 'Design System',
    href: '/design-system',
    icon: 'Palette',
  },
  {
    id: 'learning',
    label: 'Learning',
    href: '/learning',
    icon: 'BookOpen',
    children: [
      {
        id: 'introduction',
        label: 'Introduction',
        href: '/learning/01-introduction',
      },
      {
        id: 'monorepo-structure',
        label: 'Monorepo Structure',
        href: '/learning/02-monorepo-structure',
      },
      {
        id: 'type-system',
        label: 'Type System',
        href: '/learning/03-type-system',
      },
      {
        id: 'ai-testing',
        label: 'AI Testing',
        href: '/learning/04-ai-testing',
      },
      {
        id: 'real-examples',
        label: 'Real Examples',
        href: '/learning/05-real-examples',
      },
      {
        id: 'best-practices',
        label: 'Best Practices',
        href: '/learning/06-best-practices',
      },
    ],
  },
  {
    id: 'architecture',
    label: 'Architecture',
    href: '/architecture',
    icon: 'Network',
  },
];

export const quickLinks = [
  {
    id: 'builder',
    label: 'Builder App',
    href: 'http://localhost:5174',
    description: 'Create and design process flows',
  },
  {
    id: 'executor',
    label: 'Executor App',
    href: 'http://localhost:5175',
    description: 'Execute processes step by step',
  },
  {
    id: 'dashboard',
    label: 'Dashboard App',
    href: 'http://localhost:5173',
    description: 'View analytics and statistics',
  },
];
