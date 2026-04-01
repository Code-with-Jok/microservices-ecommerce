# Tài liệu API (API Documentation) 📑

Dự án này sử dụng **Swagger/OpenAPI** để tự động tài liệu hóa các API của từng microservice. Điều này giúp các lập trình viên Frontend và các thành viên khác trong team dễ dàng thử nghiệm và hiểu cấu trúc dữ liệu của API.

---

## 1. Truy cập Swagger UI

Mỗi service trong monorepo đều có một trang Swagger riêng chạy song song với server:

| Service | Framework | Swagger UI (Sử dụng trình duyệt) |
| :--- | :--- | :--- |
| **Product Service** | Express | [http://localhost:8000/docs](http://localhost:8000/docs) |
| **Order Service** | Fastify | [http://localhost:8001/docs](http://localhost:8001/docs) |
| **Payment Service** | Hono | [http://localhost:8002/docs](http://localhost:8002/docs) |

---

## 2. Cách sử dụng Swagger UI 🛠️

1.  **Exploration**: Xem danh sách tất cả các Route, Method (GET, POST...) và các tham số yêu cầu.
2.  **Try it out**: Nhấn nút **"Try it out"** ở góc phải mỗi route để thực hiện request thực tế đến server đang chạy.
3.  **Schema**: Xem cấu trúc chi thiết của dữ liệu đầu vào và đầu ra (JSON Schema).

---

## 3. Quy trình 3 bước dành cho Intern khi thêm API mới 🚀

Để đảm bảo API mới của bạn có đầy đủ tài liệu, hãy thực hiện theo quy trình sau:

1.  **Code Handler**: Viết logic xử lý (Controller/Handler) của bạn.
2.  **Define Schema/Doc**: Viết tài liệu OpenAPI ngay tại Route đó (tham khảo ví dụ bên dưới).
3.  **Verify**: Mở Swagger UI tương ứng, nhấn nút **"Try it out"** để chạy thử API mới.

---

## 4. Cách thêm tài liệu cho Route mới (Chi tiết mẫu)

Tùy vào service bạn đang làm việc, cú pháp khai báo sẽ khác nhau:

### 🟢 Product Service (Express.js)
Trong file `src/index.ts`, hãy thêm block comment JSDoc ngay phía trên route:

```typescript
/**
 * @openapi
 * /products:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     tags: [product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *     responses:
 *       201:
 *         description: Đã tạo thành công
 */
app.post("/products", (req, res) => {
  // Logic của bạn ở đây...
});
```

### ⚡ Order Service (Fastify)
Trong file `src/index.ts`, bạn khai báo `schema` trong đối mục config của route:

```typescript
fastify.post(
  "/orders",
  {
    schema: {
      summary: "Tạo đơn hàng mới",
      tags: ["order"],
      body: {
        type: "object",
        required: ["productId", "quantity"],
        properties: {
          productId: { type: "string" },
          quantity: { type: "number" },
        },
      },
      response: {
        201: {
          description: "Thành công",
          type: "object",
          properties: { orderId: { type: "string" } },
        },
      },
    },
  },
  async (request, reply) => {
    // Logic của bạn ở đây...
  }
);
```

### 🏮 Payment Service (Hono)
Hiện tại dự án đang sử dụng định nghĩa JSON trực tiếp. Bạn hãy thêm path mới vào route `/openapi.json`:

```typescript
// Trong app.get("/openapi.json", ...)
paths: {
  "/health": { ... },
  "/payments": {
    post: {
      summary: "Thanh toán",
      tags: ["payment"],
      responses: {
        200: { description: "Thành công" }
      }
    }
  }
}
```

---

## 5. Lưu ý cho Intern
- **Luôn cập nhật tài liệu**: Khi thêm một route mới, hãy dành thêm 2 phút để viết schema cho nó. Điều này giúp hệ thống của chúng ta chuyên nghiệp và dễ bảo trì hơn.
- **Validation**: Trong Fastify, schema này không chỉ để làm tài liệu mà còn được dùng để validate dữ liệu thực tế. Đừng bỏ qua lớp bảo vệ này!
- **Thử nghiệm**: Hãy luôn tự mình nhấn **"Try it out"** trên Swagger UI trước khi gửi Pull Request.

---
