# Hướng dẫn sử dụng Hono trong Microservices 🏮

Chào mừng bạn đến với hướng dẫn về **Hono**. Trong dự án này, chúng ta sử dụng Hono cho các dịch vụ nhẹ và cần khả năng tương thích cao (như `payment-service`). Hono nổi tiếng với kích thước siêu nhỏ, tốc độ cực nhanh và khả năng chạy trên mọi môi trường (Node.js, Cloudflare Workers, Bun, v.v.).

---

## 1. Tại sao dùng Hono thay vì Express? (So sánh thực tế)

Hono được xây dựng dựa trên các chuẩn Web chuẩn mực (Standard Web APIs), giúp code của bạn hiện đại và sạch sẽ hơn.

### 🔴 Với Express (Cách truyền thống)
Express dựa trên các đối tượng `req` và `res` riêng biệt của Node.js.

```typescript
app.get("/hello", (req, res) => {
  res.status(200).send("Hello World");
});
```

### 🟢 Với Hono (Cách hiện đại)
Hono sử dụng một đối tượng **Context (`c`)** duy nhất, giúp quản lý cả Request, Response và Biến môi trường một cách tập trung.

```typescript
app.get("/hello", (c) => {
  return c.text("Hello World", 200);
});
```

**Ưu điểm vượt trội của Hono:**
- **Siêu nhẹ**: File bundle của Hono chỉ khoảng **~14KB**, trong khi Express là ~50KB+.
- **Tốc độ**: Hono sử dụng bộ định tuyến (Router) cực nhanh, tối ưu hóa cho các hệ thống có lưu lượng lớn.
- **TypeScript tuyệt vời**: Hono được viết 100% bằng TypeScript, mang lại khả năng gợi ý code (Intellisense) tốt nhất hiện nay.

---

## 2. Cách khởi tạo một Service với Hono

Trong dự án của chúng ta (như `apps/payment-service`), vì chạy trên môi trường Node.js nên chúng ta sử dụng bộ chuyển đổi `@hono/node-server`.

```typescript
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve({
  fetch: app.fetch,
  port: 8002, // Port riêng cho Payment Service
}, (info) => {
  console.log(`Payment service is running on http://localhost:${info.port}`);
});
```

---

## 3. Ưu và Nhược điểm ⚖️

### ✅ Ưu điểm:
1.  **Edge Ready**: Code Hono có thể chạy trên Cloudflare Workers hoặc AWS Lambda mà không cần sửa đổi gì.
2.  **Built-in Middleware**: Có sẵn các middleware phổ biến như CORS, Logger, Basic Auth mà không cần cài thêm library ngoài.
3.  **Tốc độ phát triển**: Nhờ TypeScript và Context API, bạn sẽ viết code nhanh hơn và ít lỗi hơn.

### ⚠️ Nhược điểm & Rủi ro:
1.  **Hệ sinh thái Node.js truyền thống**: Một số thư viện Node.js cũ (dựa trên luồng stream của Node) có thể cần cấu hình thêm để chạy mượt với Hono.
2.  **Cộng đồng**: Dù đang lớn mạnh rất nhanh, nhưng cộng đồng Hono vẫn chưa thể "khổng lồ" bằng Express.

---

## 4. Các lệnh thường dùng

- `pnpm dev`: Chạy service với `tsx` và tự động cập nhật khi sửa code.
- `pnpm build`: Biên dịch TypeScript sang JavaScript trong thư mục `dist/`.
- `pnpm start`: Chạy bản build chính thức trong môi trường production.

---

## 5. Lưu ý cho Intern
- **Sử dụng Context**: Luôn khai thác đối tượng `c` để lấy dữ liệu. Ví dụ: `c.req.query()`, `c.req.json()`.
- **Hono Middleware**: Hãy sử dụng các middleware có sẵn của Hono (`hono/cors`, `hono/logger`) để giữ cho project nhẹ nhất có thể.

Hy vọng bạn sẽ thích sự tinh gọn và mạnh mẽ của Hono! 🏮
