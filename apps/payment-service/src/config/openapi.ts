export const openApiDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Payment Service API",
    version: "1.0.0",
    description: "Payment Service API Documentation",
  },
  servers: [
    {
      url: "/api/v1",
      description: "API V1 Base Path",
    },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Get service health status",
        tags: ["health"],
        responses: {
          200: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    uptime: { type: "number" },
                    timestamp: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/protected": {
      get: {
        summary: "Protected payment endpoint",
        tags: ["auth"],
        security: [{ ClerkAuth: [] }],
        responses: {
          200: {
            description: "Authenticated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    userId: { type: "string" },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      ClerkAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Clerk session token",
      },
    },
  },
};
