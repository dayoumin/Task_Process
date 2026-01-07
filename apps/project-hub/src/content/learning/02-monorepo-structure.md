# 모노레포 구조 (Monorepo Structure)

Task Process 모노레포가 어떻게 구성되어 있고, 공유 패키지를 어떻게 다루는지 알아봅니다.

## 왜 모노레포인가?

모노레포(Monolithic Repository)는 여러 가지 이점을 제공합니다:

- **코드 공유**: 패키지를 배포하지 않고도 애플리케이션 간 코드 공유 가능
- **일관된 의존성**: 모든 앱에서 단일 버전의 의존성 사용
- **원자적 변경**: 여러 패키지에 걸친 변경사항을 하나의 커밋으로 처리
- **간소화된 개발**: 하나의 저장소만 클론하고 유지보수

## 워크스페이스 설정 (Workspace Configuration)

프로젝트는 패키지 관리를 위해 **pnpm workspaces**를 사용합니다.

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

이 설정은 pnpm에게 `apps/`와 `packages/` 디렉토리의 모든 폴더를 별도의 워크스페이스로 취급하도록 지시합니다.

## 패키지 구조

### 애플리케이션 (`apps/`)

애플리케이션은 최종 사용자를 위한 제품입니다. 각 앱은 다음을 가집니다:

- **package.json** - 의존성 정의
- **vite.config.ts** - 빌드 설정
- **src/** - 소스 코드 디렉토리
- **dist/** - (생성됨) 프로덕션 빌드 디렉토리

예시 구조:

```
apps/builder/
├── src/
│   ├── components/
│   ├── routes/
│   ├── store/
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### 공유 패키지 (`packages/`)

공유 패키지는 애플리케이션 간 재사용 가능한 코드를 제공합니다.

#### shared-types

TypeScript 타입 정의와 Zod 스키마.

```typescript
// packages/shared-types/src/process.ts
export interface Process {
  id: string;
  name: string;
  steps: Step[];
}
```

앱에서 사용하기:

```typescript
import type { Process } from '@task-process/shared-types';
```

#### shared-ui

여러 앱에서 사용되는 React 컴포넌트.

```typescript
// packages/shared-ui/src/Button.tsx
export function Button({ children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>;
}
```

사용 방법:

```typescript
import { Button } from '@task-process/shared-ui';
```

#### shared-utils

유틸리티 함수와 헬퍼.

```typescript
// packages/shared-utils/src/format.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}
```

사용 방법:

```typescript
import { formatDate } from '@task-process/shared-utils';
```

## 의존성 관리 (Dependency Management)

### 워크스페이스 의존성

package.json에서 `workspace:*` 프로토콜 사용:

```json
{
  "dependencies": {
    "@task-process/shared-types": "workspace:*",
    "@task-process/shared-ui": "workspace:*"
  }
}
```

이를 통해 개발 중에 로컬 패키지가 링크됩니다.

### 외부 의존성

외부 의존성은 가능한 경우 루트 레벨에서 관리:

```json
{
  "pnpm": {
    "overrides": {
      "react": "19.2.3",
      "react-dom": "19.2.3"
    }
  }
}
```

## 빌드 시스템 (Build System)

### Turbo 설정

Turbo는 모노레포 전체의 빌드를 조율합니다:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 빌드 순서

1. **shared-types**가 먼저 빌드됨 (다른 패키지가 의존)
2. **shared-ui**와 **shared-utils**가 다음에 빌드
3. **Applications**가 마지막에 빌드

모든 빌드 실행:

```bash
pnpm build
```

특정 앱 실행:

```bash
pnpm --filter @task-process/builder build
```

## 개발 워크플로우

### 의존성 설치

```bash
# 모든 의존성 설치
pnpm install

# 특정 패키지에 의존성 추가
pnpm --filter @task-process/builder add lucide-react
```

### 개발 서버 실행

```bash
# 모든 개발 서버 시작
pnpm dev

# 특정 앱 시작
pnpm --filter @task-process/builder dev
```

### 타입 체크

```bash
# 모든 패키지 타입 체크
pnpm type-check

# 특정 패키지 타입 체크
pnpm --filter @task-process/shared-types type-check
```

## 모범 사례 (Best Practices)

### 1. 워크스페이스 참조 사용

내부 패키지에는 항상 워크스페이스 참조를 사용하세요:

```json
"@task-process/shared-types": "workspace:*"
```

### 2. 공유 패키지를 먼저 빌드

앱 작업 전에 공유 패키지가 빌드되었는지 확인:

```bash
pnpm --filter @task-process/shared-types build
```

### 3. 순환 의존성 방지

패키지 간 순환 의존성을 만들지 마세요:

```
❌ shared-types → shared-ui → shared-types
✅ shared-types → shared-ui
```

### 4. 버전 일관성 유지

pnpm overrides를 사용하여 일관된 버전 보장:

```json
{
  "pnpm": {
    "overrides": {
      "typescript": "5.7.2"
    }
  }
}
```

### 5. 경로 별칭은 신중하게 사용

명확성을 위해 경로 별칭보다 명시적 import를 선호:

```typescript
// ✅ 좋음
import { Process } from '@task-process/shared-types';

// ❌ 피하기
import { Process } from '@/types';
```

## 일반적인 작업

### 새 패키지 추가

1. `packages/`에 디렉토리 생성
2. `@task-process/` 스코프로 `package.json` 추가
3. `pnpm-workspace.yaml`에 추가 (`packages/*`로 자동)
4. `pnpm install` 실행

### 새 앱 추가

1. `apps/`에 디렉토리 생성
2. `package.json`, `vite.config.ts` 등 추가
3. 워크스페이스 의존성 추가
4. `pnpm install` 실행

### 의존성 업데이트

```bash
# 모든 의존성 업데이트
pnpm update

# 특정 의존성 업데이트
pnpm update react react-dom
```

## 문제 해결 (Troubleshooting)

### 모듈을 찾을 수 없음

모듈을 찾을 수 없다는 오류가 나오면:

1. 공유 패키지가 빌드되었는지 확인: `pnpm build`
2. node_modules 정리: `pnpm clean && pnpm install`
3. IDE에서 TypeScript 서버 재시작

### 타입 오류

TypeScript가 타입을 찾을 수 없으면:

1. shared-types 빌드: `pnpm --filter @task-process/shared-types build`
2. tsconfig.json 참조 확인
3. IDE 재시작

### 빌드 실패

빌드가 실패하면:

1. 빌드 순서 확인 (공유 패키지 먼저)
2. Turbo 캐시 정리: `rm -rf .turbo`
3. 클린 빌드 실행: `pnpm clean && pnpm install && pnpm build`

---

다음으로, 타입 시스템과 모노레포 전체에서 타입을 공유하는 방법을 알아봅니다.
