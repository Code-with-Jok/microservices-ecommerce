# Master Guide: Triển khai Prisma trong Monorepo (Turborepo & pnpm)

Hướng dẫn này trình bày chi tiết từng bước (step-by-step) về cách thiết lập và vận hành hệ thống Database tập trung cho các microservices, sử dụng Prisma 7, Turborepo và pnpm.

## 1. Tổng quan Kiến trúc

Chúng ta tách biệt logic database thành một package riêng biệt tại `packages/product-db` (định danh là `@repo/product-db`)`product-service`, sẽ tiêu thụ database thông qua package này thay vì cài trực tiếp `@prisma/client`.

## 2. Các Bước Triển Khai Chi Tiết

### Bước 1: Cấu hình `package.json` của `@repo/product-db`

File này định nghĩa các scripts và cách package này "phơi" dữ liệu ra bên ngoài.

```json
{
  "name": "@repo/product-db",
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^7.6.0",
    "@prisma/adapter-pg": "^7.6.0",
    "pg": "^8.20.0"
  }
}
```

### Bước 2: Cấu hình Prisma Schema (`prisma/schema.prisma`)

Điểm quan trọng nhất là `output` của `generator client`. Chúng ta cần đẩy nó ra một thư mục cục bộ thay vì `node_modules` để pnpm có thể xử lý chính xác.

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Bước 3: Cấu hình Prisma Config (`prisma.config.ts`) - Mới trong Prisma 7

Sử dụng file này để quản lý biến môi trường một cách minh bạch hơn:

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL") || env("DATABASE_URL"),
  },
});
```

### Bước 4: Triển khai Client Singleton (`src/client.ts`)

Để tránh lỗi "Too many connections" khi dev (Hot Reloading), chúng ta khởi tạo `PrismaClient` một lần duy nhất.

```typescript
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

// 1. Cấu hình Adapter (tùy chọn nếu dùng Postgres truyền thống)
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// 2. Singleton pattern
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Bước 5: Xuất (Export) Client và Types (`src/index.ts`)

Đây là bước cuối cùng để apps có thể dùng `@repo/product-db`.

```typescript
export { prisma } from "./client.js"; // Xuất instance
export * from "../generated/prisma/client.js"; // Xuất types (User, Product, ...)
```

## 3. Tối ưu hóa với Turborepo (`turbo.json`)

Chúng ta đã cấu hình Turbo để xử lý việc "Generate" thông minh và Cache cực nhanh.

### Cấu hình Task:

- **`globalEnv`**: Đã thêm `DATABASE_URL` và `DIRECT_URL` để Turbo nhận diện thay đổi môi trường.
- **`db:generate`**:
  - **Inputs**: Chỉ theo dõi file `prisma/schema.prisma`. Nếu file này không đổi, Turbo sẽ không chạy lại lệnh generate.
  - **Outputs**: Lưu thư mục `generated/**` vào bộ nhớ đệm (Cache hit).
- **`db:migrate`**: Tự động chạy `db:generate` trước khi migrate để đảm bảo client đồng bộ.

```json
{
  "tasks": {
    "db:generate": {
      "inputs": ["prisma/schema.prisma"],
      "outputs": ["generated/**"],
      "cache": true
    },
    "db:migrate": {
      "dependsOn": ["db:generate"],
      "cache": false
    }
  }
}
```

## 4. Quy trình làm việc hàng ngày

### 1. Thêm Model mới

1. Chỉnh sửa `schema.prisma`.
2. Chạy migrate (tại root): `pnpm turbo run db:migrate`.
3. Turbo sẽ tự động: `Generate Client` -> `Lưu Cache` -> `Chạy Migrate`.

### 2. Sử dụng trong Service khác

```typescript
import { prisma, Product } from "@repo/product-db";

async function getProducts() {
  const allProducts: Product[] = await prisma.product.findMany();
  return allProducts;
}
```

---

> [!IMPORTANT]
> Với **Prisma 7**, lệnh `migrate dev` không còn tự động chạy `generate`. Tuy nhiên, nhờ cấu hình `dependsOn` trong `turbo.json` ở trên, chúng ta đã tự động hóa hoàn toàn quy trình này.
