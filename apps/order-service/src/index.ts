import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const fastify = Fastify({
  logger: true,
});

await fastify.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Order Service API",
      description: "Order Service API Documentation",
      version: "1.0.0",
    },
  },
});

await fastify.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

fastify.get(
  "/health",
  {
    schema: {
      description: "Get service health status",
      tags: ["health"],
      response: {
        200: {
          description: "Successful response",
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
  async (request, reply) => {
    return reply.status(200).send({
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now(),
    });
  }
);

const start = async () => {
  const port = Number(process.env.PORT) || 8001;
  const host = "0.0.0.0";
  try {
    await fastify.listen({ port, host });
    fastify.log.info(`Order service is running on ${host}:${port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
