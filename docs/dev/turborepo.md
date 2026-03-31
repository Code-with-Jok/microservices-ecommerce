# Hướng dẫn Turborepo cho Intern Developers 🚀

Chào mừng bạn đến với dự án! Khi làm việc trong một **Monorepo** (một kho lưu trữ chứa nhiều ứng dụng và thư viện), tốc độ build và quản lý sự phụ thuộc là hai thách thức lớn nhất. Đó là lý do chúng ta sử dụng **Turborepo** (gọi tắt là Turbo).

Tài liệu này sẽ giúp bạn hiểu nhanh về cơ chế hoạt động của Turbo trong dự án này.

---

## 1. Monorepo là gì?
Trong cấu trúc thư mục của chúng ta:
- `apps/`: Chứa các ứng dụng chạy độc lập (như Web, Docs, Admin).
- `packages/`: Chứa các bộ code dùng chung (UI components, Config, Types, Utils).

Turborepo là công cụ giúp quản lý việc chạy các script (build, dev, lint) trên tất cả các thư mục này một cách thông minh nhất.

---

## 2. Cơ chế Pipeline (Luật chơi của Turbo)
Tất cả cấu hình nằm trong file `turbo.json` ở thư mục gốc.

### Phụ thuộc giữa các Task (`dependsOn`)
Hãy nhìn vào ví dụ này trong dự án của chúng ta:
```json
"build": {
  "dependsOn": ["^build"]
}
```
- **Ký hiệu `^`**: Nghĩa là "dependencies".
- **Ví dụ**: Nếu ứng dụng `web` (trong `apps/`) sử dụng thư viện `ui` (trong `packages/`), Turbo sẽ đảm bảo `ui` được build xong xuôi rồi mới bắt đầu build `web`. 
- **Lợi ích**: Tránh lỗi build khi code chưa kịp "nấu chín".

---

## 3. Cơ chế Caching (Tại sao nó lại nhanh đến thế?) ⚡

Turbo lưu lại "dấu vân tay" (hash) của tất cả các file đầu vào. Khi bạn chạy một lệnh như `pnpm build`:

1. **Check Cache**: Nó kiểm tra xem hash hiện tại có khớp với lần build trước không.
2. **Cache Hit**: Nếu khớp (bạn không sửa gì), nó sẽ **không build lại**. Nó chỉ đơn giản là bốc kết xuất cũ trong ổ cứng ra và dán vào thư mục kết quả.
3. **Cache Miss**: Nếu bạn sửa code, nó chỉ build lại đúng phần bị sửa.

> [!TIP]
> Bạn sẽ thấy thông báo `>>> FULL TURBO` trong terminal. Điều đó có nghĩa là Turbo đã lấy toàn bộ kết quả từ cache, giúp bạn tiết kiệm rất nhiều thời gian.

---

## 4. Giải thích Input và Output
Trong `turbo.json`, chúng ta có cấu hình sau cho lệnh `build`:

```json
"inputs": ["$TURBO_DEFAULT$", ".env*"],
"outputs": [".next/**", "!.next/cache/**"]
```

- **Inputs**: Là những thứ "khi bị đổi thì phải build lại". Ngoài mã nguồn mặc định, chúng ta theo dõi thêm cả các file `.env`. Nếu bạn đổi API_URL trong `.env`, Turbo sẽ biết để build lại App.
- **Outputs**: Sau khi build xong, thư mục `.next/` chứa sản phẩm cuối cùng. Turbo sẽ nén thư mục này lại để làm cache. (Chúng ta bỏ qua `.next/cache/` vì nó rất nặng và không cần thiết để lưu trữ).

---

## 4. Luồng chạy của một câu lệnh (Execution Flow) 🌊

Khi bạn gõ một lệnh như `pnpm build`, Turbo không chỉ đơn thuần là chạy script. Nó thực hiện các bước sau:

1.  **Xây dựng đồ thị phụ thuộc (Graphing)**: Turbo quét toàn bộ dự án để biết app nào đang dùng package nào. Nó tạo ra một "bản đồ" (như cái `--graph` bạn đã xem) để biết thứ tự chạy đúng.
2.  **Tính toán Mã băm (Hashing)**:
    *   Turbo nhìn vào các `inputs` (code, file `.env`, dependencies).
    *   Nó tạo ra một mã băm (ví dụ: `abc123xyz`) đại diện cho trạng thái hiện tại của code đó.
3.  **Kiểm tra Kho lưu trữ (Cache Lookup)**:
    *   Nó tìm trong thư mục `.turbo/cache` xem đã từng có mã băm `abc123xyz` chưa.
    *   **Nếu có (Cache Hit)**: Nó ngay lập tức bốc file đã build sẵn ra và in lại log cũ. Bạn thấy `FULL TURBO`.
    *   **Nếu không (Cache Miss)**: Nó chuyển sang bước tiếp theo.
4.  **Thực thi (Execution)**:
    *   Turbo chạy các script trong `package.json` của từng app/package.
    *   Nó chạy **song song** tối đa có thể. Ví dụ: Nếu `docs` và `web` không liên quan đến nhau, nó sẽ chạy cả hai cùng lúc để tiết kiệm thời gian.
5.  **Lưu kết quả (Artifact Indexing)**:
    *   Sau khi build xong, nó lấy các file trong `outputs` (như thư mục `.next/`) và nén lại cùng với mã băm vừa tính.
    *   Lần sau bạn chạy lại, nó sẽ quay lại bước 3 và "ăn sẵn" kết quả này.

---

## 5. Các lệnh thường dùng

