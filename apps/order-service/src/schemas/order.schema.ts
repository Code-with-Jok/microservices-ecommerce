import { FastifySchema } from "fastify";

export const healthSchema: FastifySchema = {
  description: "Get service health status",
  tags: ["health"],
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "string" },
        uptime: { type: "number" },
        timestamp: { type: "number" },
      },
      example: {
        status: "ok",
        uptime: 125.45,
        timestamp: 1712154000000,
      },
    },
  },
};

export const protectedSchema: FastifySchema = {
  description: "Xác thực danh tính và lấy thông tin người dùng từ Clerk",
  tags: ["auth"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Authenticated successfully",
      type: "object",
      properties: {
        message: { type: "string" },
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            firstName: { type: "string", nullable: true },
            lastName: { type: "string", nullable: true },
            emailAddress: { type: "string", nullable: true },
            profileImageUrl: { type: "string", nullable: true },
          },
        },
      },
      example: {
        message: "Order service authenticated",
        user: {
          id: "user_2pX...",
          firstName: "John",
          lastName: "Doe",
          emailAddress: "john.doe@example.com",
          profileImageUrl: "https://img.clerk.com/...",
        },
      },
    },
    401: {
      description: "Unauthorized",
      type: "object",
      properties: {
        error: { type: "string" },
        message: { type: "string" },
      },
      example: {
        error: "Unauthorized",
        message: "User not found in request",
      },
    },
  },
};

export const userOrderSchema: FastifySchema = {
  description: "Lấy danh sách đơn hàng của người dùng đang đăng nhập",
  tags: ["orders"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        orders: {
          type: "array",
          items: { type: "object", additionalProperties: true },
        },
      },
      example: {
        message: "User orders retrieved successfully",
        orders: [
          {
            _id: "660c...",
            userId: "user_2pX...",
            email: "john@example.com",
            amount: 150.5,
            status: "success",
            products: [{ name: "Product 1", quantity: 1, price: 150.5 }],
            createdAt: "2024-04-03T10:00:00Z",
          },
        ],
      },
    },
  },
};

export const allOrdersSchema: FastifySchema = {
  description: "Lấy toàn bộ đơn hàng trong hệ thống (Yêu cầu đăng nhập)",
  tags: ["orders"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      limit: { 
        type: "integer", 
        minimum: 1,
        maximum: 100,
        default: 10,
        description: "Số lượng đơn hàng tối đa cần lấy (1-100, Mặc định: 10)"
      },
    },
    example: {
      limit: 20,
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        orders: {
          type: "array",
          items: { type: "object", additionalProperties: true },
        },
      },
      example: {
        message: "Latest orders retrieved successfully",
        orders: [
          {
            _id: "660c...",
            userId: "user_2pX...",
            email: "admin@example.com",
            amount: 99.99,
            status: "success",
            createdAt: "2024-04-03T11:00:00Z",
          },
        ],
      },
    },
  },
};

export const createOrderSchema: FastifySchema = {
  description: "Tạo một đơn hàng mới (Hệ thống tự động gán userId và email từ Token)",
  tags: ["orders"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["amount", "products"],
    properties: {
      amount: { 
        type: "number", 
        minimum: 0,
        description: "Tổng giá trị đơn hàng"
      },
      products: {
        type: "array",
        minItems: 1,
        description: "Danh sách sản phẩm",
        items: {
          type: "object",
          required: ["name", "quantity", "price"],
          properties: {
            name: { type: "string", description: "Tên sản phẩm" },
            quantity: { type: "integer", minimum: 1, description: "Số lượng" },
            price: { type: "number", minimum: 0, description: "Đơn giá" },
          },
        },
      },
      userId: { type: "string", description: "Mã người dùng (Tự động điền nếu để trống)" },
      email: { type: "string", format: "email", description: "Email người dùng (Tự động lấy từ Clerk nếu để trống)" },
    },
    example: {
      amount: 250.0,
      products: [
        { name: "iPhone 15 Pro", quantity: 1, price: 200.0 },
        { name: "Protective Case", quantity: 2, price: 25.0 },
      ],
    },
  },
  response: {
    201: {
      description: "Order created successfully",
      type: "object",
      properties: {
        message: { type: "string" },
        order: { type: "object", additionalProperties: true },
      },
      example: {
        message: "Order created successfully",
        order: {
          _id: "660c...",
          userId: "user_2pX...",
          email: "customer@example.com",
          amount: 250.0,
          status: "success",
          products: [
            { name: "iPhone 15 Pro", quantity: 1, price: 200.0 },
            { name: "Protective Case", quantity: 2, price: 25.0 },
          ],
          createdAt: "2024-04-03T12:00:00Z",
        },
      },
    },
  },
};

export const orderChartSchema: FastifySchema = {
  // ... (giữ nguyên phần còn lại)
  description: "Lấy dữ liệu thống kê đơn hàng trong 6 tháng gần nhất",
  tags: ["orders"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        sixMonthsAgo: { type: "string", format: "date-time" },
        results: {
          type: "array",
          items: {
            type: "object",
            properties: {
              month: { type: "string" },
              total: { type: "number" },
              successful: { type: "number" },
            },
          },
        },
      },
      example: {
        message: "Order chart retrieved successfully",
        sixMonthsAgo: "2023-10-03T00:00:00Z",
        results: [
          { month: "October", total: 10, successful: 8 },
          { month: "November", total: 15, successful: 12 },
          { month: "December", total: 25, successful: 20 },
        ],
      },
    },
  },
};
