import swaggerJsDoc from "swagger-jsdoc";

const PORT = process.env.PORT || 8000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Product Service API",
      version: "1.0.0",
      description: "Product Service API Documentation",
    },
    servers: [
      {
        url: `${process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`}/api/v1`,
        description: "API Server",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/docs/*.ts", "./src/index.ts"],
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
