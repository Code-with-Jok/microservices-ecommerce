import { Hono } from "hono";
import { cors } from "hono/cors";
import { clerkMiddleware } from "@hono/clerk-auth";
import { swaggerUI } from "@hono/swagger-ui";

import { openApiDefinition } from "./config/openapi.js";
import rootRouter from "./routes/index.js";

const app = new Hono();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000",
  "http://localhost:8000",
  "http://localhost:8001",
  "http://localhost:8002",
];

// Global Middlewares
app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return origin;
      }
      return null;
    },
    credentials: true,
  })
);
app.use("*", clerkMiddleware());

// Swagger Documentation
app.get("/docs", swaggerUI({ url: "/openapi.json" }));
app.get("/openapi.json", (c) => c.json(openApiDefinition));

// Health Check & Payment Routes
app.route("/api/v1", rootRouter);

export default app;
