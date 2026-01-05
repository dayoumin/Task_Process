# 배포 가이드 (Deployment Guide)

이 프로젝트는 **학습용 + 배포용** 두 가지 시나리오를 지원합니다.

---

## 📋 배포 옵션

### 옵션 1: 정적 HTML 배포 (개인 PC 사용)
### 옵션 2: Next.js 서버 배포 (Full-stack)
### 옵션 3: Vercel/Netlify 배포 (무료 호스팅)

---

## 🖥️ 옵션 1: 정적 HTML 배포

### 특징
- 백엔드 API 없음
- LocalStorage/IndexedDB로 데이터 저장
- 개인 PC에서 파일로 실행 가능
- 인터넷 연결 불필요 (오프라인 작동)

### 빌드 방법

```bash
# 1. 전체 빌드
pnpm build

# 2. 빌드 결과물 확인
ls apps/builder/dist
ls apps/dashboard/dist
ls apps/executor/dist
```

### 배포 구조

```
dist/
├── builder/
│   ├── index.html
│   ├── assets/
│   └── ...
├── dashboard/
│   ├── index.html
│   ├── assets/
│   └── ...
└── executor/
    ├── index.html
    ├── assets/
    └── ...
```

### 사용 방법

#### 방법 A: 로컬 파일로 실행
```bash
# Builder 앱 열기
start apps/builder/dist/index.html

# Dashboard 앱 열기
start apps/dashboard/dist/index.html

# Executor 앱 열기
start apps/executor/dist/index.html
```

#### 방법 B: 로컬 웹 서버 사용
```bash
# 간단한 HTTP 서버 실행
npx serve apps/builder/dist -p 5173
npx serve apps/dashboard/dist -p 5175
npx serve apps/executor/dist -p 5174
```

접속:
- Builder: http://localhost:5173
- Dashboard: http://localhost:5175
- Executor: http://localhost:5174

### 데이터 저장

```typescript
// LocalStorage 사용 예시
localStorage.setItem('processes', JSON.stringify(processes))
const processes = JSON.parse(localStorage.getItem('processes') || '[]')

// IndexedDB 사용 예시 (더 많은 데이터)
import { openDB } from 'idb'

const db = await openDB('task-process-db', 1, {
  upgrade(db) {
    db.createObjectStore('processes')
    db.createObjectStore('tracking')
    db.createObjectStore('stats')
  },
})

await db.put('processes', processData, processId)
const data = await db.get('processes', processId)
```

---

## 🚀 옵션 2: Next.js 서버 배포

### 특징
- 백엔드 API Routes 포함
- 데이터베이스 연동 (PostgreSQL, MongoDB 등)
- 서버 사이드 렌더링 (SSR)
- API 테스트 (TestSprite MCP)

### 프로젝트 구조 변경

현재 React + Vite 구조를 Next.js로 변환:

```bash
# 새 Next.js 앱 생성
npx create-next-app@latest apps/web --typescript --tailwind --app

# 기존 코드 마이그레이션
# apps/builder → apps/web/app/builder
# apps/dashboard → apps/web/app/dashboard
# apps/executor → apps/web/app/executor
```

### API Routes 추가

```typescript
// apps/web/app/api/processes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ProcessSchema } from '@task-process/shared-types'

export async function GET() {
  const processes = await db.process.findMany()
  return NextResponse.json(processes)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const validated = ProcessSchema.parse(body)

  const process = await db.process.create({
    data: validated,
  })

  return NextResponse.json(process)
}
```

### 데이터베이스 설정

#### Prisma 설정
```bash
pnpm add -D prisma
pnpm add @prisma/client

npx prisma init
```

```prisma
// prisma/schema.prisma
model Process {
  id        String   @id @default(uuid())
  name      String
  metadata  Json
  nodes     Json
  edges     Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 빌드 및 배포

```bash
# 빌드
pnpm build

# 로컬 실행
pnpm start

# 프로덕션 서버
pm2 start npm --name "task-process" -- start
```

---

## ☁️ 옵션 3: Vercel/Netlify 배포

### Vercel 배포 (추천)

#### 1. GitHub 연동
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/task-process.git
git push -u origin main
```

