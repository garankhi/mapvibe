# Hướng dẫn phát triển MapVibe

> Tài liệu dành cho developer mới tham gia project. Đọc kỹ trước khi bắt đầu code.

---

## 1. Yêu cầu môi trường

| Công cụ | Phiên bản | Mục đích |
|---------|-----------|----------|
| **Node.js** | ≥ 20 LTS | Chạy admin, api, cdk |
| **npm** | ≥ 10 | Quản lý dependencies |
| **Flutter SDK** | ≥ 3.x | Phát triển mobile app |
| **AWS CLI v2** | latest | Tương tác với AWS |
| **AWS CDK CLI** | latest | Deploy infrastructure |
| **Git** | latest | Version control |

### Kiểm tra nhanh

```bash
node -v          # v20.x.x trở lên
npm -v           # 10.x.x trở lên
flutter --version
aws --version
```

---

## 2. Cài đặt project

```bash
# Clone repo
git clone <repo-url>
cd mapvibe

# Cài dependencies cho tất cả JS/TS workspaces (admin, api, cdk)
npm install

# Cài dependencies cho Flutter
cd apps/mobile
flutter pub get
cd ../..
```

> **Lưu ý:** `npm install` từ root sẽ tự động cài cho cả 3 workspace: `apps/admin`, `services/api`, `infra/cdk` nhờ cơ chế [NPM Workspaces](https://docs.npmjs.com/cli/using-npm/workspaces).

---

## 3. Cấu trúc project

```
mapvibe/
├── apps/
│   ├── mobile/          # Flutter mobile app (Android)
│   └── admin/           # React + TypeScript admin dashboard (Vite)
├── services/
│   └── api/             # TypeScript AWS Lambda microservices
├── infra/
│   └── cdk/             # AWS CDK infrastructure-as-code
├── docs/                # Tài liệu: PRD, architecture, hướng dẫn
├── package.json         # NPM Workspaces root config
├── .prettierrc          # Cấu hình format chung cho JS/TS
└── README.md            # Tổng quan project
```

### Ai làm gì ở đâu?

| Role | Folder chính | Stack |
|------|-------------|-------|
| Mobile dev | `apps/mobile/` | Flutter, Dart |
| Frontend dev | `apps/admin/` | React 19, TypeScript, Vite |
| Backend dev | `services/api/` | TypeScript, AWS Lambda |
| DevOps / Infra | `infra/cdk/` | AWS CDK, TypeScript |

**Mỗi người chỉ cần focus vào folder của mình.** Không cần hiểu hết toàn bộ repo để bắt đầu.

---

## 4. Các lệnh thường dùng

### 4.1 Chạy cho tất cả JS/TS workspaces (từ root)

```bash
npm run lint          # Lint tất cả workspaces
npm run format        # Format tất cả workspaces
npm run test          # Test tất cả workspaces
npm run build         # Build tất cả workspaces
```

### 4.2 Chạy cho từng workspace riêng lẻ

```bash
# Admin
npm run dev -w apps/admin         # Chạy dev server (port 3000)
npm run lint -w apps/admin        # Lint admin
npm run test -w apps/admin        # Test admin

# API
npm run lint -w services/api      # Lint api
npm run test -w services/api      # Test api
npm run build -w services/api     # Build (compile TS → JS vào dist/)

# CDK
npm run lint -w infra/cdk         # Lint cdk
npm run test -w infra/cdk         # Test cdk
npm run build -w infra/cdk        # Build cdk
```

### 4.3 Flutter (chạy trong `apps/mobile/`)

```bash
cd apps/mobile
flutter analyze       # Lint Dart code
dart format .         # Format code
flutter test          # Chạy unit/widget test
flutter run           # Chạy app trên emulator/device
```

---

## 5. Hệ thống test

### Tổng quan

| Workspace | Test framework | Loại test | File mẫu |
|-----------|---------------|-----------|-----------|
| `apps/admin` | Vitest + Testing Library | Component render test | `src/App.test.tsx` |
| `services/api` | Vitest | Unit test (Lambda handler) | `src/handlers/search.test.ts` |
| `infra/cdk` | Vitest + CDK Assertions | Infrastructure test (kiểm tra CloudFormation) | `test/mapvibe-stack.test.ts` |
| `apps/mobile` | Flutter Test | Widget test | `test/widget_test.dart` |

### Cách viết test

#### Admin — React component test

```tsx
// src/components/MyComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

#### API — Lambda handler test

```typescript
// src/handlers/my-handler.test.ts
import { describe, it, expect } from 'vitest';
import { handler } from './my-handler';

describe('myHandler', () => {
  it('returns 200 for valid request', async () => {
    const event = { body: JSON.stringify({ key: 'value' }) };
    const result = await handler(event as any);
    expect(result.statusCode).toBe(200);
  });

  it('returns 400 for invalid request', async () => {
    const result = await handler({ body: null } as any);
    expect(result.statusCode).toBe(400);
  });
});
```

#### CDK — Infrastructure test

```typescript
// test/my-stack.test.ts
import { describe, it, expect } from 'vitest';
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { MyStack } from '../lib/my-stack';

describe('MyStack', () => {
  const app = new cdk.App();
  const stack = new MyStack(app, 'TestStack', { stage: 'dev' });
  const template = Template.fromStack(stack);

  it('creates a DynamoDB table', () => {
    template.resourceCountIs('AWS::DynamoDB::Table', 1);
  });
});
```

#### Flutter — Widget test

```dart
// test/my_widget_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mapvibe_mobile/my_widget.dart';

void main() {
  testWidgets('shows title', (WidgetTester tester) async {
    await tester.pumpWidget(MyWidget());
    expect(find.text('Title'), findsOneWidget);
  });
}
```

### Quy tắc test

- ✅ **Mỗi handler/component mới PHẢI có ít nhất 1 file test**
- ✅ File test đặt cạnh file source: `my-handler.ts` → `my-handler.test.ts`
- ✅ Chạy `npm run test` trước khi tạo PR
- ❌ Không commit code mà test đang fail

---

## 6. Lint & Format

### Công cụ

| Workspace | Linter | Formatter | Config |
|-----------|--------|-----------|--------|
| `apps/admin` | ESLint (flat config) | Prettier | `eslint.config.mjs` + root `.prettierrc` |
| `services/api` | ESLint (flat config) | Prettier | `eslint.config.mjs` + root `.prettierrc` |
| `infra/cdk` | ESLint (flat config) | Prettier | `eslint.config.mjs` + root `.prettierrc` |
| `apps/mobile` | Dart Analyzer | `dart format` | `analysis_options.yaml` |

### Quy tắc

- Chạy **lint trước khi commit**: `npm run lint`
- Chạy **format trước khi commit**: `npm run format`
- CI sẽ chạy `npm run format:check` — nếu format sai sẽ fail build

---

## 7. Deploy

### Environments

| Stage | Mục đích | Ai deploy? |
|-------|----------|-----------|
| `dev` | Phát triển hàng ngày, debug | Developer |
| `staging` | Kiểm tra trước production | Tech Lead / CI |
| `prod` | Production | CI/CD only |

### Lệnh deploy

```bash
cd infra/cdk

# Deploy lên dev
npx cdk deploy --context stage=dev

# Deploy lên staging
npx cdk deploy --context stage=staging

# Xem diff trước khi deploy
npx cdk diff --context stage=dev
```

### Build API trước khi deploy

```bash
# CDK lấy code Lambda từ services/api/dist/
# Nên PHẢI build API trước khi deploy CDK
npm run build -w services/api
cd infra/cdk && npx cdk deploy --context stage=dev
```

---

## 8. Quy tắc quan trọng

### ⛔ KHÔNG dùng LocalStack

> **Tất cả development và testing PHẢI chạy trên AWS thật (dev/staging account).**
>
> LocalStack tạo ra sự khác biệt về hành vi so với AWS thật, gây ra bug khó debug.
> Với chiến lược aggressive caching và on-demand pricing, chi phí AWS dev rất thấp.

### ⛔ KHÔNG tạo abstraction sớm

- Viết code trực tiếp, đơn giản trước
- Chỉ refactor/abstract khi thấy pattern lặp lại **≥ 3 lần**
- Ưu tiên code dễ đọc, dễ split ticket

### ✅ Quy trình trước khi tạo PR

```bash
# 1. Format code
npm run format

# 2. Lint
npm run lint

# 3. Test
npm run test

# 4. Với Flutter
cd apps/mobile
dart format .
flutter analyze
flutter test
```

Nếu cả 4 bước trên đều pass → tạo PR.

---

## 9. Cấu trúc branch

```
main              ← production, chỉ merge qua PR
├── develop       ← branch phát triển chính
│   ├── feature/search-api
│   ├── feature/admin-dashboard
│   └── fix/login-bug
```

### Convention

- Feature: `feature/<tên-ngắn>`
- Bugfix: `fix/<tên-ngắn>`
- Hotfix: `hotfix/<tên-ngắn>`

---

## 10. Tài liệu tham khảo

| Tài liệu | Đường dẫn |
|-----------|-----------|
| Product Requirements | [MapVibe_PRD.md](./MapVibe_PRD.md) |
| System Architecture | [System_Architechture.png](./System_Architechture.png) |
| Git Handbook | [git_handbook.md](./git_handbook.md) |
| Root README | [README.md](../README.md) |
