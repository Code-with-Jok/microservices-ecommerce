# Clerk Authentication Integration

Tài liệu này hướng dẫn cách hệ thống Authentication của Clerk được cài đặt và tích hợp vào ứng dụng `apps/client` trong Monorepo này.

## 0. Cài đặt (Installation)

Để cài đặt Clerk vào ứng dụng Client trong Monorepo, hãy sử dụng lệnh sau từ thư mục gốc của dự án:

```bash
pnpm add @clerk/nextjs --filter client
```

Sau khi cài đặt, hãy đảm bảo rằng `@clerk/nextjs` đã xuất hiện trong `dependencies` của `apps/client/package.json`.

## 1. Thiết lập & Biến môi trường

Các biến môi trường sau đây phải được định nghĩa trong `apps/client/.env` hoặc `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Chỉ định các URL tùy chỉnh cho Auth
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 1.5 Middleware Setup

Để bảo vệ các route và xử lý xác thực trên máy chủ (SSR), bạn cần tạo file `src/proxy.ts`:

```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Bỏ qua các file hệ thống Next.js và các file tĩnh, trừ khi có trong search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Luôn chạy cho các API routes
    "/(api|trpc)(.*)",
  ],
};
```

## 2. Clerk Provider

`ClerkProvider` được lồng bên trong thành phần `Providers` dùng chung của ứng dụng để cung cấp ngữ cảnh xác thực cho toàn bộ cây thành phần.

- **Vị trí file:** `apps/client/src/components/Providers.tsx`

```tsx
import { ClerkProvider } from "@clerk/nextjs";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};
```

## 3. Các Trang Auth Tùy chỉnh (Custom Pages)

Chúng ta sử dụng cấu trúc **Optional Catch-all Routes** để bọc giao diện của Clerk vào bên trong Layout của ứng dụng thay vì dùng các trang mặc định của Clerk.

- **SignIn:** `apps/client/src/app/sign-in/[[...sign-in]]/page.tsx`
- **SignUp:** `apps/client/src/app/sign-up/[[...sign-up]]/page.tsx`

> [!IMPORTANT]
> Luôn phải chỉ định thuộc tính `path` và `routing="path"` để tránh lỗi **Hydration Mismatch** (không khớp HTML giữa Server và Client).

```tsx
<SignIn path="/sign-in" routing="path" />
```

## 4. Các Thành phần Điều hướng

Sử dụng các thành phần luân chuyển của Clerk để điều khiển hiển thị theo trạng thái đăng nhập:

- **SignedOut:** Hiển thị nút `SignInButton`.
- **SignedIn:** Hiển thị `ProfileButton` (Thành phần bao bọc `UserButton`).

### Tùy chỉnh ProfileButton

Thành phần `ProfileButton` (`src/components/ProfileButton.tsx`) mở rộng `UserButton` của Clerk để thêm các liên kết chức năng của dự án:

- Thêm mục "See Orders" dẫn hướng tới `/orders`.

## 5. Tips & Troubleshooting (Xử lý sự cố)

### Lỗi: "Hydration failed..."

- **Nguyên nhân:** HTML rendered ở Server khác với Client do cấu trúc thẻ `div` của Clerk không khớp.
- **Khắc phục:** Đảm bảo truyền đủ `path` và `routing="path"` vào `<SignIn />` hoặc `<SignUp />`.

### Lỗi: "Next.js Router not mounted"

- **Nguyên nhân:** Sử dụng `useRouter` từ `next/router` (dành cho Pages Router).
- **Khắc phục:** Luôn import `useRouter` từ `next/navigation` vì chúng ta đang sử dụng App Router.

### Lỗi: "Multiple children to <SignUpButton/>"

- **Nguyên nhân:** Có khoảng trắng hoặc thẻ lồng nhau không hợp lệ trong Button của Clerk.
- **Khắc phục:** Sử dụng thuộc tính `children={<button>...</button>}` để đảm bảo tính ổn định của thẻ.
