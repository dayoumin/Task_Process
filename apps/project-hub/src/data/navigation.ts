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
    label: '대시보드',
    href: '/',
    icon: 'Home',
  },
  {
    id: 'design-system',
    label: '디자인 시스템',
    href: '/design-system',
    icon: 'Palette',
  },
  {
    id: 'learning',
    label: '학습 센터',
    href: '/learning',
    icon: 'BookOpen',
    children: [
      {
        id: 'introduction',
        label: '소개',
        href: '/learning/01-introduction',
      },
      {
        id: 'monorepo-structure',
        label: '모노레포 구조',
        href: '/learning/02-monorepo-structure',
      },
      {
        id: 'type-system',
        label: '타입 시스템',
        href: '/learning/03-type-system',
      },
      {
        id: 'ai-testing',
        label: 'AI 테스트',
        href: '/learning/04-ai-testing',
      },
      {
        id: 'real-examples',
        label: '실전 예제',
        href: '/learning/05-real-examples',
      },
      {
        id: 'best-practices',
        label: '모범 사례',
        href: '/learning/06-best-practices',
      },
    ],
  },
  {
    id: 'architecture',
    label: '아키텍처',
    href: '/architecture',
    icon: 'Network',
  },
];

export const quickLinks = [
  {
    id: 'builder',
    label: 'Builder 앱',
    href: 'http://localhost:5173',
    description: '프로세스 플로우 생성 및 설계',
  },
  {
    id: 'executor',
    label: 'Executor 앱',
    href: 'http://localhost:5174',
    description: '프로세스 단계별 실행',
  },
  {
    id: 'dashboard',
    label: 'Dashboard 앱',
    href: 'http://localhost:5175',
    description: '분석 및 통계 확인',
  },
];