#### 2. Vercel 프로젝트 생성
```bash
npm i -g vercel
vercel login
vercel
```

#### 3. 설정
```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "apps/builder/dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### 4. 환경 변수 설정
- Vercel Dashboard → Settings → Environment Variables
- `DATABASE_URL`, `API_KEY` 등 추가

### Netlify 배포

#### 1. Netlify CLI 설치
```bash
npm i -g netlify-cli
netlify login
```

#### 2. 배포
```bash
netlify deploy --prod --dir=apps/builder/dist
```

#### 3. 설정
```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = "apps/builder/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🌐 옵션 4: Docker 배포

### Dockerfile

```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# 의존성 설치
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm build

# Production 이미지
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/apps/builder/dist /app/builder
COPY --from=builder /app/apps/dashboard/dist /app/dashboard
COPY --from=builder /app/apps/executor/dist /app/executor

EXPOSE 3000 3001 3002

CMD ["sh", "-c", "serve /app/builder -p 3000 & serve /app/dashboard -p 3001 & serve /app/executor -p 3002 & wait"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  builder:
    build: .
    ports:
      - "5173:3000"
    volumes:
      - ./apps/builder/dist:/app/builder

  dashboard:
    build: .
    ports:
      - "5175:3001"
    volumes:
      - ./apps/dashboard/dist:/app/dashboard

  executor:
    build: .
    ports:
      - "5174:3002"
    volumes:
      - ./apps/executor/dist:/app/executor
```

### 실행

```bash
# 빌드
docker-compose build

# 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 종료
docker-compose down
```

---

## 📊 성능 최적화

### 1. 빌드 최적화

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          flow: ['reactflow'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
```

### 2. Code Splitting

```typescript
// Lazy loading
const Dashboard = lazy(() => import('./components/Dashboard'))
const Builder = lazy(() => import('./components/Builder'))

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### 3. 이미지 최적화

```bash
# 이미지 압축
npm install -D vite-plugin-image-optimizer

# vite.config.ts에 추가
import imageOptimizer from 'vite-plugin-image-optimizer'

plugins: [
  imageOptimizer({
    png: { quality: 80 },
    jpeg: { quality: 80 },
  }),
]
```

---

## 🔒 보안 고려사항

### 환경 변수

```bash
# .env (로컬 개발)
VITE_API_URL=http://localhost:3000/api
VITE_DATABASE_URL=postgresql://...

# .env.production (프로덕션)
VITE_API_URL=https://api.yourdomain.com
VITE_DATABASE_URL=postgresql://prod.server/db
```

### CORS 설정

```typescript
// Next.js API Route
export async function GET(request: NextRequest) {
  const response = NextResponse.json({ ... })

  response.headers.set('Access-Control-Allow-Origin', 'https://yourdomain.com')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')

  return response
}
```

---

## 📝 체크리스트

### 배포 전 확인사항

- [ ] 모든 테스트 통과 (`pnpm test`)
- [ ] 타입 체크 통과 (`pnpm type-check`)
- [ ] 빌드 성공 (`pnpm build`)
- [ ] 환경 변수 설정 확인
- [ ] CORS 설정 확인
- [ ] API 키 안전하게 관리
- [ ] 프로덕션 URL 설정
- [ ] 에러 로깅 설정 (Sentry 등)
- [ ] 분석 도구 설정 (Google Analytics 등)

---

## 🆘 문제 해결

### 빌드 실패

```bash
# 캐시 삭제 후 재빌드
pnpm clean
pnpm install
pnpm build
```

### 포트 충돌

```bash
# Windows에서 포트 사용 중인 프로세스 확인
netstat -ano | findstr :5173

# 프로세스 종료
taskkill /PID <PID> /F
```

### 메모리 부족

```bash
# Node.js 메모리 제한 증가
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

---

## 📚 참고 자료

- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel 문서](https://vercel.com/docs)
- [Netlify 문서](https://docs.netlify.com/)
- [Docker 공식 문서](https://docs.docker.com/)

---

**작성일**: 2026-01-05
**버전**: 1.0.0
**상태**: ✅ 완료
