import Fastify, { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { clerkPlugin } from "@clerk/fastify";

import { swaggerOptions, swaggerUiOptions } from "./config/swagger.js";
import rootRouter from "./routes/index.js";

const createApp = async (): Promise<FastifyInstance> => {
  const fastify = Fastify({
    logger: true,
    ajv: {
      customOptions: {
        // Cho phép sử dụng từ khóa 'example' (OpenAPI) trong JSON Schema mà không bị lỗi strict mode
        keywords: ["example"],
      },
    },
  });

  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3002",
  ];

  // Global Middlewares/Plugins
  await fastify.register(fastifyCors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  });

  await fastify.register(clerkPlugin);

  // Swagger Documentation
  await fastify.register(fastifySwagger, swaggerOptions as any);
  await fastify.register(fastifySwaggerUi, swaggerUiOptions as any);

  // API Routes with Versioning
  await fastify.register(rootRouter, { prefix: "/api/v1" });

  return fastify;
};

export default createApp;
