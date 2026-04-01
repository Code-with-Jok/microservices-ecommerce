import { FastifySwaggerOptions } from "@fastify/swagger";
import { FastifySwaggerUiOptions } from "@fastify/swagger-ui";

const port = Number(process.env.PORT) || 8001;
const baseUrl = process.env.API_BASE_URL || `${process.env.HOST || "http://localhost"}:${port}`;

export const swaggerOptions = {
  mode: "dynamic" as const,
  openapi: {
    info: {
      title: "Order Service API",
      description: "Order Service API Documentation",
      version: "1.0.0",
    },
    servers: [
      {
        url: `${baseUrl}/api/v1`,
        description: "API Server",
      },
    ],
  },
};

export const swaggerUiOptions: FastifySwaggerUiOptions = {
  routePrefix: "/docs",
};
