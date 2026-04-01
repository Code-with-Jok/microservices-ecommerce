import { Hono } from "hono";
import { clerkMiddleware } from "@hono/clerk-auth";
import { swaggerUI } from "@hono/swagger-ui";

import { openApiDefinition } from "./config/openapi.js";
import rootRouter from "./routes/index.js";

const app = new Hono();

// Global Middlewares
app.use("*", clerkMiddleware());

// Swagger Documentation
app.get("/docs", swaggerUI({ url: "/openapi.json" }));
app.get("/openapi.json", (c) => c.json(openApiDefinition));

// Health Check & Payment Routes
app.route("/api/v1", rootRouter);

export default app;