Bạn nên chạy các lệnh này từ **thư mục gốc** của dự án. Turbo sẽ tự động điều phối công việc cho các apps và packages.

### Lệnh cơ bản
- `pnpm dev`: Chạy tất cả ứng dụng ở chế độ hot-reload.
- `pnpm build`: Build toàn bộ dự án.
- `pnpm lint`: Kiểm tra lỗi code style toàn bộ monorepo.

### Lệnh nâng cao (Rất quan trọng)
Turbo cung cấp các "flag" để bạn làm việc chính xác hơn:

1. **Lọc dự án (`--filter`)**:
   Nếu bạn chỉ muốn chạy dev cho app `docs`, thay vì chạy tất cả:
   ```bash
   pnpm turbo run dev --filter=docs
   ```
   *Mẹo: Bạn có thể lọc theo thư mục hoặc theo tên trong package.json.*

2. **Ép buộc build lại (`--force`)**:
   Khi bạn nghi ngờ cache bị lỗi và muốn Turbo build lại từ đầu bất chấp cache:
   ```bash
   pnpm turbo run build --force
   ```

3. **Chạy nhiều tác vụ cùng lúc**:
   Bạn có thể kết hợp build, lint và test trong một câu lệnh:
   ```bash
   pnpm turbo run build lint test
   ```

4. **Xem sơ đồ phụ thuộc (`--graph`)**:
   Để hiểu app nào đang gọi package nào:
   ```bash
   npx turbo run build --graph
   ```
   Lệnh này tạo ra một file mô tả cấu trúc cây phụ thuộc của dự án.

### Ví dụ chi tiết luồng chạy của các lệnh cơ bản

Để giúp bạn hình dung rõ hơn, dưới đây là cách Turbo xử lý 3 lệnh quan trọng nhất:

#### 1. Lệnh `pnpm build` (Luồng có phụ thuộc)
- **Bước 1**: Turbo quét toàn bộ dự án, thấy `apps/web` cần `packages/ui`.
- **Bước 2**: Nó kiểm tra cache của `packages/ui`. Nếu có, nó lấy ra luôn. Nếu không, nó build `ui`.
- **Bước 3**: Sau khi `ui` build xong, nó mới bắt đầu build `web`.
- **Kết quả**: Bạn luôn có bản build an toàn và chính xác.

#### 2. Lệnh `pnpm lint` (Luồng song song)
- **Bước 1**: Turbo thấy lệnh `lint` không phụ thuộc vào gì cả (trong file `turbo.json`).
- **Bước 2**: Nó kích hoạt `lint` của tất cả các folder `apps/` và `packages/` **cùng một lúc**.
- **Kết quả**: Tốc độ kiểm tra lỗi cực nhanh vì tận dụng hết các nhân CPU của máy bạn.

#### 3. Lệnh `pnpm dev` (Luồng thời gian thực)
- **Bước 1**: Turbo thấy `dev` được đánh dấu là `cache: false` và `persistent: true`.
- **Bước 2**: Nó chạy tất cả các lệnh `dev` song song và giữ kết nối mở.
- **Kết quả**: Bạn có thể sửa code ở bất kỳ đâu và thấy thay đổi ngay lập tức trên trình duyệt.

> [!IMPORTANT]
> **Đừng bao giờ** build thủ công bằng cách `cd` vào từng app trừ khi có lý do đặc biệt. Hãy luôn đứng ở thư mục gốc và dùng `--filter` nếu bạn muốn tập trung vào một app cụ thể. Điều này đảm bảo các package liên quan luôn được cập nhật đúng bản build mới nhất.

---

## 7. Tại sao một lệnh ở thư mục gốc lại chạy được cho toàn bộ? 🤔

Đây là câu hỏi mà các bạn Intern thường thắc mắc nhất. Cơ chế đằng sau gồm 3 bước:

1.  **Quét toàn bộ (Discovery)**: Turbo dựa vào file `pnpm-workspace.yaml` để biết tất cả các "vùng đất" (apps & packages) đang tồn tại trong dự án.
2.  **Khớp lệnh (Task Matching)**: Khi bạn gõ `turbo run lint`, Turbo sẽ đi vào từng folder, mở file `package.json` của folder đó lên. Nếu thấy có dòng `"lint": "..."` trong phần `scripts`, nó sẽ ghi nhớ để chạy.
3.  **Điều phối (Orchestration)**: Thay vì bạn phải `cd` vào từng folder cực nhọc, Turbo sẽ tự động kích hoạt các lệnh đó. Nó có thể chạy 10 App cùng lúc nếu máy bạn đủ mạnh, hoặc chạy theo thứ tự ưu tiên nếu bạn cấu hình trong `turbo.json`.

**Tóm lại**: Turbo đóng vai trò như một "người quản lý" biết rõ mọi ngóc ngách của dự án và thay mặt bạn thực hiện các lệnh lặp đi lặp lại một cách chuyên nghiệp.

---

## 8. Lời khuyên cho Intern
- **Khi bị lỗi build khó hiểu**: Thử chạy `pnpm clean` (nếu có) hoặc xóa thư mục `.turbo` ở gốc để xóa sạch cache và build lại từ đầu.
- **Xem sơ đồ phụ thuộc**: Bạn có thể chạy `npx turbo run build --graph` để xem một sơ đồ (file .dot hoặc .pdf) cho thấy các app đang phụ thuộc vào nhau như thế nào.

Hy vọng tài liệu này giúp bạn làm quen nhanh hơn với dự án! Có thắc mắc gì hãy hỏi Senior/Mentor nhé! 😉
