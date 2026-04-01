# Integration: Shadcn UI + Monorepo (Tailwind v4)

Hướng dẫn tích hợp Shadcn/UI vào hệ thống Monorepo sử dụng Tailwind CSS v4, OKLCH color space và Turbopack.

## **Step 1: Setup Shared UI Package**

Tạo hoặc di chuyển vào thư mục `packages/ui` và đảm bảo các thư viện cốt lõi đã được cài đặt:

```bash
pnpm add lucide-react clsx tailwind-merge class-variance-authority @radix-ui/react-slot --filter @repo/ui
```

Đồng bộ Tailwind v4 cho toàn dự án:

```bash
pnpm add -wD tailwindcss@^4 @tailwindcss/postcss@^4
pnpm add -D tailwindcss@^4 --filter @repo/ui
```

## **Step 2: Configure components.json**

Tạo file `packages/ui/components.json` để điều hướng CLI cài đặt vào thư mục dùng chung:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tailwind": {
    "config": "",
    "css": "src/shadcn.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "src/components",
    "utils": "src/lib/utils",
    "ui": "src/components/ui"
  }
}
```

## **Step 3: Setup Design System (OKLCH)**

Tại `packages/ui/src/shadcn.css`, định nghĩa hệ màu và theme dùng chung:

```css
@import "tailwindcss";

@theme inline {
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);
  --color-primary: oklch(0.205 0 0);
  --color-primary-foreground: oklch(0.985 0 0);
  --color-destructive: oklch(0.577 0.245 27.325);
  /* ... các biến khác ... */
  
  --radius-lg: 0.5rem;
  --radius-md: calc(0.5rem - 2px);
  --radius-sm: calc(0.5rem - 4px);
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
}
```

## **Step 4: Configure App Integration**

Tại ứng dụng Client (`apps/client/src/app/globals.css`), kết nối với thư viện dùng chung:

```css
@import "tailwindcss";

/* 1. Chỉ định nguồn quét (Scan) mã nguồn UI Package */
@source "../../../../packages/ui/src/**/*.tsx";

/* 2. Import Shared Theme */
@import "@repo/ui/shadcn.css";
```

## **Step 5: Add Components**

Sử dụng lệnh sau tại thư mục gốc để thêm component từ registry của Shadcn:

```bash
pnpm dlx shadcn@latest add [component-name] -c packages/ui
```

## **Troubleshooting**

### **Missing Suggestions (Intellisense)**
Để VS Code gợi ý code tốt nhất trong Monorepo:
1. Đảm bảo `packages/ui/tsconfig.json` có `"rootDir": "."`.
2. Chạy lệnh `TypeScript: Restart TS Server` trong VS Code Command Palette.

### **CSS Resolution Error**
Nếu gặp lỗi `Can't resolve 'tailwindcss'`:
1. Đảm bảo `tailwindcss` đã được cài đặt ở cả Root và `packages/ui`.
2. Kiểm tra lại đường dẫn trong `@source` của ứng dụng client.

### **Radix UI Compatibility**
Nếu gặp lỗi `.Root` không tồn tại (Ví dụ: `LabelPrimitive.Root`):
Chuyển đổi về dạng gọi trực tiếp: `LabelPrimitive` hoặc `Slot`.
