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
        url: `http://localhost:${PORT}/api/v1`,
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/index.ts"],
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
