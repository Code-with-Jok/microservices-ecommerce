import Fastify, { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { clerkPlugin } from "@clerk/fastify";

import { swaggerOptions, swaggerUiOptions } from "./config/swagger.js";
import rootRouter from "./routes/index.js";

const createApp = async (): Promise<FastifyInstance> => {
  const fastify = Fastify({
    logger: true,
  });

  // Global Middlewares/Plugins
  await fastify.register(clerkPlugin);

  // Swagger Documentation
  await fastify.register(fastifySwagger, swaggerOptions as any);
  await fastify.register(fastifySwaggerUi, swaggerUiOptions as any);

  // API Routes with Versioning
  await fastify.register(rootRouter, { prefix: "/api/v1" });

  return fastify;
};

export default createApp;
