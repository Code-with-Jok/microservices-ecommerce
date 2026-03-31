# Hướng dẫn sử dụng Fastify trong Microservices ⚡

Chào mừng bạn đến với phần hướng dẫn về **Fastify**. Trong dự án này, chúng ta chọn Fastify làm framework nền tảng cho các microservices mới (như `order-service`) nhờ tốc độ vượt trội và khả năng bảo mật tốt ngay từ khâu kiểm tra dữ liệu.

---

## 1. Tại sao dùng Fastify thay vì Express? (So sánh thực tế)

Để các bạn Intern dễ hình dung, hãy xem sự khác biệt khi xử lý một request **Tạo đơn hàng (Create Order)**:

### 🔴 Với Express (Cách truyền thống)

Express rất linh hoạt nhưng bạn phải tự cài thêm thư viện để kiểm tra dữ liệu (như `joi` hoặc `express-validator`).

```typescript
// Express + express-validator
app.post(
  "/orders",
  [body("amount").isNumeric(), body("productId").isString()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Logic xử lý...
    res.send({ ok: true });
  }
);
```

_Nhược điểm: Code bị dài dòng, việc validate tách rời khỏi tài liệu API._

### 🟢 Với Fastify (Cách hiện đại)

Fastify tích hợp sẵn **JSON Schema**. Bạn chỉ cần khai báo "khuôn mẫu" dữ liệu, Fastify sẽ tự động làm mọi thứ.

```typescript
// Fastify với JSON Schema tích hợp sẵn
fastify.post(
  "/orders",
  {
    schema: {
      body: {
        type: "object",
        required: ["amount", "productId"],
        properties: {
          amount: { type: "number" },
          productId: { type: "string" },
        },
      },
    },
  },
  async (request, reply) => {
    // Bạn KHÔNG CẦN check lỗi ở đây, Fastify đã chặn ở cửa nếu dữ liệu sai!
    // Logic xử lý...
    return { ok: true };
  }
);
```

_Ưu điểm: Code cực gọn, bảo mật "tận răng" và tốc độ thực thi nhanh hơn **2-4 lần** so với Express._

---

## 2. Các điểm mạnh khác

- **Hiệu năng (Performance)**: Fastify được tối ưu hóa cực sâu cho Node.js, xử lý hàng vạn request mỗi giây với độ trễ cực thấp.
- **Hệ sinh thái Plugin**: Trong Express, bạn dùng Middleware. Trong Fastify, mọi thứ là Plugin. Điều này giúp code không bị phụ thuộc chéo (decoupled) và rất dễ bảo trì.
- **Logger xịn**: Fastify đi kèm `pino` - một logger siêu nhanh, giúp bạn theo dõi lỗi mà không làm chậm server.

---

## 3. Nhược điểm và Nguy cơ tiềm tàng (Cần lưu ý) ⚠️

Mặc dù Fastify rất mạnh, nhưng khi làm việc với nó, chúng ta (đặc biệt là các bạn Intern) cần chú ý các điểm sau:

1.  **Đường cong học tập (Learning Curve)**:
    - Fastify phức tạp hơn Express một chút. Bạn cần hiểu về **Lifecycle Hooks** (onRoute, preHandler, ...) và cách hoạt động của hệ thống Plugin.
    - _Nguy cơ_: Nếu không hiểu kỹ, bạn có thể đặt logic sai chỗ trong lifecycle, dẫn đến bug khó tìm.

2.  **Sự chặt chẽ của Schema**:
    - Fastify cực kỳ nghiêm ngặt. Nếu bạn định nghĩa schema nhưng gửi thiếu một trường, server sẽ trả về lỗi 400 ngay.
    - _Nguy cơ_: Đôi khi client sẽ khó debug vì nhận được lỗi 400 mà không biết tại sao (nếu chúng ta không cấu hình báo lỗi chi tiết).

3.  **Hệ sinh thái Plugin**:
    - Tuy đang phát triển nhanh, nhưng số lượng thư viện "may sẵn" cho Fastify vẫn ít hơn so với kho tàng khổng lồ của Express.
    - _Nguy cơ_: Có những thư viện middleware cũ của Express sẽ không hoạt động trực tiếp được trên Fastify (cần dùng `fastify-express` để bọc lại).

4.  **Xung đột tên gọi (Decoration Collision)**:
    - Khi bạn dùng `fastify.decorate()` để thêm một function vào server, nếu hai plugin cùng đặt tên giống nhau, server sẽ bị lỗi khi khởi động.
    - _Nguy cơ_: Trong các dự án lớn, việc quản lý tên gọi các plugin dùng chung cần hết sức cẩn thận.

---

## 4. Cách khởi tạo một Service với Fastify

Trong dự án `apps/order-service`, cấu hình cơ bản sẽ như sau:

```typescript
import Fastify from "fastify";

const fastify = Fastify({
  logger: true, // Bật log để debug dễ dàng
});

const start = async () => {
  try {
    await fastify.listen({ port: 8000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
```

---

## 5. Cấu trúc và Quy tắc (Best Practices)

### Sử dụng TypeScript

Mọi service đều phải kế thừa cấu hình TypeScript chung từ `@repo/typescript-config`. Hãy đảm bảo file `tsconfig.json` của bạn có nội dung:

```json
{
  "extends": "@repo/typescript-config/base.json"
}
```

---

## 6. Lưu ý cho Intern

- **Đừng dùng `console.log`**: Hãy dùng `fastify.log.info()` hoặc `fastify.log.error()`.
- **Validation là bắt buộc**: Luôn viết `schema` cho các route nhận dữ liệu từ client. Đây là lớp bảo vệ đầu tiên của hệ thống chúng ta.

Hy vọng phần so sánh này giúp bạn hiểu rõ lý do tại sao chúng ta ưu tiên Fastify cho các Microservices cần hiệu năng cao! 🚀
