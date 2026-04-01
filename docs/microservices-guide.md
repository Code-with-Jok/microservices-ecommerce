# Microservices Development Guide: Step-by-Step

Tài liệu này hướng dẫn cách triển khai một Microservice mới trong dự án **Microservices Ecommerce**, đảm bảo tính nhất quán về cấu trúc và tích hợp Clerk Auth cũng như Swagger.

---

## 1. Cài đặt & Thiết lập (Install & Setup)

### Bước 1: Cài đặt thư viện
Hãy chọn lệnh cài đặt tương ứng với framework bạn sử dụng:

| Framework | Lệnh cài đặt |
| :--- | :--- |
| **Express** | `pnpm add express @clerk/express swagger-jsdoc @types/swagger-jsdoc` |
| **Hono** | `pnpm add hono @hono/node-server @hono/clerk-auth @hono/swagger-ui` |
| **Fastify** | `pnpm add fastify @clerk/fastify @fastify/swagger @fastify/swagger-ui` |

### Bước 2: Cấu hình Biến môi trường (.env)
Tạo tệp `.env` tại thư mục gốc của service và thêm các khóa từ [Clerk Dashboard](https://dashboard.clerk.com/):

```env
CLERK_PUBLISHABLE_KEY=<YOUR_CLERK_PUBLISHABLE_KEY>
CLERK_SECRET_KEY=<YOUR_CLERK_SECRET_KEY>
PORT=800x
```

### Bước 3: Đăng ký Clerk Middleware/Plugin
Việc đăng ký này giúp framework nhận diện được session của người dùng.

- **Express**: `app.use(clerkMiddleware())`
- **Hono**: `app.use("*", clerkMiddleware())`
- **Fastify**: `fastify.register(clerkPlugin)`

---

## 2. Cấu trúc Mô-đun (Module Structure)
Mỗi service nên có cấu trúc thư mục như sau để dễ bảo trì và mở rộng:

```text
src/
├── config/             # Cấu hình Swagger, OpenAPI JSON
├── middleware/         # Auth Middleware/Hook (Xử lý logic userId)
├── routes/             # Định tuyến API (Versioning V1)
│   ├── index.ts        # Gom tất cả các router con
│   └── resource.routes.ts # Logic router cho tài nguyên cụ thể
├── app.ts              # Khởi tạo instance framework (App Setup)
└── index.ts            # Entry point (Server listener)
```

---

## 3. Triển khai Step-by-Step

### Bước 1: Tạo Auth Middleware/Hook
Mục tiêu là trích xuất `userId` và gán vào `request` để sử dụng ở các bước sau.

- **Fastify**: Tạo `preHandler` hook.
```typescript
const { isAuthenticated, userId } = getAuth(request);
if (!isAuthenticated) return reply.code(401).send({ error: "Unauthorized" });
request.userId = userId;
```

### Bước 2: Định nghĩa API Route
Sử dụng tiền tố `/api/v1` để quản lý phiên bản API.

### Bước 3: Cấu hình Swagger UI
Luôn gắn Swagger UI tại `/docs` và cấu hình `servers` URL trỏ đến `/api/v1`.

### Bước 4: App Setup (`app.ts`)
Gom tất cả các plugin, middleware và routes vào đây. Đây là nơi bạn cấu hình tính năng cho ứng dụng.

### Bước 5: Server Entry (`index.ts`)
Chỉ chứa logic khởi chạy server (`listen` hoặc `serve`) để giữ cho ứng dụng gọn gàng.

---

## 4. Đặc thù từng Framework

> [!TIP]
> **Fastify**: Luôn đăng ký route dưới dạng plugin (`fastify.register(plugin, { prefix: '/...' })`) để đạt được hiệu năng tốt nhất.
> **Hono**: Sử dụng `c.set('userId', ...)` để truyền dữ liệu giữa middleware và handler thông qua Context.
> **Express**: Sử dụng Module Augmentation để mở rộng interface `Request` của Express.

---

*Tài liệu này được soạn thảo dựa trên các Best Practices từ Clerk và cấu trúc chuẩn của hệ thống Microservices.*
