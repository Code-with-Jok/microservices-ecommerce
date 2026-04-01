# Hướng dẫn sử dụng Express trong Microservices 🚀

Chào mừng bạn đến với hướng dẫn về **Express.js**. Trong dự án này, chúng ta sử dụng Express cho `product-service`. Đây là framework phổ biến nhất trong hệ sinh thái Node.js, rất phù hợp cho các dịch vụ cần sự ổn định và có nhiều thư viện hỗ trợ.

---

## 1. Tại sao vẫn dùng Express? (So sánh thực tế)

Mặc dù chúng ta có Fastify (tốc độ) và Hono (siêu nhẹ), Express vẫn được giữ lại vì:

### 🔴 Với Hono/Fastify (Hiện đại)
Sử dụng các chuẩn mới, đôi khi đòi hỏi bạn phải học cách tiếp cận khác (như Context API trong Hono).

### 🟢 Với Express (Quen thuộc & Đầy đủ)
Express sử dụng mô hình Middleware truyền thống với `req` (Request) và `res` (Response). Hầu như mọi thư viện Node.js đều có bản hướng dẫn cho Express.

```typescript
app.get("/products", (req, res) => {
  res.status(200).json({ items: [] });
});
```

**Ưu điểm của Express:**
- **Cộng đồng khổng lồ**: Gặp lỗi gì chỉ cần Google là có đáp án ngay.
- **Dễ học**: Phù hợp cho người mới bắt đầu.
- **Middleware phong phú**: Có hàng ngàn middleware có sẵn (CORS, Auth, Validation...).

---

## 2. Cách khởi tạo một Service với Express

Trong `apps/product-service`, chúng ta cấu hình Express kết hợp với TypeScript:

```typescript
import express, { Request, Response } from "express";

const app = express();

app.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({ status: "ok" });
});

app.listen(8000, () => {
  console.log("Product service is running on port 8000");
});
```

---

## 3. Ưu và Nhược điểm ⚖️

### ✅ Ưu điểm:
1.  **Tính ổn định**: Express đã tồn tại hơn 10 năm và được dùng bởi các tập đoàn lớn nhất thế giới.
2.  **Linh hoạt**: Bạn có thể cấu hình Express theo bất kỳ phong cách nào bạn muốn.
3.  **Tài liệu phong phú**: Không bao giờ lo thiếu hướng dẫn.

### ⚠️ Nhược điểm & Rủi ro:
1.  **Tốc độ**: Express chậm hơn Fastify khoảng 2-3 lần trong các bài test hiệu năng cực hạn.
2.  **Async Support**: Express 4.x không hỗ trợ tốt async error, nhưng chúng ta đang dùng Express 5.x nên vấn đề này đã được cải thiện.
3.  **Kích thước**: Nặng hơn Hono đáng kể.

---

## 4. Tích hợp Swagger (Mới) 📑

Chúng ta sử dụng `swagger-jsdoc` để viết tài liệu trực tiếp trong code bằng annotation:

```typescript
/**
 * @openapi
 * /health:
 *   get:
 *     description: Get service health status
 *     responses:
 *       200:
 *         description: Successful response
 */
```

---

## 5. Lưu ý cho Intern
- **Luôn dùng Async/Await**: Tránh dùng callback truyền thống để code sạch và dễ bảo trì.
- **Error Handling**: Đừng quên dùng `try-catch` hoặc các middleware xử lý lỗi tập trung.

Chúc bạn làm chủ được framework "quốc dân" này! 🚀
