import { FastifySwaggerOptions } from "@fastify/swagger";
import { FastifySwaggerUiOptions } from "@fastify/swagger-ui";

const port = Number(process.env.PORT) || 8001;

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
        url: `http://localhost:${port}/api/v1`,
        description: "Local server",
      },
    ],
  },
};

export const swaggerUiOptions: FastifySwaggerUiOptions = {
  routePrefix: "/docs",
};
