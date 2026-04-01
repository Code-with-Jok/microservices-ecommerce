import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";

const app = new Hono();

app.get(
  "/docs",
  swaggerUI({
    url: "/openapi.json",
  })
);

app.get("/openapi.json", (c) => {
  return c.json({
    openapi: "3.0.0",
    info: {
      title: "Payment Service API",
      version: "1.0.0",
      description: "Payment Service API Documentation",
    },
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
    },
  });
});

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

const start = async () => {
  try {
    serve(
      {
        fetch: app.fetch,
        port: 8002,
      },
      (info) => {
        console.log(
          `Payment service is running on http://localhost:${info.port}`
        );
      }
    );
  } catch (error) {
    console.error("Failed to start payment service", error);
    process.exit(1);
  }
};

start();
